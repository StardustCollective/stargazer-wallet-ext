import { type TransactionRequest } from '@ethersproject/abstract-provider';
import { dag4 } from '@stardust-collective/dag4';
import { ethers } from 'ethers';
import React, { useState } from 'react';

import { EIPErrorCodes, EIPRpcError } from 'scripts/common';

import type { IAssetInfoState } from 'state/assets/types';

import { usePlatformAlert } from 'utils/alertUtil';
import { getAccountController } from 'utils/controllersUtils';
import { toDag } from 'utils/number';

import SignTransactionContainer, { SignTransactionProviderConfig } from './SignTransactionContainer';
import { type SignTransactionDataDAG, type SignTransactionDataEVM, TransactionType } from './types';

const SignTransaction = () => {
  const showAlert = usePlatformAlert();
  const [loading, setLoading] = useState(false);

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

  const signEvmTransaction = async (data: SignTransactionDataEVM, gasConfig: { gasPrice: string; gasLimit: string }) => {
    const accountController = getAccountController();
    const wallet = accountController.networkController.getWallet(data.extras.chain);

    if (!wallet) {
      throw new EIPRpcError('Unable to get wallet for sending transaction.', EIPErrorCodes.Rejected);
    }

    if (!data?.extras?.type) {
      throw new EIPRpcError('Unable to get transaction type.', EIPErrorCodes.Rejected);
    }

    const { type } = data.extras;

    const isNative = type === TransactionType.EvmNative;
    // data param must be 0x for native transactions
    const dataParam = isNative ? '0x' : data.data;
    // value param must be 0 for erc-20 transactions
    const valueParam = isNative ? data.value : '0';

    const defaultGasLimit = ethers.utils.hexlify(Number(gasConfig.gasLimit));
    const defaultGasPrice = ethers.utils.parseUnits(gasConfig.gasPrice, 'gwei');

    const transaction: TransactionRequest = {
      chainId: data.chainId,

      from: data.from,
      to: data.to,
      value: valueParam,
      data: dataParam,

      gasLimit: data.gas || defaultGasLimit,
      gasPrice: data.gasPrice || defaultGasPrice,
    };

    const validTransaction = wallet.checkTransaction(transaction);
    const { hash } = await wallet.sendTransaction(validTransaction);

    return hash;
  };

  const externalSigningConfig: SignTransactionProviderConfig = {
    title: 'Sign Transaction',
    footer: 'Only sign transactions on sites you trust.',
    isLoading: loading,
    onSignTransaction: async ({ decodedData, metagraphAsset, isDAG, isMetagraph, isEvmNative, isErc20Transfer, isErc20Approve, fee, gasConfig }) => {
      setLoading(true);

      if (isDAG) {
        return await signDagTransaction(decodedData as SignTransactionDataDAG, fee);
      }

      if (isMetagraph) {
        return await signMetagraphTransaction(decodedData as SignTransactionDataDAG, metagraphAsset, fee);
      }

      if (isEvmNative || isErc20Transfer || isErc20Approve) {
        return await signEvmTransaction(decodedData as SignTransactionDataEVM, gasConfig);
      }

      throw new EIPRpcError('Invalid transaction type', EIPErrorCodes.Unsupported);
    },
    onError: (err: unknown) => {
      setLoading(false);
      if (err instanceof Error) {
        const { message } = err;
        if (message.includes('insufficient funds')) {
          showAlert('Insufficient funds to cover gas fee.', 'danger');
          return;
        }
        if (message.includes('cannot send a transaction to itself')) {
          showAlert('An address cannot send a transaction to itself', 'danger');
          return;
        }

        if (message.includes('TransactionLimited')) {
          showAlert('Feeless transaction limit reached. Try again adding a small fee.', 'danger');
          return;
        }

        showAlert(err instanceof Error ? err.message : 'Unknown error occurred', 'danger');
      }
    },
  };

  return <SignTransactionContainer {...externalSigningConfig} />;
};

export default SignTransaction;
