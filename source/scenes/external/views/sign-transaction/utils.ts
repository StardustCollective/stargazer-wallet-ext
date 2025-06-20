import { ethers } from 'ethers';

import { TransactionType } from '../../SignTransaction/types';

interface BalanceValidationProps {
  type: TransactionType;
  nativeBalance: ethers.BigNumber;
  amount?: ethers.BigNumber;
  fee?: ethers.BigNumber;
  erc20Balance?: ethers.BigNumber;
}

interface BalanceValidationResult {
  isValid: boolean;
  amountError: string;
  feeError: string;
}

// Pure balance validation function
export const validateBalance = ({ nativeBalance, amount, fee, type, erc20Balance }: BalanceValidationProps): BalanceValidationResult => {
  switch (type) {
    case TransactionType.EvmNative: {
      // Check if user has enough balance for the amount
      if (nativeBalance.lt(amount)) {
        return {
          isValid: false,
          amountError: 'Insufficient balance',
          feeError: '',
        };
      }

      // Check if user has enough balance for amount + fee
      const totalAmount = amount.add(fee);
      if (nativeBalance.lt(totalAmount)) {
        return {
          isValid: false,
          amountError: '',
          feeError: 'Not enough to cover fee',
        };
      }

      return {
        isValid: true,
        amountError: '',
        feeError: '',
      };
    }

    case TransactionType.Erc20Transfer: {
      if (!erc20Balance) {
        return {
          isValid: false,
          amountError: 'Token balance not available',
          feeError: '',
        };
      }

      const hasInsufficientTokens = erc20Balance.lt(amount);
      const hasInsufficientFee = nativeBalance.lt(fee);

      if (hasInsufficientTokens) {
        return {
          isValid: false,
          amountError: 'Insufficient balance',
          feeError: hasInsufficientFee ? 'Not enough to cover fee' : '',
        };
      }

      if (hasInsufficientFee) {
        return {
          isValid: false,
          amountError: '',
          feeError: 'Not enough to cover fee',
        };
      }

      return {
        isValid: true,
        amountError: '',
        feeError: '',
      };
    }

    case TransactionType.Erc20Approve: {
      if (!erc20Balance) {
        return {
          isValid: false,
          amountError: 'Token balance not available',
          feeError: '',
        };
      }

      const hasInsufficientFee = nativeBalance.lt(fee);
      const isApprovingMoreThanBalance = erc20Balance.lt(amount);

      if (hasInsufficientFee) {
        return {
          isValid: false,
          amountError: isApprovingMoreThanBalance ? "You're approving more than your balance. This is allowed, but transfers may fail later." : '',
          feeError: 'Not enough to cover fee',
        };
      }

      return {
        isValid: true,
        amountError: isApprovingMoreThanBalance ? "You're approving more than your balance. This is allowed, but transfers may fail later." : '',
        feeError: '',
      };
    }

    case TransactionType.EvmContractInteraction: {
      // For contract interactions, we only need to check if user has enough for the fee
      if (nativeBalance.lt(fee)) {
        return {
          isValid: false,
          amountError: '',
          feeError: 'Not enough to cover fee',
        };
      }

      return {
        isValid: true,
        amountError: '',
        feeError: '',
      };
    }

    case TransactionType.DagNative:
    case TransactionType.DagMetagraph:
      // DAG transactions are handled differently, not relevant for EVM transactions
      return {
        isValid: false,
        amountError: 'DAG transactions not supported in this component',
        feeError: '',
      };

    default:
      return {
        isValid: false,
        amountError: 'Invalid transaction type',
        feeError: '',
      };
  }
};
