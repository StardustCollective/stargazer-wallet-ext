import { dag4 } from '@stardust-collective/dag4';
import type { DelegatedStake } from '@stardust-collective/dag4-network';
import React, { useState } from 'react';

import { DAG_NETWORK } from 'constants/index';

import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';

import { usePlatformAlert } from 'utils/alertUtil';

import DelegatedStakeContainer, { DelegatedStakeProviderConfig } from './DelegatedStakeContainer';

const ExternalDelegatedStake = () => {
  const [loading, setLoading] = useState(false);
  const showAlert = usePlatformAlert();

  const sendDelegatedStakeTransaction = async (decodedData: DelegatedStake): Promise<string> => {
    const delegatedStakeBody: DelegatedStake = {
      source: decodedData.source,
      nodeId: decodedData.nodeId,
      amount: decodedData.amount,
      fee: decodedData.fee,
      tokenLockRef: decodedData.tokenLockRef,
    };

    const { hash } = await dag4.account.createDelegatedStake(delegatedStakeBody);

    if (!hash) {
      throw new Error('Failed to generate signed delegated stake transaction');
    }

    return hash;
  };

  const defaultDelegatedStakeConfig: DelegatedStakeProviderConfig = {
    title: 'DelegatedStake',
    onDelegatedStake: async ({ decodedData, wallet }) => {
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
        return await sendDelegatedStakeTransaction(decodedData);
      } catch (error) {
        setLoading(false);

        // Handle specific error cases
        if (error instanceof Error) {
          const errorMessage = error.message || 'There was an error with the transaction.\nPlease try again later.';
          showAlert(errorMessage, 'danger');
        } else {
          showAlert('There was an error with the transaction.\nPlease try again later.', 'danger');
        }

        throw error;
      }
    },
    isLoading: loading,
  };

  return <DelegatedStakeContainer {...defaultDelegatedStakeConfig} />;
};

export default ExternalDelegatedStake;
