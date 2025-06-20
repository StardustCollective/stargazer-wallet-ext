import React from 'react';
import { useSelector } from 'react-redux';

import { useSignData } from 'hooks/external/useSignData';

import SignDataContainer, { SignDataProviderConfig } from 'scenes/external/SignData/SignDataContainer';

import type { StargazerRequestMessage } from 'scripts/common';

import walletsSelectors from 'selectors/walletsSelectors';

import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import { WalletState } from '../../Cypherock';

import styles from './styles.scss';

interface ISignDataProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: any, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const SignDataView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: ISignDataProps) => {
  const { requestMessage } = useSignData();
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);

  const cypherockSigningConfig: SignDataProviderConfig = {
    title: 'Cypherock - Sign Data',
    footer: 'Only sign messages on sites you trust.',
    onSign: async ({ payload }) => {
      if (!cypherockId) {
        throw new CypherockError('Wallet id not found', ErrorCode.UNKNOWN);
      }

      const walletId = decodeArrayFromBase64(cypherockId);

      changeState(WalletState.VerifyTransaction);

      const { signature } = await service.signDagData({
        walletId,
        derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
        message: payload,
      });

      if (!signature) {
        throw new CypherockError('No signature found', ErrorCode.UNKNOWN);
      }

      return signature;
    },
    onSuccess: async signature => {
      await handleSuccessResponse(signature, requestMessage);
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
      <SignDataContainer {...cypherockSigningConfig} />
    </div>
  );
};

export default SignDataView;
