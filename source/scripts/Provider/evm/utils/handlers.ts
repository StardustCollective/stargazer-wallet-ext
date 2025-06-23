import { InputData as ContractInputData } from 'ethereum-input-data-decoder';
import { BigNumber, ethers } from 'ethers';

import { SignTransactionDataEVM, TransactionType } from 'scenes/external/SignTransaction/types';

import { EIPErrorCodes, EIPRpcError } from 'scripts/common';

import { getERC20DataDecoder } from 'utils/ethUtil';

import { ExternalRoute } from 'web/pages/External/types';

/**
 * Base transaction data structure for EVM transactions
 */
export type EthSendTransaction = {
  from: string;
  to?: string;
  value?: string;
  gas?: string;
  gasPrice?: string;
  data?: string;
  chainId?: number;
};

/**
 * Result structure returned by transaction handlers
 */
export interface TransactionHandlerResult {
  data: SignTransactionDataEVM;
  route: ExternalRoute;
}

/**
 * Base interface for transaction handlers
 */
export interface TransactionHandler {
  /**
   * Checks if this handler can process the given transaction
   */
  canHandle(transaction: EthSendTransaction): boolean;

  /**
   * Processes the transaction and returns structured data
   */
  handle(transaction: EthSendTransaction): Promise<TransactionHandlerResult>;
}

/**
 * Validates if a string is a valid hex string
 */
export const isValidHexString = (value: string): boolean => {
  return /^0x[0-9a-fA-F]*$/.test(value);
};

/**
 * Validates if a hex string represents a positive number
 */
export const isPositiveHexValue = (value: string): boolean => {
  if (!isValidHexString(value)) return false;
  try {
    const bn = BigNumber.from(value);
    return bn.gt(0);
  } catch {
    return false;
  }
};

/**
 * Validates hex string fields in transaction data
 */
export const validateHexFields = (transaction: EthSendTransaction): void => {
  if (!!transaction.to && !isValidHexString(transaction.to)) {
    throw new EIPRpcError('Receiver address must be a valid address', EIPErrorCodes.Rejected);
  }

  if (!!transaction.value && !isValidHexString(transaction.value)) {
    throw new EIPRpcError('Transaction value must be a valid hex string', EIPErrorCodes.Rejected);
  }

  if (!!transaction.gas && !isValidHexString(transaction.gas)) {
    throw new EIPRpcError('Transaction gas must be a valid hex string', EIPErrorCodes.Rejected);
  }

  if (!!transaction.gasPrice && !isValidHexString(transaction.gasPrice)) {
    throw new EIPRpcError('Transaction gasPrice must be a valid hex string', EIPErrorCodes.Rejected);
  }

  if (!!transaction.data && !isValidHexString(transaction.data)) {
    throw new EIPRpcError('Transaction data must be a valid hex string', EIPErrorCodes.Rejected);
  }
};

/**
 * Handler for native ETH/token transfers (no smart contract interaction)
 */
export class NativeTransferHandler implements TransactionHandler {
  canHandle(transaction: EthSendTransaction): boolean {
    // Native transfers have no data field or empty data, and a value > 0
    const hasNoData = !transaction.data || ['0x', '0x0'].includes(transaction.data);
    const hasValue = transaction.value && isPositiveHexValue(transaction.value);

    return hasNoData && !!hasValue;
  }

  async handle(transaction: EthSendTransaction): Promise<TransactionHandlerResult> {
    // Validate hex fields first
    validateHexFields(transaction);

    // Validate required fields
    if (!transaction.to) {
      throw new EIPRpcError('Invalid recipient address for native transfer', EIPErrorCodes.Rejected);
    }

    if (!transaction.value || !isPositiveHexValue(transaction.value)) {
      throw new EIPRpcError('Invalid transfer amount', EIPErrorCodes.Rejected);
    }

    // Validate address format
    if (!ethers.utils.isAddress(transaction.to)) {
      throw new EIPRpcError('Invalid recipient address format', EIPErrorCodes.Rejected);
    }

    const signTransactionData: SignTransactionDataEVM = {
      type: TransactionType.EvmNative,
      transaction,
    };

    return {
      data: signTransactionData,
      route: ExternalRoute.SignTransaction,
    };
  }
}

