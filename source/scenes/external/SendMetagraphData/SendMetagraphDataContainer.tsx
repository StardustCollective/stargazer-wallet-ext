/* eslint-disable react/prop-types */
import { SendDataFeeResponse, SignDataFeeResponse } from '@stardust-collective/dag4-network';
import React from 'react';

import { useSendMetagraphData, UseSendMetagraphDataReturn } from 'hooks/external/useSendMetagraphData';

import SendMetagraphDataView, { ISendMetagraphDataProps } from 'scenes/external/views/send-metagraph-data';

import { WalletParam } from 'scripts/Background/messaging';
import { ISendMetagraphDataParams } from 'scripts/Provider/constellation';

import { IAssetInfoState } from 'state/assets/types';

import { BaseContainerProps, ExternalRequestContainer } from '../ExternalRequestContainer';

export interface SendMetagraphDataProviderConfig {
  title?: string;
  isLoading?: boolean;
  onSendMetagraphData: (data: { decodedData: ISendMetagraphDataParams; asset: IAssetInfoState; wallet: WalletParam; fee: { fee: string; address: string; updateHash: string } | null }) => Promise<SendDataFeeResponse | SignDataFeeResponse>;
  onError?: (error: unknown) => void;
  onSuccess?: (result: SendDataFeeResponse | SignDataFeeResponse) => void;
}

type SendMetagraphDataContainerProps = ISendMetagraphDataParams & UseSendMetagraphDataReturn & BaseContainerProps;

/**
 * Container component that provides common send metagraph data functionality
 * Allows each service to inject their own transaction logic while reusing UI and common patterns
 */
const SendMetagraphDataContainer: React.FC<SendMetagraphDataProviderConfig> = ({ title, onSendMetagraphData, onError, onSuccess, isLoading = false }) => {
  // Extract onAction function
  const handleSendMetagraphDataAction = async (hookData: UseSendMetagraphDataReturn): Promise<SendDataFeeResponse | SignDataFeeResponse> => {
    const { decodedData, asset, wallet, fee } = hookData;
    return await onSendMetagraphData({ decodedData, asset, wallet, fee });
  };

  // Extract validation function
  const validateSendMetagraphDataData = (decodedData: ISendMetagraphDataParams): string | null => {
    if (!decodedData) return 'Invalid send metagraph data';
    if (!decodedData.metagraphId) return 'Invalid metagraph ID';
    if (!decodedData.payload) return 'Invalid data';
    return null;
  };

  // Extract render function with proper typing
  const renderSendMetagraphDataView = (props: SendMetagraphDataContainerProps): JSX.Element => {
    const { sign, payload, wallet, isLoading: propsIsLoading, asset, fee, setFee, onAction, onReject } = props;

    const sendMetagraphDataProps: ISendMetagraphDataProps = {
      sign,
      payload,
      wallet,
      asset,
      fee,
      setFee,
      isLoading: propsIsLoading,
      onSign: onAction,
      onReject,
    };
    return <SendMetagraphDataView {...sendMetagraphDataProps} />;
  };

  return (
    <ExternalRequestContainer<ISendMetagraphDataParams, SendDataFeeResponse | SignDataFeeResponse, UseSendMetagraphDataReturn>
      title={title}
      isLoading={isLoading}
      useHook={useSendMetagraphData}
      onAction={handleSendMetagraphDataAction}
      onError={onError}
      onSuccess={onSuccess}
      validateData={validateSendMetagraphDataData}
    >
      {renderSendMetagraphDataView}
    </ExternalRequestContainer>
  );
};

export default SendMetagraphDataContainer;
