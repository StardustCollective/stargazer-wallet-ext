import { addERC20Asset, removeERC20Asset } from 'state/assets';
import { addNFTAsset, resetNFTState } from 'state/nfts';
import { IOpenSeaNFT } from 'state/nfts/types';
import store from 'state/store';
import IVaultState, { AssetType } from 'state/vault/types';
import { TOKEN_INFO_API, NFT_MAINNET_API, NFT_TESTNET_API, ETHEREUM_DEFAULT_LOGO } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { clearErrors as clearErrorsDispatch, clearPaymentRequest as clearPaymentRequestDispatch, setRequestId as setRequestIdDispatch} from 'state/providers';
import { getQuote, getSupportedAssets, paymentRequest } from 'state/providers/api';
import { GetQuoteRequest, PaymentRequestBody } from 'state/providers/types';
import { EthChainId } from './EVMChainController/types';
import { isTestnet, validateAddress } from './EVMChainController/utils';
import { getERC20Assets, search } from 'state/erc20assets/api';
import { addAsset, removeAsset } from 'state/vault';
import { IAssetInfoState } from 'state/assets/types';
import { addCustomAsset, clearCustomAsset, clearSearchAssets as clearSearch, removeCustomAsset } from 'state/erc20assets';

// Batch size for OpenSea API requests (max 50)
const BATCH_SIZE = 50;

// DTM and Alkimi NFTs should appear on top by default
const DTM_STRINGS = ['DTM', 'Dor Traffic', 'Dor Foot Traffic'];
const ALKIMI_STRING = 'alkimi';

export interface IAssetsController {
  clearCustomToken: () => void;
  addCustomERC20Asset: (address: string, name: string, symbol: string, decimals: string) => Promise<void>;
  removeCustomERC20Asset: (asset: IAssetInfoState) => void;
  getCustomAssets: () => void;
  fetchWalletNFTInfo: (address: string) => Promise<void>;
  fetchSupportedAssets: () => Promise<void>;
  fetchERC20Assets: () => Promise<void>;
  searchERC20Assets: (value: string) => Promise<void>;
  addERC20AssetFn: (asset: IAssetInfoState) => void;
  removeERC20AssetFn: (asset: IAssetInfoState) => void;
  clearSearchAssets: () => void;
  fetchQuote: (data: GetQuoteRequest) => Promise<void>;
  fetchPaymentRequest: (data: PaymentRequestBody) => Promise<void>;
  setRequestId: (value: string) => void;
  clearErrors: () => void;
  clearPaymentRequest: () => void;
}

const AssetsController = (): IAssetsController => {
  let { activeNetwork }: IVaultState = store.getState().vault;

  if (!activeNetwork) return undefined;
  
  const clearCustomToken = (): void => {
    store.dispatch(clearCustomAsset());
  }

  const fetchNFTBatch = async (walletAddress: string, offset = 0) => {
    const activeNetwork = store.getState().vault.activeNetwork;
    // OpenSea only supports Ethereum on v1 so it's fine to check activeNetwork on Ethereum here.
    const network = activeNetwork[KeyringNetwork.Ethereum] as EthChainId;
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

  const searchERC20Assets = async (value: string): Promise<void> => {
    await store.dispatch<any>(search(value));
  }

  const clearSearchAssets = (): void => {
    store.dispatch(clearSearch());
  }

  const addCustomERC20Asset = async (address: string, name: string, symbol: string, decimals: string): Promise<void> => {
    if (!validateAddress(address)) return;

    const { activeNetwork } = store.getState().vault;
    const assets = store.getState().assets;
    // TODO-349: Check if we should add custom tokens only on Ethereum
    const network = activeNetwork.Ethereum as EthChainId;
    let logo = ETHEREUM_DEFAULT_LOGO;
    let tokenData;

    try {
      tokenData = await (await fetch(`${TOKEN_INFO_API}${address}`)).json();
    } catch (err) {
      console.log('Token Error:', err);
    }

    if (!tokenData?.error) {
      logo = tokenData.image.small;
    }

    const newAsset: IAssetInfoState = {
      id: address,
      address,
      label: name,
      symbol,
      decimals: parseInt(decimals),
      type: AssetType.ERC20,
      priceId: tokenData?.id || '',
      logo,
      network,
      custom: true,
    }

    const asset = Object.keys(assets).find(assetId => assetId === newAsset.address);
    if (!asset) {
      store.dispatch(addCustomAsset(newAsset));
      addERC20AssetFn(newAsset);
    }
  }

  const removeCustomERC20Asset = (asset: IAssetInfoState): void => {
    store.dispatch(removeCustomAsset(asset));
    removeERC20AssetFn(asset);
  }

  const getCustomAssets = (): void => {
    const { assets } = store.getState();
    for (const asset in assets) {
      if (assets[asset]?.custom) {
        store.dispatch(addCustomAsset(assets[asset]));
      }
    }
  }

  const addERC20AssetFn = (asset: IAssetInfoState): void => {
    const { activeWallet } = store.getState().vault;
    const ethAddress = activeWallet?.assets?.find(asset => asset.type === AssetType.Ethereum)?.address;
    store.dispatch(addERC20Asset(asset));
    store.dispatch(addAsset({
      id: asset.id,
      type: asset.type,
      label: asset.label,
      address: ethAddress,
      contractAddress: asset.address,
    }));
  }

  const removeERC20AssetFn = (asset: IAssetInfoState): void => {
    store.dispatch(removeERC20Asset(asset));
    store.dispatch(removeAsset(asset));
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

  return { 
     clearCustomToken,
     addCustomERC20Asset,
     removeCustomERC20Asset,
     getCustomAssets,
     fetchWalletNFTInfo,
     fetchSupportedAssets,
     searchERC20Assets,
     clearSearchAssets,
     fetchERC20Assets,
     addERC20AssetFn,
     removeERC20AssetFn,
     fetchQuote,
     fetchPaymentRequest,
     setRequestId,
     clearErrors,
     clearPaymentRequest
  };
};

export default AssetsController;
