/* eslint-disable react/prop-types */
import React from 'react';

import { SignTransactionData, useSignTransaction, UseSignTransactionReturn } from 'hooks/external/useSignTransaction';

import SignTransactionView, { ISignTransactionProps } from 'scenes/external/views/sign-transaction';

import { IAssetInfoState } from 'state/assets/types';

import { AssetType } from '../../../state/vault/types';
import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface SignTransactionProviderConfig {
  title: string;
  footer?: string;
  onSignTransaction: (data: { decodedData: SignTransactionData; asset: IAssetInfoState; isDAGTransaction: boolean; isMetagraphTransaction: boolean; isEVMTransaction: boolean; fee: string }) => Promise<string>;
  onError?: (error: unknown) => void;
  onSuccess?: (txHash: string) => void;
}

type SignTransactionContainerProps = SignTransactionData & UseSignTransactionReturn & BaseContainerProps;

/**
 * Container component that provides common sign transaction functionality
 */
const SignTransactionContainer: React.FC<SignTransactionProviderConfig> = ({ title, footer = 'Only sign transactions on sites you trust.', onSignTransaction, onError, onSuccess }) => {
  // Extract onAction function
  const handleSignTransactionAction = async (hookData: UseSignTransactionReturn): Promise<string> => {
    const { decodedData, asset, isDAGTransaction, isMetagraphTransaction, isEVMTransaction, fee } = hookData;
    return await onSignTransaction({
      decodedData,
      asset,
      isDAGTransaction,
      isMetagraphTransaction,
      isEVMTransaction,
      fee,
    });
  };

  // Extract validation function - handles complex transaction type validation
  const validateSignTransactionData = (decodedData: SignTransactionData, hookData?: UseSignTransactionReturn): string | null => {
    if (!hookData) return 'Invalid transaction data';
    if (!decodedData) return 'Invalid transaction data';

    const { value, from, to, chain, assetId } = decodedData;

    if (!value) return 'Invalid amount';
    if (!from) return 'Invalid from address';
    if (!to) return 'Invalid to address';
    if (!chain) return 'Invalid chain';
    if (!assetId) return 'Invalid asset ID';

    const { isDAGTransaction, isMetagraphTransaction, isEVMTransaction, asset } = hookData;

    // Validate required data based on transaction type
    if (isDAGTransaction && asset?.type !== AssetType.Constellation) {
      return 'Invalid DAG transaction data';
    }

    if (isMetagraphTransaction && asset?.type !== AssetType.Constellation) {
      return 'Invalid metagraph transaction data';
    }

    if (isEVMTransaction && ![AssetType.Ethereum, AssetType.ERC20].includes(asset?.type)) {
      return 'Invalid EVM transaction data';
    }

    return null;
  };

  // Extract render function with proper typing
  const renderSignTransactionView = (props: SignTransactionContainerProps): JSX.Element => {
    const { title: propsTitle, asset, value, from, to, fee, origin, footer: propsFooter, setFee, onAction, onReject } = props;

    // Extract common props for the view - handles different transaction types
    const getViewProps = (): ISignTransactionProps => {
      return {
        title: propsTitle,
        asset,
        amount: value ?? 0,
        fee,
        from,
        to,
        footer: propsFooter,
        origin,
        setFee,
        onSign: onAction,
        onReject,
      };
    };

    return <SignTransactionView {...getViewProps()} />;
  };

  return (
    <ExternalRequestContainer<SignTransactionData, string, UseSignTransactionReturn>
      title={title}
      footer={footer}
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