/**
 * Handler for ERC-20 transfer function calls
 */
export class Erc20TransferHandler implements TransactionHandler {
  canHandle(transaction: EthSendTransaction): boolean {
    if (!transaction.data || !transaction.to) {
      return false;
    }

    try {
      const decodedData = getERC20DataDecoder().decodeData(transaction.data);
      return decodedData?.method === 'transfer';
    } catch {
      return false;
    }
  }

  async handle(transaction: EthSendTransaction): Promise<TransactionHandlerResult> {
    // Validate hex fields first
    validateHexFields(transaction);

    if (!transaction.data || !transaction.to) {
      throw new EIPRpcError('Invalid ERC-20 transfer data', EIPErrorCodes.Rejected);
    }

    if (!ethers.utils.isAddress(transaction.to)) {
      throw new EIPRpcError('Invalid contract address in transfer call', EIPErrorCodes.Rejected);
    }

    let decodedContractCall: ContractInputData;

    try {
      decodedContractCall = getERC20DataDecoder().decodeData(transaction.data);
    } catch (error) {
      throw new EIPRpcError('Failed to decode ERC-20 transfer data', EIPErrorCodes.Rejected);
    }

    if (decodedContractCall.method !== 'transfer') {
      throw new EIPRpcError('Not a valid ERC-20 transfer call', EIPErrorCodes.Rejected);
    }

    // Validate inputs
    if (!decodedContractCall.inputs?.length || decodedContractCall.inputs.length < 2) {
      throw new EIPRpcError('Invalid transfer method call - missing parameters', EIPErrorCodes.Rejected);
    }

    // Validate recipient address from contract call
    const recipient = decodedContractCall.inputs[0] as string;
    if (!ethers.utils.isAddress(recipient)) {
      throw new EIPRpcError('Invalid recipient address in transfer call', EIPErrorCodes.Rejected);
    }

    // Validate the amount from the decoded contract call
    const amount = decodedContractCall.inputs[1] as BigNumber;
    if (!amount) {
      throw new EIPRpcError('Invalid transfer amount', EIPErrorCodes.Rejected);
    }

    const signTransactionData: SignTransactionDataEVM = {
      type: TransactionType.Erc20Transfer,
      transaction,
    };

    return {
      data: signTransactionData,
      route: ExternalRoute.SignTransaction,
    };
  }
}

/**
 * Handler for ERC-20 approve function calls
 */
export class Erc20ApproveHandler implements TransactionHandler {
  canHandle(transaction: EthSendTransaction): boolean {
    if (!transaction.data || !transaction.to) {
      return false;
    }

    try {
      const decodedData = getERC20DataDecoder().decodeData(transaction.data);
      return decodedData?.method === 'approve';
    } catch {
      return false;
    }
  }

  async handle(transaction: EthSendTransaction): Promise<TransactionHandlerResult> {
    // Validate hex fields first
    validateHexFields(transaction);

    if (!transaction.data || !transaction.to) {
      throw new EIPRpcError('Invalid ERC-20 approve data', EIPErrorCodes.Rejected);
    }

    let decodedContractCall: ContractInputData;

    try {
      decodedContractCall = getERC20DataDecoder().decodeData(transaction.data);
    } catch (error) {
      throw new EIPRpcError('Failed to decode ERC-20 approve data', EIPErrorCodes.Rejected);
    }

    if (decodedContractCall.method !== 'approve') {
      throw new EIPRpcError('Not a valid ERC-20 approve call', EIPErrorCodes.Rejected);
    }

    // Validate inputs
    if (!decodedContractCall.inputs?.length || decodedContractCall.inputs.length < 2) {
      throw new EIPRpcError('Invalid approve method call - missing parameters', EIPErrorCodes.Rejected);
    }

    // Validate spender address from the decoded contract call
    const spender = decodedContractCall.inputs[0] as string;
    if (!ethers.utils.isAddress(spender)) {
      throw new EIPRpcError('Invalid spender address in approve call', EIPErrorCodes.Rejected);
    }

    // Validate amount from the decoded contract call
    const amount = decodedContractCall.inputs[1] as BigNumber;
    if (!amount) {
      throw new EIPRpcError('Invalid approve amount', EIPErrorCodes.Rejected);
    }

    const signTransactionData: SignTransactionDataEVM = {
      type: TransactionType.Erc20Approve,
      transaction,
    };

    return {
      data: signTransactionData,
      route: ExternalRoute.SignTransaction,
    };
  }
}

