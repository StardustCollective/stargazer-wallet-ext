import { dag4 } from '@stardust-collective/dag4';
import type { WithdrawDelegatedStake } from '@stardust-collective/dag4-network';
import React, { useState } from 'react';

import { usePlatformAlert } from 'utils/alertUtil';

import WithdrawDelegatedStakeContainer, { WithdrawDelegatedStakeProviderConfig } from './WithdrawDelegatedStakeContainer';

const ExternalWithdrawDelegatedStake = () => {
  const [loading, setLoading] = useState(false);
  const showAlert = usePlatformAlert();

  const sendWithdrawDelegatedStakeTransaction = async (decodedData: WithdrawDelegatedStake): Promise<string> => {
    const withdrawDelegatedStakeBody: WithdrawDelegatedStake = {
      source: decodedData.source,
      stakeRef: decodedData.stakeRef,
    };

    const { hash } = await dag4.account.withdrawDelegatedStake(withdrawDelegatedStakeBody);

    if (!hash) {
      throw new Error('Failed to generate signed withdraw delegated stake transaction');
    }

    return hash;
  };

  const defaultWithdrawDelegatedStakeConfig: WithdrawDelegatedStakeProviderConfig = {
    title: 'WithdrawDelegatedStake',
    onWithdrawDelegatedStake: async ({ decodedData }) => {
      setLoading(true);
      try {
        return await sendWithdrawDelegatedStakeTransaction(decodedData);
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

  return <WithdrawDelegatedStakeContainer {...defaultWithdrawDelegatedStakeConfig} />;
};

export default ExternalWithdrawDelegatedStake;
