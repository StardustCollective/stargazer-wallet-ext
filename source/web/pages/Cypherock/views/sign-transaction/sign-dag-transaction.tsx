import type { ISignTxnData } from '@cypherock/sdk-app-constellation';
import { dag4 } from '@stardust-collective/dag4';
import type { PostTransactionV2 } from '@stardust-collective/dag4-keystore';
import type { GlobalDagNetwork, MetagraphTokenNetwork } from '@stardust-collective/dag4-network';
import React from 'react';
import { useSelector } from 'react-redux';

import { useSignTransaction } from 'hooks/external/useSignTransaction';

import SignTransactionContainer, { SignTransactionProviderConfig } from 'scenes/external/SignTransaction/SignTransactionContainer';

import type { StargazerRequestMessage } from 'scripts/common';
import type { SignTransactionDataDAG } from 'scripts/Provider/constellation';

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

  const cypherockSigningConfig: SignTransactionProviderConfig = {
    title: 'Cypherock - Sign Transaction',
    footer: 'Only sign transactions on sites you trust.',
    onSignTransaction: async ({ asset, decodedData, isDAGTransaction, isMetagraphTransaction, isEVMTransaction, fee }) => {
      if (isDAGTransaction || isMetagraphTransaction) {
        return await signDAGTransaction(decodedData as SignTransactionDataDAG, asset, isMetagraphTransaction, fee);
      }

      if (isEVMTransaction) {
        throw new Error('EVM transactions not supported with Cypherock hardware wallet');
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
