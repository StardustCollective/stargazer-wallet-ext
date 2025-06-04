import { dag4 } from '@stardust-collective/dag4';
import React from 'react';

import { EIPErrorCodes, EIPRpcError } from 'scripts/common';
import { SignTransactionDataDAG } from 'scripts/Provider/constellation';
import { SignTransactionDataEVM } from 'scripts/Provider/evm';

import { IAssetInfoState } from 'state/assets/types';

import { toDag } from 'utils/number';

import SignTransactionContainer, { SignTransactionProviderConfig } from './SignTransactionContainer';

const SignTransaction = () => {
  const signDagTransaction = async ({ to, value }: SignTransactionDataDAG, fee: string) => {
    // Transform amount and fee to DAG
    const amountInDag = toDag(value);
    const feeInDag = Number(fee);

    // Send transaction
    const pendingTx = await dag4.account.transferDag(to, amountInDag, feeInDag);
    pendingTx.amount = value;

    // Add transaction to mempool monitor
    const tx = await dag4.monitor.addToMemPoolMonitor(pendingTx);
    return tx.hash;
  };

  const signMetagraphTransaction = async ({ to, value }: SignTransactionDataDAG, asset: IAssetInfoState, fee: string) => {
    // Transform amount and fee to DAG
    const amountInDag = toDag(value);
    const feeInDag = Number(fee);

    // Create metagraph client
    const metagraphClient = dag4.account.createMetagraphTokenClient({
      metagraphId: asset.address,
      id: asset.address,
      l0Url: asset.l0endpoint,
      l1Url: asset.l1endpoint,
      beUrl: '',
    });

    // Send transaction
    const pendingTx = await metagraphClient.transfer(to, amountInDag, feeInDag);
    pendingTx.amount = value;

    // Add transaction to mempool monitor
    const tx = await dag4.monitor.addToMemPoolMonitor(pendingTx);
    return tx.hash;
  };

  const signEVMTransaction = async (data: SignTransactionDataEVM, fee: string) => {
    console.log('signEVMTransaction', { data, fee });
    return 'tx-hash-value';
  };

  const externalSigningConfig: SignTransactionProviderConfig = {
    title: 'Sign Transaction',
    footer: 'Only sign transactions on sites you trust.',
    onSignTransaction: async ({ decodedData, asset, isDAGTransaction, isMetagraphTransaction, isEVMTransaction, fee }) => {
      if (isDAGTransaction) {
        return await signDagTransaction(decodedData as SignTransactionDataDAG, fee);
      }

      if (isMetagraphTransaction) {
        return await signMetagraphTransaction(decodedData as SignTransactionDataDAG, asset, fee);
      }

      if (isEVMTransaction) {
        return await signEVMTransaction(decodedData as SignTransactionDataEVM, fee);
      }

      throw new EIPRpcError('Invalid transaction type', EIPErrorCodes.Unsupported);
    },
  };

  return <SignTransactionContainer {...externalSigningConfig} />;
};

export default SignTransaction;
