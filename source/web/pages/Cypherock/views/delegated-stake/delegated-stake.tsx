import { dag4 } from '@stardust-collective/dag4';
import type { DelegatedStakeWithParent, SignedDelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';
import { useSelector } from 'react-redux';

import { useDelegatedStake } from 'hooks/external/useDelegatedStake';

import DelegatedStakeContainer, { DelegatedStakeProviderConfig } from 'scenes/external/DelegatedStake/DelegatedStakeContainer';

import { StargazerRequestMessage } from 'scripts/common';
import type { DelegatedStakeData } from 'scripts/Provider/constellation';

import walletsSelectors from 'selectors/walletsSelectors';

import { getDagAddress } from 'utils/wallet';

import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockService } from 'web/utils/cypherockBridge';
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
  const activeWallet = useSelector(walletsSelectors.getActiveWallet);
  const { requestMessage } = useDelegatedStake();

  const sendDelegatedStakeTransaction = async (data: DelegatedStakeData): Promise<string> => {
    const { amount, nodeId, tokenLockRef, fee, source, publicKey, cypherockId } = data;

    const dagAddress = getDagAddress(activeWallet);

    const lastRef = await dag4.network.l0Api.getDelegatedStakeLastRef(dagAddress);

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
    onDelegatedStake: async ({ decodedData }) => {
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
      changeState(WalletState.SignedError);
    },
  };

  return (
    <div className={styles.container}>
      <DelegatedStakeContainer {...cypherockDelegatedStakeConfig} />
    </div>
  );
};

export default DelegatedStakeView;
