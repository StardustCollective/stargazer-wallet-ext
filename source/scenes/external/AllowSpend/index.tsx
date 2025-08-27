import { dag4 } from '@stardust-collective/dag4';
import type { AllowSpend as AllowSpendBody, HashResponse } from '@stardust-collective/dag4-network';
import React, { useState } from 'react';

import { DAG_NETWORK } from 'constants/index';

import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import type { AllowSpendData } from 'scripts/Provider/constellation';

import type { IAssetInfoState } from 'state/assets/types';

import { usePlatformAlert } from 'utils/alertUtil';
import { toDatum } from 'utils/number';

import AllowSpendContainer, { AllowSpendProviderConfig } from './AllowSpendContainer';
import { retry } from 'utils/httpRequests/utils';

const AllowSpend = () => {
  const [loading, setLoading] = useState(false);
  const showAlert = usePlatformAlert();

  const sendAllowSpendTransaction = async (decodedData: AllowSpendData, asset: IAssetInfoState, fee: string): Promise<string> => {
    const allowSpendBody: AllowSpendBody = {
      source: decodedData.source,
      destination: decodedData.destination,
      approvers: decodedData.approvers,
      amount: decodedData.amount,
      fee: toDatum(fee),
      validUntilEpoch: decodedData.validUntilEpoch,
    };

    let allowSpendResponse: HashResponse | null = null;

    if (!decodedData.currencyId) {
      try {
        // Send transaction to DAG
        allowSpendResponse = await dag4.account.createAllowSpend(allowSpendBody);
      } catch (err) {
        allowSpendResponse = await retry(() => dag4.account.createAllowSpend(allowSpendBody, { sticky: false }));
      }
    } else {
      if (!asset) {
        throw new Error('Metagraph asset not found');
      }

      // Send transaction to metagraph
      const metagraphClient = dag4.account.createMetagraphTokenClient({
        metagraphId: asset.address,
        id: asset.address,
        l0Url: asset.l0endpoint,
        l1Url: asset.l1endpoint,
        beUrl: '',
      });

      try {
        allowSpendResponse = await metagraphClient.createAllowSpend(allowSpendBody);
      } catch (err) {
        allowSpendResponse = await retry(() => metagraphClient.createAllowSpend(allowSpendBody, { sticky: false }));
      }
    }

    if (!allowSpendResponse || !allowSpendResponse?.hash) {
      throw new Error('Failed to generate signed allow spend transaction');
    }

    return allowSpendResponse.hash;
  };

  const defaultAllowSpendConfig: AllowSpendProviderConfig = {
    title: 'AllowSpend',
    onAllowSpend: async ({ decodedData, asset, fee, wallet }) => {
      const isDag = wallet.chain === StargazerChain.CONSTELLATION;
      const addressMatch = dag4.account.keyTrio.address.toLowerCase() === wallet.address.toLowerCase();
      const networkInfo = dag4.account.networkInstance.getNetwork();
      const chainMatch = DAG_NETWORK[networkInfo.id].chainId === wallet.chainId;

      if (!isDag) {
        throw new EIPRpcError('Unsupported chain', EIPErrorCodes.Unsupported);
      }

      if (!addressMatch) {
        throw new EIPRpcError('Account address mismatch', EIPErrorCodes.Unauthorized);
      }

      if (!chainMatch) {
        throw new EIPRpcError('Connected network mismatch', EIPErrorCodes.Unauthorized);
      }

      setLoading(true);
      try {
        return await sendAllowSpendTransaction(decodedData, asset, fee);
      } catch (error) {
        setLoading(false);

        // Handle specific error cases
        if (error instanceof Error) {
          const errorMessage = error.message.includes('InsufficientBalance') ? `Not enough ${asset.symbol} balance for the transaction` : error.message;
          showAlert(errorMessage, 'danger');
        } else {
          showAlert('There was an error with the transaction.\nPlease try again later.', 'danger');
        }

        throw error;
      }
    },
    isLoading: loading,
  };

  return <AllowSpendContainer {...defaultAllowSpendConfig} />;
};

export default AllowSpend;
