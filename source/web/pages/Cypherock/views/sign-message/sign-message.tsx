import type { ISignPersonalMsgParams } from '@cypherock/sdk-app-evm';
import React from 'react';
import { useSelector } from 'react-redux';

import { useSignMessage } from 'hooks/external/useSignMessage';

import SignMessageContainer, { SignMessageProviderConfig } from 'scenes/external/SignMessage/SignMessageContainer';

import { StargazerChain, StargazerRequestMessage } from 'scripts/common';

import walletsSelectors from 'selectors/walletsSelectors';

import { decodeArrayFromBase64, stringToHex } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode, ISignDagMsgParams } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import { WalletState } from '../../Cypherock';

import styles from './styles.scss';

interface ISignMsgProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: string, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const SignMsgView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: ISignMsgProps) => {
  const { requestMessage } = useSignMessage();
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);

  const signDagMessage = async (walletId: Uint8Array, message: string): Promise<string> => {
    const signDagMessagePayload: ISignDagMsgParams = {
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      message,
    };

    const { signature } = await service.signDagMessage(signDagMessagePayload);

    if (!signature) {
      throw new CypherockError('No signature found', ErrorCode.UNKNOWN);
    }

    return signature;
  };

  const signEthMessage = async (walletId: Uint8Array, message: string): Promise<string> => {
    const signMessagePayload: ISignPersonalMsgParams = {
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.ETH_MAINNET,
      message,
    };

    const { serializedSignature } = await service.signPersonalMessage(signMessagePayload);

    if (!serializedSignature) {
      throw new CypherockError('No signature found', ErrorCode.UNKNOWN);
    }

    return serializedSignature;
  };

  const cypherockSigningConfig: SignMessageProviderConfig = {
    title: 'Cypherock - Sign Message',
    footer: 'Only sign messages on sites you trust.',
    onSign: async ({ payload, parsedPayload, wallet }) => {
      if (!cypherockId) {
        throw new CypherockError('Wallet id not found', ErrorCode.UNKNOWN);
      }

      const isDag = wallet.chain === StargazerChain.CONSTELLATION;
      const walletId = decodeArrayFromBase64(cypherockId);

      const message = isDag ? payload : stringToHex(parsedPayload.content);
      const signMessage = isDag ? signDagMessage : signEthMessage;

      changeState(WalletState.VerifyTransaction);

      return await signMessage(walletId, message);
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
      <SignMessageContainer {...cypherockSigningConfig} />
    </div>
  );
};

export default SignMsgView;
