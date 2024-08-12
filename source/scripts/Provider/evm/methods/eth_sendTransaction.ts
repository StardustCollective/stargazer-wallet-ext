import { InputData as ContractInputData } from 'ethereum-input-data-decoder';
import {
  EIPErrorCodes,
  EIPRpcError,
  StargazerRequest,
  StargazerRequestMessage,
} from 'scripts/common';
import { ALL_EVM_CHAINS } from 'constants/index';
import { getERC20DataDecoder } from 'utils/ethUtil';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { getChainId, getNetworkId, getWalletInfo } from '../utils';

export const eth_sendTransaction = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const [trxData] = request.params;

  let decodedContractCall: ContractInputData | null = null;

  let route = 'sendTransaction';

  // chainId should match the current active network if chainId property is provided.
  if (trxData?.chainId) {
    const chainId = getChainId();

    if (typeof trxData.chainId === 'number') {
      if (trxData.chainId !== chainId) {
        throw new EIPRpcError(
          'chainId does not match the active network chainId',
          EIPErrorCodes.ChainDisconnected
        );
      }
    }

    if (typeof trxData.chainId === 'string') {
      if (parseInt(trxData.chainId) !== chainId) {
        throw new EIPRpcError(
          'chainId does not match the active network chainId',
          EIPErrorCodes.ChainDisconnected
        );
      }
    }
  }

  try {
    decodedContractCall =
      typeof trxData.data === 'string'
        ? getERC20DataDecoder().decodeData(trxData.data)
        : null;
  } catch (e) {
    console.log('EVMProvider:eth_sendTransaction', e);
  }

  const chainLabel = Object.values(ALL_EVM_CHAINS).find(
    (chain: any) => chain.chainId === getChainId()
  )?.label;

  if (decodedContractCall?.method === 'approve') {
    route = 'approveSpend';
  }

  const data = { ...trxData, chain: getNetworkId(), chainLabel };

  const { windowUrl, windowSize, windowType } = getWalletInfo();

  await StargazerExternalPopups.executePopupWithRequestMessage(
    data,
    message,
    sender.origin,
    route,
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
