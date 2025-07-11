import { dag4 } from '@stardust-collective/dag4';
import type { SendDataFeeResponse, SignDataFeeResponse } from '@stardust-collective/dag4-network';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { DAG_NETWORK } from 'constants/index';

import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import type { ISendMetagraphDataParams } from 'scripts/Provider/constellation';

import walletsSelectors from 'selectors/walletsSelectors';

import { IAssetInfoState } from 'state/assets/types';

import { usePlatformAlert } from 'utils/alertUtil';
import { toDatum } from 'utils/number';

import SendMetagraphDataContainer, { SendMetagraphDataProviderConfig } from './SendMetagraphDataContainer';
import { buildTransactionBody } from './utils';

const SendMetagraphData = () => {
  const [loading, setLoading] = useState(false);
  const dagAddress = useSelector(walletsSelectors.selectActiveWalletDagAddress);

  const showAlert = usePlatformAlert();

  const sendMetagraphDataTx = async (decodedData: ISendMetagraphDataParams, asset: IAssetInfoState, fee: { fee: string; address: string; updateHash: string }): Promise<SendDataFeeResponse | SignDataFeeResponse> => {
    const body = await buildTransactionBody(decodedData.payload, fee.fee, fee.address, fee.updateHash);

    const feeTooLow = !!body?.fee && body?.fee?.value?.amount < toDatum(fee.fee);
    if (feeTooLow) {
      throw new EIPRpcError(`Not enough fee for this transaction.\nThe recommended fee amount is ${fee.fee} ${asset?.symbol}`, EIPErrorCodes.Rejected);
    }

    const metagraphClient = dag4.account.createMetagraphTokenClient({
      metagraphId: asset.address,
      id: asset.address,
      l0Url: asset.l0endpoint,
      l1Url: asset.l1endpoint,
      dl1Url: asset.dl1endpoint,
      beUrl: '',
    });

    const response: SendDataFeeResponse = await metagraphClient.sendDataTransaction(body);

    if (decodedData.sign) {
      (response as SignDataFeeResponse).signature = body.data.proofs[0].signature;
      if (response?.feeHash) {
        (response as SignDataFeeResponse).feeSignature = body.fee.proofs[0].signature;
      }
    }

    return response;
  };

  const defaultSendMetagraphDataConfig: SendMetagraphDataProviderConfig = {
    isLoading: loading,
    onSendMetagraphData: async ({ decodedData, asset, wallet, fee }) => {
      setLoading(true);
      const isDAGChain = wallet.chain === StargazerChain.CONSTELLATION;
      const addressMatch = dagAddress.toLowerCase() === wallet.address.toLowerCase();
      const networkInfo = dag4.account.networkInstance.getNetwork();
      const networkMatch = wallet.chainId === DAG_NETWORK[networkInfo.id].chainId;

      if (!isDAGChain) {
        throw new EIPRpcError('Unsupported chain', EIPErrorCodes.Unsupported);
      }

      if (!addressMatch) {
        throw new EIPRpcError('Account address mismatch', EIPErrorCodes.Unauthorized);
      }

      if (!networkMatch) {
        throw new EIPRpcError('Connected network mismatch', EIPErrorCodes.Unauthorized);
      }

      return await sendMetagraphDataTx(decodedData, asset, fee);
    },
    onError: (err: unknown) => {
      setLoading(false);
      if (err instanceof Error) {
        const { message } = err;

        if (message.includes('TransactionLimited')) {
          showAlert('Feeless transaction limit reached. Try again adding a small fee.', 'danger');
          return;
        }

        if (message.includes('InsufficientBalance')) {
          showAlert('Insufficient balance for the transaction', 'danger');
          return;
        }

        showAlert(err instanceof Error ? err.message : 'Unknown error occurred', 'danger');
      }
    },
  };

  return <SendMetagraphDataContainer {...defaultSendMetagraphDataConfig} />;
};

export default SendMetagraphData;
