import { dag4 } from '@stardust-collective/dag4';
import { HashResponse, TokenLock as TokenLockBody } from '@stardust-collective/dag4-network';
import React, { useState } from 'react';

import { usePlatformAlert } from 'utils/alertUtil';

import TokenLockContainer, { TokenLockProviderConfig } from './TokenLockContainer';

const TokenLock = () => {
  const [loading, setLoading] = useState(false);
  const showAlert = usePlatformAlert();

  const sendTokenLockTransaction = async (decodedData: any, asset: any): Promise<string> => {
    const tokenLockBody: TokenLockBody = {
      source: decodedData.source,
      amount: decodedData.amount,
      fee: 0,
      unlockEpoch: decodedData.unlockEpoch,
    };

    let tokenLockResponse: HashResponse | null = null;

    if (!decodedData.currencyId) {
      // Send transaction to DAG
      tokenLockResponse = await dag4.account.createTokenLock(tokenLockBody);
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

      tokenLockResponse = await metagraphClient.createTokenLock(tokenLockBody);
    }

    if (!tokenLockResponse || !tokenLockResponse?.hash) {
      throw new Error('Failed to generate signed token lock transaction');
    }

    return tokenLockResponse.hash;
  };

  const defaultTokenLockConfig: TokenLockProviderConfig = {
    title: 'TokenLock',
    onTokenLock: async ({ decodedData, asset }) => {
      setLoading(true);
      try {
        return await sendTokenLockTransaction(decodedData, asset);
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

  return <TokenLockContainer {...defaultTokenLockConfig} />;
};

export default TokenLock;
