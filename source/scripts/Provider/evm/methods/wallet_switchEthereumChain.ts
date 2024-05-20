import {
  EIPErrorCodes,
  EIPRpcError,
  ProtocolProvider,
  StargazerRequest,
  StargazerRequestMessage,
} from 'scripts/common';
import { ALL_EVM_CHAINS, SUPPORTED_HEX_CHAINS } from 'constants/index';
import { changeActiveNetwork, changeCurrentEVMNetwork } from 'state/vault';
import store from 'state/store';
import { notifyChainChanged } from 'scripts/Background/handlers/handleDappMessages';

interface SwitchEthereumChainParameter {
  chainId: string;
}

export const wallet_switchEthereumChain = async (
  request: StargazerRequest & { type: 'rpc' },
  _message: StargazerRequestMessage,
  _sender: chrome.runtime.MessageSender
): Promise<null> => {
  const [chainData] = (request?.params as [SwitchEthereumChainParameter]) || [];

  if (!chainData || !chainData?.chainId) {
    throw new EIPRpcError('chainId not provided', EIPErrorCodes.Unauthorized);
  }

  const { chainId } = chainData;

  if (typeof chainId !== 'string') {
    throw new EIPRpcError('chainId must be a string', EIPErrorCodes.Unauthorized);
  }

  if (!chainId.startsWith('0x')) {
    throw new EIPRpcError(
      'chainId must specify the integer ID of the chain as a hexadecimal string',
      EIPErrorCodes.Unauthorized
    );
  }

  if (!SUPPORTED_HEX_CHAINS.includes(chainId)) {
    // Show network not supported popup
    throw new EIPRpcError('chainId not supported', EIPErrorCodes.Unauthorized);
  }

  const chainInfo = Object.values(ALL_EVM_CHAINS).find(
    (chain) => chain.hexChainId === chainId
  );

  try {
    const { network, id } = chainInfo;
    store.dispatch(changeCurrentEVMNetwork(id));
    store.dispatch(changeActiveNetwork({ network, chainId: id }));
    await notifyChainChanged(ProtocolProvider.ETHEREUM, id);
  } catch (e) {
    throw new EIPRpcError(
      'There was an error switching the Ethereum chain',
      EIPErrorCodes.ChainDisconnected
    );
  }

  // https://eips.ethereum.org/EIPS/eip-3326#returns
  return null;
};
