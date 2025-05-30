import React from 'react';
import SignMessageView, { ISignMessageProps } from 'scenes/external/views/sign-message';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import {
  CypherockError,
  CypherockService,
  ErrorCode,
  ISignDagMsgParams,
} from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';
import type {
  ISignMessageParams,
  StargazerSignatureRequest,
} from 'scripts/Provider/constellation';
import { decodeArrayFromBase64, stringToHex } from 'web/pages/Cypherock/utils';
import { decodeFromBase64 } from 'utils/encoding';
import type { ISignPersonalMsgParams } from '@cypherock/sdk-app-evm';
import { EIPErrorCodes, EIPRpcError, StargazerRequestMessage } from 'scripts/common';
import { WalletState } from '../../Cypherock';
import styles from './styles.scss';

interface ISignMsgProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (
    result: any,
    messageRequest: StargazerRequestMessage
  ) => Promise<void>;
  handleErrorResponse: (
    err: unknown,
    messageRequest: StargazerRequestMessage
  ) => Promise<void>;
}

const SignMsgView = ({
  service,
  changeState,
  handleSuccessResponse,
  handleErrorResponse,
}: ISignMsgProps) => {
  const { message: messageRequest, data } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<ISignMessageParams>(
      location.href
    );

  const { asset, payload, chain, wallet } = data;
  const isDagSignature = asset === 'DAG';

  // Decode base64 data
  const decodedPayload = decodeFromBase64(payload);

  let parsedPayload: StargazerSignatureRequest = null;
  try {
    // Try to parse and check if it's a JSON object
    parsedPayload = JSON.parse(decodedPayload);
  } catch (err) {
    // Decoded data is not a valid JSON
    parsedPayload = null;
  }

  if (!parsedPayload?.content) {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('Invalid payload', EIPErrorCodes.Rejected),
      messageRequest
    );
    window.close();
  }

  const signDagMessage = async ({
    walletId,
    message,
  }: {
    walletId: Uint8Array;
    message: string;
  }) => {
    const signDagMessagePayload: ISignDagMsgParams = {
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      message,
    };

    const signDagMessageResult = await service.signDagMessage(signDagMessagePayload);

    if (!signDagMessageResult.signature) {
      throw new CypherockError('No signature found', ErrorCode.UNKNOWN);
    }

    return signDagMessageResult.signature;
  };

  const signEthMessage = async ({
    walletId,
    message,
  }: {
    walletId: Uint8Array;
    message: string;
  }) => {
    const signMessagePayload: ISignPersonalMsgParams = {
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.ETH_MAINNET,
      message,
    };

    const signMessageResult = await service.signPersonalMessage(signMessagePayload);

    if (!signMessageResult.serializedSignature) {
      throw new CypherockError('No signature found', ErrorCode.UNKNOWN);
    }
    return signMessageResult.serializedSignature;
  };

  const onSign = async () => {
    try {
      const { cypherockId, payload } = data;
      const walletId = decodeArrayFromBase64(cypherockId);
      const message = isDagSignature ? payload : stringToHex(parsedPayload.content);
      const signMessage = isDagSignature ? signDagMessage : signEthMessage;

      changeState(WalletState.VerifyTransaction);

      const signature = await signMessage({
        walletId,
        message,
      });

      await handleSuccessResponse(signature, messageRequest);
      changeState(WalletState.SignedSuccess);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('aborted')) {
        return;
      }

      await handleErrorResponse(err, messageRequest);
      changeState(WalletState.SignedError);
    }
  };

  const onReject = () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      messageRequest
    );
    window.close();
  };

  const props: ISignMessageProps = {
    title: 'Cypherock - Signature Request',
    account: wallet,
    network: chain,
    message: parsedPayload,
    footer: 'Only sign messages on sites you trust.',
    onSign: onSign,
    onReject: onReject,
  };

  return (
    <div className={styles.container}>
      <SignMessageView {...props} />
    </div>
  );
};

export default SignMsgView;
