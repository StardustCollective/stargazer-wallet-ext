import { dag4 } from '@stardust-collective/dag4';
import type { DelegatedStake } from '@stardust-collective/dag4-network';
import React, { useState } from 'react';

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
    onDelegatedStake: async ({ decodedData }) => {
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
