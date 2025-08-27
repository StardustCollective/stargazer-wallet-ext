import { dag4 } from '@stardust-collective/dag4';
import type { HashResponse, TokenLock as TokenLockBody } from '@stardust-collective/dag4-network';
import React, { useState } from 'react';

import { DAG_NETWORK } from 'constants/index';

import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import type { TokenLockDataParam } from 'scripts/Provider/constellation';

import type { IAssetInfoState } from 'state/assets/types';

import { usePlatformAlert } from 'utils/alertUtil';

import TokenLockContainer, { TokenLockProviderConfig } from './TokenLockContainer';
import { retry } from 'utils/httpRequests/utils';

const TokenLock = () => {
  const [loading, setLoading] = useState(false);
  const showAlert = usePlatformAlert();

  const sendTokenLockTransaction = async (decodedData: TokenLockDataParam, asset: IAssetInfoState): Promise<string> => {
    const tokenLockBody: TokenLockBody = {
      source: decodedData.source,
      amount: decodedData.amount,
      fee: 0,
      unlockEpoch: decodedData.unlockEpoch,
    };

    let tokenLockResponse: HashResponse | null = null;

    if (!decodedData.currencyId) {
      // Send transaction to DAG
      try {
        tokenLockResponse = await dag4.account.createTokenLock(tokenLockBody);
      } catch (err) {
        tokenLockResponse = await retry(() => dag4.account.createTokenLock(tokenLockBody, { sticky: false }));
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
        tokenLockResponse = await metagraphClient.createTokenLock(tokenLockBody);
      } catch (err) {
        tokenLockResponse = await retry(() => metagraphClient.createTokenLock(tokenLockBody, { sticky: false }));
      }
    }

    if (!tokenLockResponse || !tokenLockResponse?.hash) {
      throw new Error('Failed to generate signed token lock transaction');
    }

    return tokenLockResponse.hash;
  };

  const defaultTokenLockConfig: TokenLockProviderConfig = {
    title: 'TokenLock',
    onTokenLock: async ({ decodedData, asset, wallet }) => {
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
