import { XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';
import { ETHNetwork } from 'scripts/types';
import { initialState as tokenState, addERC20Asset } from 'state/assets';
import { addNFTAsset } from 'state/nfts';
import { IOpenSeaNFT } from 'state/nfts/types';
import store from 'state/store';
import IVaultState, { AssetType } from 'state/vault/types';
import { 
  TOKEN_INFO_API, 
  NFT_MAINNET_API, 
  NFT_TESTNET_API 
} from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

export interface IAssetsController {
  fetchTokenInfo: (address: string) => Promise<void>;
  fetchWalletNFTInfo: (address: string) => Promise<void>;
}

const AssetsController = (updateFiat: () => void): IAssetsController => {
  let { activeNetwork }: IVaultState = store.getState().vault;

  if (!activeNetwork) return undefined;

  const ethClient: XChainEthClient = new XChainEthClient({
    network: activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork,
    privateKey: process.env.TEST_PRIVATE_KEY,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
  });

  const fetchTokenInfo = async (address: string) => {
    activeNetwork = store.getState().vault.activeNetwork;

    const network = activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork;
    ethClient.setNetwork(network);

    const info = await ethClient.getTokenInfo(address);
    const assetId = `${network === 'testnet' ? 'T-' : ''}${address}`;

    if (!info) {
      return;
    }

    const tokenList = Object.values(tokenState).filter((token) => {
      return token.type === AssetType.ERC20;
    });

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

  const fetchWalletNFTInfo = async (walletAddress: string): Promise<any> => {
    activeNetwork = store.getState().vault.activeNetwork;
    const network = activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork;
    const apiBase = network === 'testnet' ? NFT_TESTNET_API : NFT_MAINNET_API;

    let data: any;
    try {
      const apiEndpoint = `${apiBase}assets?owner=${walletAddress}`;
      data = await (await fetch(apiEndpoint)).json();
    } catch (err) {
      // NOOP
    }

    const nfts: IOpenSeaNFT[] = data.assets;

    if (!nfts.length) {
      return [];
    }

    const groupedNFTs = nfts.reduce((carry: Record<string, any>, nft: any) => {
      const address = nft.asset_contract.address;
      if (!carry[address]) {
        carry[address] = { ...nft, quantity: 0 };
      }

      carry[address].quantity += 1;

      return carry;
    }, {});

    Object.values(groupedNFTs).forEach((nft: any) => {
      console.log('NFT DISPATCHING -> ', nft);
      store.dispatch(
        addNFTAsset({
          id: nft.id,
          type: nft.asset_contract.schema_name === 'ERC721' ? AssetType.ERC721 : AssetType.ERC1155,
          label: nft.name,
          address: nft.asset_contract.address,
          quantity: nft.quantity,
          link: nft.permalink,
          logo: nft.image_thumbnail_url,
        })
      );
    })

    return Object.values(groupedNFTs);
  };

  return { fetchTokenInfo, fetchWalletNFTInfo };
};

export default AssetsController;
