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
import { getChainId, getNetworkId, getNetworkInfo, getWalletInfo } from '../utils';
import { BigNumber } from 'ethers';
import StargazerRpcProvider from '../StargazerRpcProvider';
import { tokenContractHelper } from 'scripts/Background/helpers/tokenContractHelper';

const calculateTransferAmount = async (
  amount: BigNumber,
  contractAddress: string
): Promise<number> => {
  // Fetch contract info to get the decimals
  const networkInfo = getNetworkInfo();
  const provider = new StargazerRpcProvider(networkInfo.rpcEndpoint);
  const contractInfo = await tokenContractHelper.getTokenInfo(provider, contractAddress);
  const decimals = contractInfo?.decimals || 18;

  // Calculate the value based on the decimals
  return Number(amount.toString()) / 10 ** decimals;
};

export const eth_sendTransaction = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  const [trxData] = request.params;

  let decodedContractCall: ContractInputData | null = null;

  let route = 'sendTransaction';
  let isTransfer = false;

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
  } else if (decodedContractCall?.method === 'transfer') {
    isTransfer = true;

    if (!decodedContractCall?.inputs?.length || decodedContractCall?.inputs?.length < 2) {
      throw new EIPRpcError('Invalid transfer method call', EIPErrorCodes.Rejected);
    }

    // Get the amount from the decoded contract call
    const amount = decodedContractCall.inputs[1] as BigNumber;
    const contractAddress = trxData.to;

    // Assign the value to the trxData object
    trxData.value = await calculateTransferAmount(amount, contractAddress);
  }

  const data = { ...trxData, isTransfer, chain: getNetworkId(), chainLabel };

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
