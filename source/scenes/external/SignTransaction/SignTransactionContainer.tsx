/* eslint-disable react/prop-types */
import React from 'react';

import { SignTransactionData, useSignTransaction, UseSignTransactionReturn } from 'hooks/external/useSignTransaction';

import { ISignDagTransactionProps, ISignEvmApproveProps, ISignEvmTransactionProps, ISignEvmTransferProps, SignDagTransactionView, SignEvmApprove, SignEvmTransactionView, SignEvmTransferView } from 'scenes/external/views/sign-transaction';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';
import { ISignContractInteractionProps, SignContractInteraction } from '../views/sign-transaction/sign-contract-interaction';

export interface SignTransactionProviderConfig {
  title: string;
  footer?: string;
  isLoading?: boolean;
  onSignTransaction: (data: UseSignTransactionReturn) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
}

type SignTransactionContainerProps = SignTransactionData & UseSignTransactionReturn & BaseContainerProps;

/**
 * Container component that provides common sign transaction functionality
 */
const SignTransactionContainer: React.FC<SignTransactionProviderConfig> = ({ title, footer = 'Only sign transactions on sites you trust.', isLoading = false, onSignTransaction, onError, onSuccess }) => {
  // Extract onAction function
  const handleSignTransactionAction = async (hookData: UseSignTransactionReturn): Promise<string> => {
    return await onSignTransaction(hookData);
  };

  // Extract validation function - handles complex transaction type validation
  const validateSignTransactionData = (decodedData: SignTransactionData, hookData?: UseSignTransactionReturn): string | null => {
    if (!hookData || !decodedData) return 'Invalid transaction data';

    const { from, to } = decodedData.transaction;

    if (!from) return 'Invalid from address';
    if (!to) return 'Invalid to address';

    return null;
  };

  // Extract render function with proper typing - now renders different views based on chain
  const renderSignTransactionView = (props: SignTransactionContainerProps): JSX.Element => {
    const {
      title: propsTitle,
      nativeAsset,
      metagraphAsset,
      transaction,
      origin,
      footer: propsFooter,
      isLoading: propsIsLoading,
      isDAG,
      isMetagraph,
      isEvmNative,
      isErc20Approve,
      isErc20Transfer,
      isContractInteraction,
      fee,
      setFee,
      setGasConfig,
      onAction,
      onReject,
      wallet,
    } = props;

    if (isDAG || isMetagraph) {
      const asset = isDAG ? nativeAsset : metagraphAsset;
      const dagProps: ISignDagTransactionProps = {
        title: propsTitle,
        asset,
        transaction,
        fee,
        footer: propsFooter,
        origin,
        isLoading: propsIsLoading,
        wallet,
        setFee,
        onSign: onAction,
        onReject,
      };

      return <SignDagTransactionView {...dagProps} />;
    }

    if (isErc20Approve) {
      const evmApproveProps: ISignEvmApproveProps = {
        title: 'Approve Spend',
        nativeAsset,
        transaction,
        footer: propsFooter,
        isLoading: propsIsLoading,
        wallet,
        setGasConfig,
        onSign: onAction,
        onReject,
      };
      return <SignEvmApprove {...evmApproveProps} />;
    }

    if (isErc20Transfer) {
      const evmTransferProps: ISignEvmTransferProps = {
        title: propsTitle,
        nativeAsset,
        transaction,
        footer: propsFooter,
        isLoading: propsIsLoading,
        origin,
        wallet,
        setGasConfig,
        onSign: onAction,
        onReject,
      };
      return <SignEvmTransferView {...evmTransferProps} />;
    }

    if (isEvmNative) {
      const evmProps: ISignEvmTransactionProps = {
        title: propsTitle,
        nativeAsset,
        transaction,
        footer: propsFooter,
        isLoading: propsIsLoading,
        origin,
        wallet,
        setGasConfig,
        onSign: onAction,
        onReject,
      };

      return <SignEvmTransactionView {...evmProps} />;
    }
    if (isContractInteraction) {
      const contractInteractionProps: ISignContractInteractionProps = {
        title: propsTitle,
        nativeAsset,
        transaction,
        footer: propsFooter,
        isLoading: propsIsLoading,
        wallet,
        setGasConfig,
        onSign: onAction,
        onReject,
      };

      return <SignContractInteraction {...contractInteractionProps} />;
    }

    throw new Error('Invalid transaction type');
  };

  return (
    <ExternalRequestContainer<SignTransactionData, string, UseSignTransactionReturn>
      title={title}
      footer={footer}
      isLoading={isLoading}
      useHook={useSignTransaction}
      onAction={handleSignTransactionAction}
      onError={onError}
      onSuccess={onSuccess}
      validateData={validateSignTransactionData}
    >
      {renderSignTransactionView}
    </ExternalRequestContainer>
  );
};

export default SignTransactionContainer;
