import { XChainEthClient } from '@stardust-collective/dag4-xchain-ethereum';
import { ETH_NETWORK } from 'constants/index';
import store from 'state/store';
import IWalletState, { AssetType } from 'state/wallet/types';

interface IAssetsController {
  getInitialERC20Tokens: () => {};
}

const AssetsController = (ethClient: XChainEthClient) => {
  const getInitialERC20Tokens = () => {
    const { activeNetwork }: IWalletState = store.getState();
    const tokens = ethClient.getKnownTokens(
      ETH_NETWORK[activeNetwork[AssetType.Ethereum]].chainId
    );
    console.log(tokens);
  };

  return {
    getInitialERC20Tokens,
  };
};

export default AssetsController;
