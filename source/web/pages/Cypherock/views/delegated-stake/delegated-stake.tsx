import { dag4 } from '@stardust-collective/dag4';
import type { DelegatedStake, DelegatedStakeWithParent, SignedDelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';
import { useSelector } from 'react-redux';

import { DAG_NETWORK } from 'constants/index';

import { useDelegatedStake } from 'hooks/external/useDelegatedStake';

import DelegatedStakeContainer, { DelegatedStakeProviderConfig } from 'scenes/external/DelegatedStake/DelegatedStakeContainer';

import { EIPErrorCodes, EIPRpcError, StargazerChain, StargazerRequestMessage } from 'scripts/common';

import walletsSelectors from 'selectors/walletsSelectors';

import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import { WalletState } from '../../Cypherock';

import styles from './styles.scss';

interface IDelegatedStakeViewProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: any, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const DelegatedStakeView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: IDelegatedStakeViewProps) => {
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);

  const { requestMessage } = useDelegatedStake();

  const sendDelegatedStakeTransaction = async (data: DelegatedStake): Promise<string> => {
    const { amount, nodeId, tokenLockRef, fee, source } = data;

    if (!cypherockId) {
      throw new CypherockError('Wallet id not found', ErrorCode.UNKNOWN);
    }

    if (!dag4.account.publicKey || !dag4.account.address) {
      throw new CypherockError('Public key not found', ErrorCode.UNKNOWN);
    }

    const { publicKey, address } = dag4.account;

    const lastRef = await dag4.network.l0Api.getDelegatedStakeLastRef(address);

    const delegatedStakeBody: DelegatedStakeWithParent = {
      source,
      nodeId,
      amount,
      tokenLockRef,
      parent: lastRef,
      fee,
    };

    const { normalized, compressed } = await dag4.keyStore.brotliCompress(delegatedStakeBody);

    const messageHash = dag4.keyStore.sha256(compressed);

    const walletId = decodeArrayFromBase64(cypherockId);

    const { signature } = await service.blindSign({
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      message: messageHash,
    });

    const signedDelegatedStake: SignedDelegatedStake = {
      value: normalized,
      proofs: [{ id: publicKey.substring(2), signature }],
    };

    const { hash } = await dag4.network.l0Api.postDelegatedStake(signedDelegatedStake);

    if (!hash) {
      throw new Error('Failed to generate signed delegated stake transaction');
    }

    return hash;
  };

  const cypherockDelegatedStakeConfig: DelegatedStakeProviderConfig = {
    title: 'Cypherock - Delegated Stake',
    onDelegatedStake: async ({ decodedData, wallet }) => {
      const isDag = wallet.chain === StargazerChain.CONSTELLATION;
      const addressMatch = dag4.account.address.toLowerCase() === wallet.address.toLowerCase();
      const networkInfo = dag4.network.getNetwork();
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

      changeState(WalletState.VerifyTransaction);

      return await sendDelegatedStakeTransaction(decodedData);
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
    },
  };

  return (
    <div className={styles.container}>
      <DelegatedStakeContainer {...cypherockDelegatedStakeConfig} />
    </div>
  );
};

export default DelegatedStakeView;
