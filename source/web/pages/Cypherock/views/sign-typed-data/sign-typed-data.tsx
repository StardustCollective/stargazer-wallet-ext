import type { ISignTypedParams } from '@cypherock/sdk-app-evm';
import React from 'react';
import { useSelector } from 'react-redux';

import { useSignTypedData } from 'hooks/external/useSignTypedData';

import SignTypedDataContainer, { SignTypedDataProviderConfig } from 'scenes/external/SignTypedData/SignTypedDataContainer';

import { StargazerRequestMessage } from 'scripts/common';
import { MessagePayload } from 'scripts/Provider/evm';

import walletsSelectors from 'selectors/walletsSelectors';

import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import { WalletState } from '../../Cypherock';

import styles from './styles.scss';

interface ISignTypedDataProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: string, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const SignTypedDataView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: ISignTypedDataProps) => {
  const { requestMessage } = useSignTypedData();
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);

  const signEthTypedData = async (payload: MessagePayload): Promise<string> => {
    if (!cypherockId) {
      throw new CypherockError('Wallet id not found', ErrorCode.UNKNOWN);
    }

    const walletId = decodeArrayFromBase64(cypherockId);

    const signTypedDataPayload: ISignTypedParams = {
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.ETH_MAINNET,
      message: payload,
    };

    const { serializedSignature } = await service.signTypedMessage(signTypedDataPayload);

    if (!serializedSignature) {
      throw new CypherockError('No signature found', ErrorCode.UNKNOWN);
    }

    return serializedSignature;
  };

  const cypherockSigningConfig: SignTypedDataProviderConfig = {
    title: 'Cypherock - Sign Typed Data',
    footer: 'Only sign typed data on sites you trust.',
    onSign: async ({ parsedPayload }) => {
      changeState(WalletState.VerifyTransaction);

      return await signEthTypedData(parsedPayload);
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
      <SignTypedDataContainer {...cypherockSigningConfig} />
    </div>
  );
};

export default SignTypedDataView;
