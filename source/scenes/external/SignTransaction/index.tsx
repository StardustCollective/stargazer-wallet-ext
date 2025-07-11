import { type TransactionRequest } from '@ethersproject/abstract-provider';
import { dag4 } from '@stardust-collective/dag4';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { DAG_NETWORK } from 'constants/index';

import EVMChainController from 'scripts/Background/controllers/EVMChainController';
import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';

import walletsSelectors from 'selectors/walletsSelectors';

import type { IAssetInfoState } from 'state/assets/types';

import { usePlatformAlert } from 'utils/alertUtil';
import { getAccountController } from 'utils/controllersUtils';
import { toDag } from 'utils/number';

import SignTransactionContainer, { SignTransactionProviderConfig } from './SignTransactionContainer';
import { type SignTransactionDataDAG, type SignTransactionDataEVM, TransactionType } from './types';

const SignTransaction = () => {
  const showAlert = usePlatformAlert();
  const [loading, setLoading] = useState(false);

  // Get current wallet info for validation
  const dagAddress = useSelector(walletsSelectors.selectActiveWalletDagAddress);
  const ethAddress = useSelector(walletsSelectors.selectActiveWalletEthAddress);

  const signDagTransaction = async ({ transaction }: SignTransactionDataDAG, fee: string) => {
    const { to, value } = transaction;

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

  const signMetagraphTransaction = async ({ transaction }: SignTransactionDataDAG, asset: IAssetInfoState, fee: string) => {
    const { to, value } = transaction;

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

  const signEvmTransaction = async (chainController: EVMChainController, data: SignTransactionDataEVM, gasConfig: { gasPrice: string; gasLimit: string }) => {
    const wallet = chainController.getWallet();

    if (!wallet) {
      throw new EIPRpcError('Unable to get wallet for sending transaction.', EIPErrorCodes.Rejected);
    }

    const { type } = data;

    if (!type) {
      throw new EIPRpcError('Unable to get transaction type.', EIPErrorCodes.Rejected);
    }

    const { from, to, value, data: transactionData, gas, chainId, gasPrice } = data.transaction;

    const isNative = type === TransactionType.EvmNative;
    // data param must be 0x for native transactions
    const dataParam = isNative ? '0x' : transactionData;
    // value param must be 0 for erc-20 transactions
    const valueParam = isNative ? value : '0';

    const defaultGasLimit = ethers.utils.hexlify(Number(gasConfig.gasLimit));
    const defaultGasPrice = ethers.utils.parseUnits(gasConfig.gasPrice, 'gwei');

    const transaction: TransactionRequest = {
      chainId,

      from,
      to,
      value: valueParam,
      data: dataParam,

      gasLimit: gas || defaultGasLimit,
      gasPrice: gasPrice || defaultGasPrice,
    };

    const validTransaction = wallet.checkTransaction(transaction);
    const { hash } = await wallet.sendTransaction(validTransaction);

    return hash;
  };

  const externalSigningConfig: SignTransactionProviderConfig = {
    title: 'Sign Transaction',
    footer: 'Only sign transactions on sites you trust.',
    isLoading: loading,
    onSignTransaction: async ({ decodedData, metagraphAsset, isDAG, isMetagraph, isEvmNative, isErc20Transfer, isErc20Approve, isContractInteraction, fee, gasConfig, wallet }) => {
      setLoading(true);

      // Validation logic based on transaction type
      if (isDAG || isMetagraph) {
        // DAG transaction validation
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

        if (isDAG) {
          return await signDagTransaction(decodedData as SignTransactionDataDAG, fee);
        }

        if (isMetagraph) {
          return await signMetagraphTransaction(decodedData as SignTransactionDataDAG, metagraphAsset, fee);
        }
      }

      if (isEvmNative || isErc20Transfer || isErc20Approve || isContractInteraction) {
        // EVM transaction validation
        const isEVM = wallet.chain !== StargazerChain.CONSTELLATION;
        const addressMatch = ethAddress.toLowerCase() === wallet.address.toLowerCase();
        const chainController = getAccountController().networkController.getProviderByNetwork(wallet.chain);
        const chainInfo = chainController.getNetwork();
        const chainIdMatch = wallet.chainId === chainInfo.chainId;

        if (!isEVM) {
          throw new EIPRpcError('Unsupported chain', EIPErrorCodes.Unsupported);
        }

        if (!addressMatch) {
          throw new EIPRpcError('Account address mismatch', EIPErrorCodes.Unauthorized);
        }

        if (!chainIdMatch) {
          throw new EIPRpcError('Connected network mismatch', EIPErrorCodes.Unauthorized);
        }

        return await signEvmTransaction(chainController, decodedData as SignTransactionDataEVM, gasConfig);
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

        if (message.includes('InsufficientBalance')) {
          showAlert('Insufficient balance for the transaction', 'danger');
          return;
        }

        showAlert(err instanceof Error ? err.message : 'Unknown error occurred', 'danger');
      }
    },
  };

  return <SignTransactionContainer {...externalSigningConfig} />;
};

export default SignTransaction;
