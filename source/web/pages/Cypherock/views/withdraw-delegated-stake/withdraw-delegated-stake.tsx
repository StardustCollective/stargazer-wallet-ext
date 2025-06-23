import { dag4 } from '@stardust-collective/dag4';
import type { SignedWithdrawDelegatedStake, WithdrawDelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';
import { useSelector } from 'react-redux';

import { DAG_NETWORK } from 'constants/index';

import { useWithdrawDelegatedStake } from 'hooks/external/useWithdrawDelegatedStake';

import WithdrawDelegatedStakeContainer, { WithdrawDelegatedStakeProviderConfig } from 'scenes/external/WithdrawDelegatedStake/WithdrawDelegatedStakeContainer';

import type { StargazerRequestMessage } from 'scripts/common';
import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';

import walletsSelectors from 'selectors/walletsSelectors';

import { WalletState } from 'web/pages/Cypherock/Cypherock';
import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import styles from './styles.scss';

interface IWithdrawDelegatedStakeViewProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: any, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const WithdrawDelegatedStakeView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: IWithdrawDelegatedStakeViewProps) => {
  const { requestMessage } = useWithdrawDelegatedStake();
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);

  const sendWithdrawDelegatedStakeTransaction = async (data: WithdrawDelegatedStake): Promise<string> => {
    if (!cypherockId) {
      throw new CypherockError('Wallet id not found', ErrorCode.UNKNOWN);
    }

    if (!dag4.account.publicKey) {
      throw new CypherockError('Public key not found', ErrorCode.UNKNOWN);
    }

    const { normalized, compressed } = await dag4.keyStore.brotliCompress(data);
    const messageHash = dag4.keyStore.sha256(compressed);
    const walletId = decodeArrayFromBase64(cypherockId);

    const { signature } = await service.blindSign({
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      message: messageHash,
    });

    const { publicKey } = dag4.account;

    const signedWithdrawDelegatedStake: SignedWithdrawDelegatedStake = {
      value: normalized,
      proofs: [{ id: publicKey.substring(2), signature }],
    };

    const { hash } = await dag4.network.l0Api.putWithdrawDelegatedStake(signedWithdrawDelegatedStake);

    if (!hash) {
      throw new Error('Failed to generate signed withdraw delegated stake transaction');
    }

    return hash;
  };

  const cypherockWithdrawDelegatedStakeConfig: WithdrawDelegatedStakeProviderConfig = {
    title: 'Cypherock - Withdraw Delegated Stake',
    onWithdrawDelegatedStake: async ({ decodedData, wallet }) => {
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

      return await sendWithdrawDelegatedStakeTransaction(decodedData);
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
      <WithdrawDelegatedStakeContainer {...cypherockWithdrawDelegatedStakeConfig} />
    </div>
  );
};

export default WithdrawDelegatedStakeView;
