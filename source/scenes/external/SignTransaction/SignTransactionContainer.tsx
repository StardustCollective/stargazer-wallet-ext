import React from 'react';

import { SignTransactionData, useSignTransaction } from 'hooks/external/useSignTransaction';

import SignTransactionView, { ISignTransactionProps } from 'scenes/external/views/sign-transaction';

import { SignTransactionDataDAG } from 'scripts/Provider/constellation';
import { SignTransactionDataEVM } from 'scripts/Provider/evm';

import { IAssetInfoState } from 'state/assets/types';

import { usePlatformAlert } from 'utils/alertUtil';

export interface SignTransactionProviderConfig {
  title: string;
  footer?: string;
  onSignTransaction: (data: { decodedData: SignTransactionData; asset: IAssetInfoState; isDAGTransaction: boolean; isMetagraphTransaction: boolean; isEVMTransaction: boolean; fee: string }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
}

/**
 * Container component that provides common sign transaction functionality
 * Allows each service to inject their own transaction signing logic while reusing UI and common patterns
 */
const SignTransactionContainer: React.FC<SignTransactionProviderConfig> = ({ title, footer = 'Only sign transactions on sites you trust.', onSignTransaction, onError, onSuccess }) => {
  const showAlert = usePlatformAlert();
  const { asset, decodedData, isDAGTransaction, isMetagraphTransaction, isEVMTransaction, fee, origin, setFee, handleReject, handleSuccess, handleError } = useSignTransaction();

  // Validate required data based on transaction type
  if (isDAGTransaction && !('assetId' in decodedData)) {
    handleError(new Error('Invalid DAG transaction data'));
    return null;
  }

  if (isMetagraphTransaction && !('assetId' in decodedData)) {
    handleError(new Error('Invalid metagraph transaction data'));
    return null;
  }

  if (isEVMTransaction && !('assetId' in decodedData)) {
    handleError(new Error('Invalid EVM transaction data'));
    return null;
  }

  // Handle sign action with service-specific logic
  const handleSign = async () => {
    try {
      const txHash = await onSignTransaction({
        asset,
        decodedData,
        isDAGTransaction,
        isMetagraphTransaction,
        isEVMTransaction,
        fee,
      });

      if (onSuccess) {
        onSuccess(txHash);
      } else {
        handleSuccess(txHash);
      }
    } catch (error: unknown) {
      if (onError) {
        onError(error);
      } else {
        handleError(error);
        showAlert(error instanceof Error ? error.message : 'Unknown error occurred', 'danger');
      }
    }
  };

  // Extract common props for the view
  const getViewProps = (): ISignTransactionProps => {
    // For DAG/Metagraph transactions
    if (isDAGTransaction || isMetagraphTransaction) {
      const dagData = decodedData as SignTransactionDataDAG;
      return {
        ...dagData,
        title,
        asset,
        amount: dagData.value ?? 0,
        footer,
        fee,
        origin,
        setFee,
        onSign: handleSign,
        onReject: handleReject,
      };
    }

    // For EVM transactions
    const evmData = decodedData as SignTransactionDataEVM;
    return {
      ...evmData,
      title,
      asset,
      amount: evmData.value ?? 0,
      footer,
      fee,
      origin,
      setFee,
      onSign: handleSign,
      onReject: handleReject,
    };
  };

  const props = getViewProps();

  return <SignTransactionView {...props} />;
};

export default SignTransactionContainer;
