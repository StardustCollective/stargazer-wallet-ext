import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { ethers } from 'ethers';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerChain, StargazerRequest, StargazerRequestMessage } from 'scripts/common';

import { validateHardwareMethod } from 'utils/hardware';

import { getChainId, getNetworkId, getWalletInfo, WINDOW_TYPES } from '../utils';
import { defaultTransactionHandlerRegistry, type EthSendTransaction, type TransactionHandlerResult, validateHexFields } from '../utils/handlers';

/**
 * Validates that the provided chainId matches the currently active network
 */
const validateChainId = (chain: string | number) => {
  const chainId = getChainId();
  if (!chain) return chainId;

  if (typeof chain === 'number') {
    if (chain !== chainId) {
      throw new EIPRpcError('chainId does not match the active network chainId', EIPErrorCodes.ChainDisconnected);
    }
  }

  if (typeof chain === 'string') {
    const radix = chain.startsWith('0x') ? 16 : 10;
    if (parseInt(chain, radix) !== chainId) {
      throw new EIPRpcError('chainId does not match the active network chainId', EIPErrorCodes.ChainDisconnected);
    }
  }

  return chainId;
};

/**
 * Main EVM transaction handler that processes eth_sendTransaction requests
 * Delegates to specific transaction type handlers based on transaction content
 */
export const eth_sendTransaction = async (request: StargazerRequest & { type: 'rpc' }, message: StargazerRequestMessage, sender: chrome.runtime.MessageSender) => {
  // Get wallet info and validate wallet state
  const { activeWallet, windowUrl, windowSize, windowType } = getWalletInfo();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  // Ensure we have an Ethereum account for EVM transactions
  const assetAccount = activeWallet.accounts.find(account => account.network === KeyringNetwork.Ethereum);

  if (!assetAccount) {
    throw new Error('No active account for the request asset type');
  }

  // Extract transaction data from request
  const [transactionData] = request.params as [EthSendTransaction];

  if (!transactionData) {
    throw new EIPRpcError('Transaction data is required', EIPErrorCodes.Rejected);
  }

  // Validate sender address
  if (!transactionData.from || !ethers.utils.isAddress(transactionData.from)) {
    throw new EIPRpcError('Invalid sender address', EIPErrorCodes.Rejected);
  }

  // Validate sender matches active account
  if (transactionData.from.toLowerCase() !== assetAccount.address.toLowerCase()) {
    throw new EIPRpcError('The active account is invalid', EIPErrorCodes.Rejected);
  }

  // Validate hex string fields before further processing
  validateHexFields(transactionData);

  // Validate chainId if provided
  const chainId = validateChainId(transactionData.chainId);

  // Validate hardware wallet compatibility
  validateHardwareMethod(activeWallet.type, request.method);

  // Get current chain information
  const chain = getNetworkId() as StargazerChain;

  let handlerResult: TransactionHandlerResult;

  const transaction: EthSendTransaction = {
    chainId,

    from: transactionData.from,
    to: transactionData.to,
    value: transactionData.value,
    data: transactionData.data,

    gas: transactionData.gas,
    gasPrice: transactionData.gasPrice,
  };

  try {
    // Delegate to the appropriate transaction handler
    handlerResult = await defaultTransactionHandlerRegistry.handleTransaction(transaction, chain);
  } catch (error) {
    console.error('Transaction handler error:', error);

    // Re-throw EIPRpcError as-is, wrap other errors
    if (error instanceof EIPRpcError) {
      throw error;
    }

    throw new EIPRpcError(error instanceof Error ? error.message : 'Failed to process transaction', EIPErrorCodes.Rejected);
  }

  const { data, route } = handlerResult;

  if (windowType === WINDOW_TYPES.popup) {
    windowSize.height = 780;
  }

  // Launch the appropriate external popup for user interaction
  await StargazerExternalPopups.executePopup({
    params: {
      data,
      message,
      origin: sender.origin,
      route,
    },
    size: windowSize,
    type: windowType,
    url: windowUrl,
  });

  // Return the no-response indicator as this is handled by the popup
  return StargazerWSMessageBroker.NoResponseEmitted;
};