/**
 * Fallback handler for generic smart contract interactions
 * Handles any transaction with 'to' and 'data' fields that other handlers cannot process
 */
export class FallbackContractHandler implements TransactionHandler {
  canHandle(transaction: EthSendTransaction): boolean {
    // This handler accepts any transaction that has both 'to' and 'data' fields
    // It acts as a fallback for transactions not handled by more specific handlers
    return !!(transaction.to && transaction.data && !['0x', '0x0'].includes(transaction.data));
  }

  async handle(transaction: EthSendTransaction): Promise<TransactionHandlerResult> {
    // Validate hex fields first
    validateHexFields(transaction);

    // Validate required fields
    if (!transaction.to) {
      throw new EIPRpcError('Contract address is required for smart contract interaction', EIPErrorCodes.Rejected);
    }

    if (!transaction.data || ['0x', '0x0'].includes(transaction.data)) {
      throw new EIPRpcError('Transaction data is required for smart contract interaction', EIPErrorCodes.Rejected);
    }

    // Validate address format
    if (!ethers.utils.isAddress(transaction.to)) {
      throw new EIPRpcError('Invalid contract address format', EIPErrorCodes.Rejected);
    }

    // Validate data format (must be valid hex with at least 4 bytes for function selector)
    if (!isValidHexString(transaction.data)) {
      throw new EIPRpcError('Invalid transaction data format', EIPErrorCodes.Rejected);
    }

    // Data should be at least 10 characters long (0x + 8 hex chars for 4-byte function selector)
    if (transaction.data.length < 10) {
      throw new EIPRpcError('Transaction data too short for contract interaction', EIPErrorCodes.Rejected);
    }

    const signTransactionData: SignTransactionDataEVM = {
      type: TransactionType.EvmContractInteraction,
      transaction,
    };

    return {
      data: signTransactionData,
      route: ExternalRoute.SignTransaction,
    };
  }
}

/**
 * Transaction handler registry that manages all available handlers
 */
export class TransactionHandlerRegistry {
  private handlers: TransactionHandler[] = [];

  constructor() {
    // Register handlers in priority order
    // More specific handlers should be registered first
    this.registerHandler(new Erc20TransferHandler());
    this.registerHandler(new Erc20ApproveHandler());
    this.registerHandler(new NativeTransferHandler());
    // Fallback handler should be registered last as it's the most generic
    this.registerHandler(new FallbackContractHandler());
  }

  /**
   * Register a new transaction handler
   */
  registerHandler(handler: TransactionHandler): void {
    this.handlers.push(handler);
  }

  /**
   * Find and execute the appropriate handler for a transaction
   */
  async handleTransaction(transaction: EthSendTransaction): Promise<TransactionHandlerResult> {
    // Find the first handler that can process this transaction
    const handler = this.handlers.find(h => h.canHandle(transaction));

    if (!handler) {
      throw new EIPRpcError('Unable to handle this transaction type', EIPErrorCodes.Unsupported);
    }

    return await handler.handle(transaction);
  }

  /**
   * Get all registered handlers (for testing/debugging)
   */
  getHandlers(): TransactionHandler[] {
    return [...this.handlers];
  }
}

// Export a default registry instance
export const defaultTransactionHandlerRegistry = new TransactionHandlerRegistry();
