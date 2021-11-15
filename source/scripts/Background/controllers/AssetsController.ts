import { XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';
import { ETHNetwork } from 'scripts/types';
import TOKEN_LIST from 'state/assets/tokens';
import store from 'state/store';
import { addERC20Asset } from 'state/assets';
import IVaultState, { AssetType } from 'state/vault/types';
import { TOKEN_INFO_API } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

export interface IAssetsController {
  fetchTokenInfo: (address: string) => Promise<void>;
}

const AssetsController = (updateFiat: () => void): IAssetsController => {
  const { activeNetwork }: IVaultState = store.getState().vault;

  if (!activeNetwork) return undefined;

  const ethClient: XChainEthClient = new XChainEthClient({
    network: activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork,
    privateKey: process.env.TEST_PRIVATE_KEY,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    infuraCreds: { projectId: process.env.INFURA_CREDENTIAL || '' },
  });


  // const getInitialERC20Tokens = () => {
  //   const assets: IAssetListState = store.getState().assets;
  //   const networks = ['mainnet', 'testnet'];
  //   if (Object.keys(assets).length > 3) return;

  //   networks.forEach((network: string) => {
  //     const tokens = ethClient.getKnownTokens(ETH_NETWORK[network].chainId);
  //     console.log(tokens);
  //   });
  // };

  const fetchTokenInfo = async (address: string) => {
    const { activeNetwork }: IVaultState = store.getState().vault;

    const network = activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork;
    ethClient.setNetwork(network);

    const info = await ethClient.getTokenInfo(address);
    const assetId = `${network === 'testnet' ? 'T-' : ''}${address}`;

    if (info) {
      try {
        let data;
        try {
          data = await (await fetch(`${TOKEN_INFO_API}${address}`)).json();
        } catch (err) {
          // Allow values to be set from config if CoinGecko doesn't know about token
          data = {
            id: TOKEN_LIST[address]?.priceId,
            image: {
              small: TOKEN_LIST[address]?.logo
            }
          }
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
      }
      catch(e) {
        // NOOP
      }
    }
  };

  return { fetchTokenInfo };
};

export default AssetsController;
