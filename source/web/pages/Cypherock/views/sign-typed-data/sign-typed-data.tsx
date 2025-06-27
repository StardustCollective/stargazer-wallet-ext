import type { ISignTypedParams } from '@cypherock/sdk-app-evm';
import React from 'react';
import { useSelector } from 'react-redux';

import { useSignTypedData } from 'hooks/external/useSignTypedData';

import SignTypedDataContainer, { SignTypedDataProviderConfig } from 'scenes/external/SignTypedData/SignTypedDataContainer';

import { EIPErrorCodes, EIPRpcError, StargazerChain, StargazerRequestMessage } from 'scripts/common';
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
  const ethAddress = useSelector(walletsSelectors.selectActiveWalletEthAddress);
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
    onSign: async ({ parsedPayload, wallet }) => {
      const isEvm = wallet.chain !== StargazerChain.CONSTELLATION;
      const addressMatch = ethAddress.toLowerCase() === wallet.address.toLowerCase();

      // For EVM, chainId validation is done during the initial parsing
      // The chainId in the typed data domain should match the wallet's chainId
      const typedDataChainId = Number(parsedPayload.domain?.chainId);
      const chainMatch = Number(typedDataChainId) === wallet.chainId;

      if (!isEvm) {
        throw new EIPRpcError('Unsupported chain', EIPErrorCodes.Unsupported);
      }

      if (!addressMatch) {
        throw new EIPRpcError('Account address mismatch', EIPErrorCodes.Unauthorized);
      }

      if (typedDataChainId && !chainMatch) {
        throw new EIPRpcError('Connected network mismatch', EIPErrorCodes.Unauthorized);
      }

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
    },
  };

  return (
    <div className={styles.container}>
      <SignTypedDataContainer {...cypherockSigningConfig} />
    </div>
  );
};

export default SignTypedDataView;
