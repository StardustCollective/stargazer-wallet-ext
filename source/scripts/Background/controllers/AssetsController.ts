import { initialState as tokenState, addERC20Asset, removeERC20Asset } from 'state/assets';
import { addNFTAsset, resetNFTState } from 'state/nfts';
import { IOpenSeaNFT } from 'state/nfts/types';
import store from 'state/store';
import IVaultState, { AssetType } from 'state/vault/types';
import { TOKEN_INFO_API, NFT_MAINNET_API, NFT_TESTNET_API } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { clearErrors as clearErrorsDispatch, clearPaymentRequest as clearPaymentRequestDispatch, setRequestId as setRequestIdDispatch} from 'state/providers';
import { getQuote, getSupportedAssets, paymentRequest } from 'state/providers/api';
import { GetQuoteRequest, PaymentRequestBody } from 'state/providers/types';
import { EthNetworkId } from './EthChainController/types';
import EthChainController from './EthChainController';
import { isTestnet } from './EthChainController/utils';
import { getERC20Assets, getERC20AssetsWithAddress } from 'state/erc20assets/api';

// Batch size for OpenSea API requests (max 50)
const BATCH_SIZE = 50;

// DTM and Alkimi NFTs should appear on top by default
const DTM_STRINGS = ['DTM', 'Dor Traffic', 'Dor Foot Traffic'];
const ALKIMI_STRING = 'alkimi';

export interface IAssetsController {
  fetchTokenInfo: (address: string) => Promise<void>;
  fetchWalletNFTInfo: (address: string) => Promise<void>;
  fetchSupportedAssets: () => Promise<void>;
  fetchERC20Assets: () => Promise<void>;
  fetchERC20AssetsWithAddress: () => Promise<void>;
  addERC20AssetFn: () => Promise<void>;
  removeERC20AssetFn: () => Promise<void>;
  fetchQuote: (data: GetQuoteRequest) => Promise<void>;
  fetchPaymentRequest: (data: PaymentRequestBody) => Promise<void>;
  setRequestId: (value: string) => void;
  clearErrors: () => void;
  clearPaymentRequest: () => void;
}

