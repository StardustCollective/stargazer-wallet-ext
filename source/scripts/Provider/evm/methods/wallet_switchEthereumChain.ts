import {
  EIPErrorCodes,
  EIPRpcError,
  StargazerRequest,
  StargazerRequestMessage,
} from 'scripts/common';
import { ALL_EVM_CHAINS, SUPPORTED_HEX_CHAINS } from 'constants/index';
import { useController } from 'hooks/index';

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

  // TODO: remove controller dependency
  const controller = useController();
  const chainInfo = Object.values(ALL_EVM_CHAINS).find(
    (chain) => chain.hexChainId === chainId
  );

  try {
    await controller.wallet.switchNetwork(chainInfo.network, chainInfo.id);
  } catch (e) {
    throw new EIPRpcError(
      'There was an error switching the Ethereum chain',
      EIPErrorCodes.ChainDisconnected
    );
  }

  // https://eips.ethereum.org/EIPS/eip-3326#returns
  return null;
};
