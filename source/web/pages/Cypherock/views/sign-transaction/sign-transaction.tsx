import type { ISignTxnData } from '@cypherock/sdk-app-constellation';
import type { UnsignedTransaction } from '@ethersproject/transactions';
import { dag4 } from '@stardust-collective/dag4';
import type { PostTransactionV2 } from '@stardust-collective/dag4-keystore';
import type { GlobalDagNetwork, MetagraphTokenNetwork } from '@stardust-collective/dag4-network';
import { ethers } from 'ethers';
import React from 'react';
import { useSelector } from 'react-redux';

import { useSignTransaction } from 'hooks/external/useSignTransaction';

import SignTransactionContainer, { SignTransactionProviderConfig } from 'scenes/external/SignTransaction/SignTransactionContainer';
import { SignTransactionDataDAG, SignTransactionDataEVM, TransactionType } from 'scenes/external/SignTransaction/types';

import EVMChainController from 'scripts/Background/controllers/EVMChainController';
import { EIPErrorCodes, EIPRpcError, type StargazerRequestMessage } from 'scripts/common';

import walletsSelectors from 'selectors/walletsSelectors';

import type { IAssetInfoState } from 'state/assets/types';

import { toDag } from 'utils/number';

import { WalletState } from 'web/pages/Cypherock/Cypherock';
import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import styles from './styles.scss';

interface ISignTransactionProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: any, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const SignTxnView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: ISignTransactionProps) => {
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);
  const { requestMessage } = useSignTransaction();

  const signDAGTransaction = async (data: SignTransactionDataDAG, asset: IAssetInfoState, isMetagraphTransaction: boolean, fee: string): Promise<string> => {
    const { from, to, value: amount } = data;

    if (!dag4?.account?.publicKey) {
      throw new CypherockError('No public key found', ErrorCode.UNKNOWN);
    }

    if (!cypherockId) {
      throw new CypherockError('No wallet id found', ErrorCode.UNKNOWN);
    }

    const walletId = decodeArrayFromBase64(cypherockId);
    const amountInDag = toDag(amount);
    const feeInDag = Number(fee);

    // Determine network instance based on asset type
    let networkInstance: MetagraphTokenNetwork | GlobalDagNetwork = dag4.network;

    if (isMetagraphTransaction) {
      // This is a metagraph transaction
      const metagraphClient = dag4.account.createMetagraphTokenClient({
        metagraphId: asset.address,
        id: asset.address,
        l0Url: asset.l0endpoint,
        l1Url: asset.l1endpoint,
        beUrl: '',
      });
      networkInstance = metagraphClient.networkInstance;
    }

    const lastRef = await networkInstance.getAddressLastAcceptedTransactionRef(from);

    // Prepare transaction
    const { tx }: { tx: PostTransactionV2 } = dag4.keyStore.prepareTx(amountInDag, to, from, lastRef, feeInDag, '2.0');

    const txn: ISignTxnData = {
      txn: {
        ...tx.value,
        amount: tx.value.amount.toString(), // amount should be converted to string
        salt: BigInt(tx.value.salt as string).toString(16),
      },
    };

    changeState(WalletState.VerifyTransaction);

    const { signature } = await service.signDagTransaction({
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      txn,
    });

    if (!signature) {
      throw new CypherockError('No signature found', ErrorCode.UNKNOWN);
    }

    const { publicKey } = dag4.account;

    // Add the signature to the transaction
    tx.proofs = [
      {
        id: publicKey.substring(2), // Remove 04 prefix
        signature,
      },
    ];

    // Post transaction to the network
    const txHash = await networkInstance.postTransaction(tx);

    if (!txHash) {
      throw new CypherockError('No transaction hash found', ErrorCode.UNKNOWN);
    }

    return txHash;
  };

  const signEvmTransaction = async (data: SignTransactionDataEVM, gasConfig: { gasPrice: string; gasLimit: string }): Promise<string> => {
    if (!cypherockId) {
      throw new CypherockError('No wallet id found', ErrorCode.UNKNOWN);
    }

    if (!data?.extras?.type) {
      throw new EIPRpcError('Unable to get transaction type.', EIPErrorCodes.Rejected);
    }

    const { type } = data.extras;
    const walletId = decodeArrayFromBase64(cypherockId);

    const defaultGasLimit = ethers.utils.hexlify(Number(gasConfig.gasLimit));
    const defaultGasPrice = ethers.utils.parseUnits(gasConfig.gasPrice, 'gwei');

    const chainController = new EVMChainController({ chain: data.chainId });
    const nonce = await chainController.getNonce(data.from);

    const isNative = type === TransactionType.EvmNative;
    // data param must be 0x for native transactions
    const dataParam = isNative ? '0x' : data.data;
    // value param must be 0 for erc-20 transactions
    const valueParam = isNative ? data.value : '0';

    const transaction: UnsignedTransaction = {
      chainId: data.chainId,

      type: null, // Legacy transaction

      to: data.to,
      value: valueParam,
      data: dataParam,

      gasLimit: data.gas || defaultGasLimit,
      gasPrice: data.gasPrice || defaultGasPrice._hex,

      nonce,
    };

    const serialized = ethers.utils.serializeTransaction(transaction);

    changeState(WalletState.VerifyTransaction);

    const { serializedTxn } = await service.signEVMTransaction({
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.ETH_MAINNET,
      txn: serialized,
      serializeTxn: true,
    });

    const { hash } = await chainController.sendTransaction(serializedTxn);

    return hash;
  };

  const cypherockSigningConfig: SignTransactionProviderConfig = {
    title: 'Cypherock - Sign Transaction',
    footer: 'Only sign transactions on sites you trust.',
    onSignTransaction: async ({ metagraphAsset, decodedData, isDAG, isMetagraph, isEvmNative, isErc20Transfer, isErc20Approve, fee, gasConfig }) => {
      if (isDAG || isMetagraph) {
        return await signDAGTransaction(decodedData as SignTransactionDataDAG, metagraphAsset, isMetagraph, fee);
      }

      if (isEvmNative || isErc20Transfer || isErc20Approve) {
        return await signEvmTransaction(decodedData as SignTransactionDataEVM, gasConfig);
      }

      throw new Error('Unsupported transaction type');
    },
    onSuccess: async txHash => {
      await handleSuccessResponse(txHash, requestMessage);
      changeState(WalletState.SignedSuccess);
    },
    onError: async error => {
      if (error instanceof Error && error.message.includes('aborted')) {
        return; // User cancelled hardware signing
      }
      await handleErrorResponse(error, requestMessage);
      changeState(WalletState.SignedError);
    },
  };

  return (
    <div className={styles.container}>
      <SignTransactionContainer {...cypherockSigningConfig} />
    </div>
  );
};

export default SignTxnView;
