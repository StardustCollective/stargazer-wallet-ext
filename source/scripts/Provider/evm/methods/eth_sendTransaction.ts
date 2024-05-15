import { DappProvider } from 'scripts/Background/dappRegistry';
import { ExternalMessageID } from 'scripts/Background/messaging/types';
import { InputData as ContractInputData } from 'ethereum-input-data-decoder';
import { EIPErrorCodes, EIPRpcError, StargazerProxyRequest } from 'scripts/common';
import { getChainId, getNetworkId } from '../utils';
import { ALL_EVM_CHAINS } from 'constants/index';
import { getERC20DataDecoder } from 'utils/ethUtil';

export const eth_sendTransaction = async (
  request: StargazerProxyRequest & { type: 'rpc' },
  dappProvider: DappProvider,
  port: chrome.runtime.Port
): Promise<string[]> => {
  const [trxData] = request.params;

  let decodedContractCall: ContractInputData | null = null;
  let eventType = ExternalMessageID.transactionSent;
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
    eventType = ExternalMessageID.spendApproved;
    route = 'approveSpend';
  }

  const event = await dappProvider.createPopupAndWaitForMessage(
    port,
    eventType,
    undefined,
    route,
    {
      ...trxData,
      chain: getNetworkId(),
      chainLabel,
    }
  );

  if (event === null) {
    throw new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected);
  }

  if (event.detail.error) {
    throw new EIPRpcError(event.detail.error, EIPErrorCodes.Rejected);
  }

  if (!event.detail.result) {
    throw new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected);
  }

  return event.detail.result;
};
