import { XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';
import { ETHNetwork } from 'scripts/types';
import IAssetListState from 'state/assets/types';
import store from 'state/store';
import { addERC20Asset } from 'state/assets';
import IVaultState, { AssetType } from 'state/vault/types';
import { TOKEN_INFO_API } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

export interface IAssetsController {
  fetchTokenInfo: (address: string) => void;
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
    const assets: IAssetListState = store.getState().assets;
    const network = activeNetwork[KeyringNetwork.Ethereum] as ETHNetwork;
    ethClient.setNetwork(network);
    const info = await ethClient.getTokenInfo(address);
    const assetId = `${network === 'testnet' ? 'T-' : ''}${address}`;
    if (info && !assets[assetId]) {
      try {
        const data = await (await fetch(`${TOKEN_INFO_API}${address}`)).json();

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
      catch(e) {}
    }
  };

  return { fetchTokenInfo };
};

export default AssetsController;