const AssetsController = (updateFiat: () => void): IAssetsController => {
  let { activeNetwork }: IVaultState = store.getState().vault;

  if (!activeNetwork) return undefined;

  const ethClient: EthChainController = new EthChainController({
    network: activeNetwork[KeyringNetwork.Ethereum] as EthNetworkId,
    privateKey: process.env.TEST_PRIVATE_KEY,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
  });

  const fetchTokenInfo = async (address: string) => {
    const activeNetwork = store.getState().vault.activeNetwork;

    const network = activeNetwork[KeyringNetwork.Ethereum] as EthNetworkId;
    ethClient.setNetwork(network);

    const info = await ethClient.getTokenInfo(address);
    const assetId = `${isTestnet(network) ? 'T-' : ''}${address}`;

    if (!info) {
      return;
    }

    const tokenList = Object.values(tokenState).filter((token) => token.type === AssetType.ERC20);

    try {
      let data;
      try {
        data = await (await fetch(`${TOKEN_INFO_API}${address}`)).json();
      } catch (err) {
        // Allow values to be set from config if CoinGecko doesn't know about token
        data = {
          id: tokenList[address as any]?.priceId,
          image: {
            small: tokenList[address as any]?.logo,
          },
        };
      }

      store.dispatch(
        addERC20Asset({
          id: assetId,
          decimals: info.decimals,
          type: AssetType.ERC20,
          label: info.name,
          symbol: info.symbol,
          address: info.address,
          priceId: data.id,
          logo: data.image.small,
          network,
        })
      );

      updateFiat();
    } catch (e) {
      // NOOP
    }
  };

  const fetchNFTBatch = async (walletAddress: string, offset = 0) => {
    const activeNetwork = store.getState().vault.activeNetwork;
    const network = activeNetwork[KeyringNetwork.Ethereum] as EthNetworkId;
    const apiBase = isTestnet(network) ? NFT_TESTNET_API : NFT_MAINNET_API;

    // OpenSea testnets API call is failing or taking a long time to respond.
    // We should update this logic to display NFTs when OpenSea fixes the testnets API.
    if (isTestnet(network)) {
      return {
        assets: []
      }
    }

    const apiEndpoint = `${apiBase}assets?owner=${walletAddress}&limit=${BATCH_SIZE}&offset=${offset}`;
    const headers = isTestnet(network) ? undefined : { headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY } };
    const response = await fetch(apiEndpoint, headers);

    return response.json();
  };

  const fetchWalletNFTInfo = async (walletAddress: string): Promise<any> => {
    let nfts: IOpenSeaNFT[] = [];
    try {
      const { assets } = await fetchNFTBatch(walletAddress, 0);
      nfts = assets;

      // Fetch up to 100 NFTs
      if (nfts.length === BATCH_SIZE) {
        const { assets: b2Assets } = await fetchNFTBatch(walletAddress, BATCH_SIZE);

        nfts = nfts.concat(b2Assets);
      }

      // Clear out previous NFT state to be fully replaced
      store.dispatch(resetNFTState());
    } catch (err) {
      // NOOP
      console.log('fetchNFTBatch err: ', err);
    }

    const groupedNFTs = nfts.reduce((carry: Record<string, any>, nft: any) => {
      const { address, schema_name: schemaName } = nft.asset_contract; // eslint-disable-line camelcase

      // Group ERC1155s by contract but separate each ERC721 individually
      const key = schemaName === 'ERC1155' ? address : `${address}-${nft.token_id}`;

      if (!carry[key]) {
        carry[key] = { ...nft, quantity: 1 };
      } else {
        carry[key].quantity += 1;
      }

      return carry;
    }, {});

    const retNFTs: any[] = Object.values(groupedNFTs)
      .filter((nft) => nft.name && nft.name.length > 0)
      .sort((a: any, b: any) => {
        // Move DTM and Alkimi tokens to the top
        const aIsDTM = DTM_STRINGS.some((str: string) => a.name.toLowerCase().includes(str.toLowerCase()));
        const bIsDTM = DTM_STRINGS.some((str: string) => b.name.toLowerCase().includes(str.toLowerCase()));
        const aIsAlkimi = a.name.toLowerCase().includes(ALKIMI_STRING);
        const bIsAlkimi = b.name.toLowerCase().includes(ALKIMI_STRING);

        if (aIsDTM && bIsDTM) return 0;
        if (aIsDTM && !bIsDTM) return -1;
        if (!aIsDTM && bIsDTM) return 1;
        if (aIsAlkimi && bIsAlkimi) return 0;
        if (aIsAlkimi && !bIsAlkimi) return -1;
        if (!aIsAlkimi && bIsAlkimi) return 1;

        return -1;
      })
      .map((nft: any) => {
        const { address, schema_name: schemaName } = nft.asset_contract; // eslint-disable-line camelcase
        const isERC721 = schemaName === 'ERC721' ? AssetType.ERC721 : AssetType.ERC1155;

        const id = isERC721 ? `${address}-${nft.token_id}` : address;

        const nftData = {
          id,
          type: isERC721 ? AssetType.ERC721 : AssetType.ERC1155,
          label: nft.name,
          address: nft.asset_contract.address,
          quantity: nft.quantity,
          link: nft.permalink,
          logo: nft.image_thumbnail_url || '',
        };

        store.dispatch(addNFTAsset(nftData));

        return nftData;
      });

    return retNFTs;
  };


  const fetchERC20Assets = async (): Promise<void> => {
    await store.dispatch<any>(getERC20Assets());
  }

  const fetchERC20AssetsWithAddress = async (): Promise<void> => {
    await store.dispatch<any>(getERC20AssetsWithAddress());
  }

  const addERC20AssetFn = async (): Promise<void> => {
    await store.dispatch<any>(addERC20Asset());
  }

  const removeERC20AssetFn = async (): Promise<void> => {
    await store.dispatch<any>(removeERC20Asset());
  }

  const fetchSupportedAssets = async (): Promise<void> => {
    await store.dispatch<any>(getSupportedAssets());
  }

  const fetchQuote = async (data: GetQuoteRequest): Promise<void> => {
    await store.dispatch<any>(getQuote(data));
  }

  const fetchPaymentRequest = async (data: PaymentRequestBody): Promise<void> => {
    await store.dispatch<any>(paymentRequest(data));
  }

  const setRequestId = (value: string): void => {
    store.dispatch(setRequestIdDispatch(value));
  }

  const clearErrors = (): void => {
    store.dispatch(clearErrorsDispatch());
  }

  const clearPaymentRequest = (): void => {
    store.dispatch(clearPaymentRequestDispatch());
  }

  return { fetchTokenInfo, fetchWalletNFTInfo, fetchSupportedAssets, fetchERC20Assets, fetchERC20AssetsWithAddress, addERC20AssetFn, removeERC20AssetFn, fetchQuote, fetchPaymentRequest, setRequestId, clearErrors, clearPaymentRequest };
};

export default AssetsController;
