import { dag4 } from '@stardust-collective/dag4';
import type { GlobalDagNetwork, MetagraphTokenNetwork, SignedTokenLock, TokenLockWithParent } from '@stardust-collective/dag4-network';
import React from 'react';
import { useSelector } from 'react-redux';

import { useTokenLock } from 'hooks/external/useTokenLock';

import TokenLockContainer, { TokenLockProviderConfig } from 'scenes/external/TokenLock/TokenLockContainer';

import { StargazerRequestMessage } from 'scripts/common';
import type { TokenLockDataParam } from 'scripts/Provider/constellation';

import walletsSelectors from 'selectors/walletsSelectors';

import type { IAssetInfoState } from 'state/assets/types';

import { getDagAddress } from 'utils/wallet';

import { WalletState } from 'web/pages/Cypherock/Cypherock';
import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockService } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import styles from './styles.scss';

interface ITokenLockViewProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: any, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const TokenLockView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: ITokenLockViewProps) => {
  const activeWallet = useSelector(walletsSelectors.getActiveWallet);
  const { requestMessage } = useTokenLock();

  const sendTokenLockTransaction = async (walletId: Uint8Array, data: TokenLockDataParam, asset: IAssetInfoState, publicKey: string): Promise<string> => {
    const dagAddress = getDagAddress(activeWallet);

    let currency: string | null = null;
    let networkInstance: GlobalDagNetwork | MetagraphTokenNetwork = dag4.network;

    if (!!data.currencyId && asset) {
      const metagraphClient = dag4.account.createMetagraphTokenClient({
        metagraphId: asset.address,
        id: asset.address,
        l0Url: asset.l0endpoint,
        l1Url: asset.l1endpoint,
        beUrl: '',
      });

      currency = asset.address;
      networkInstance = metagraphClient.networkInstance;
    }

    const lastRef = await networkInstance.l1Api.getTokenLockLastRef(dagAddress);

    const tokenLockBody: TokenLockWithParent = {
      source: data.source,
      amount: data.amount,
      parent: lastRef,
      currencyId: currency,
      fee: 0,
      unlockEpoch: data.unlockEpoch ?? null,
    };

    const { normalized, compressed } = await dag4.keyStore.brotliCompress(tokenLockBody);

    const messageHash = dag4.keyStore.sha256(compressed);

    const { signature } = await service.blindSign({
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      message: messageHash,
    });

    const signedTokenLock: SignedTokenLock = {
      value: normalized,
      proofs: [{ id: publicKey.substring(2), signature }],
    };

    const { hash } = await networkInstance.l1Api.postTokenLock(signedTokenLock);

    if (!hash) {
      throw new Error('Failed to generate signed token lock transaction');
    }

    return hash;
  };

  const cypherockTokenLockConfig: TokenLockProviderConfig = {
    title: 'Cypherock - TokenLock',
    onTokenLock: async ({ decodedData, asset }) => {
      const { cypherockId, publicKey } = decodedData;
      const walletId = decodeArrayFromBase64(cypherockId);

      changeState(WalletState.VerifyTransaction);

      return await sendTokenLockTransaction(walletId, decodedData, asset, publicKey);
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
      <TokenLockContainer {...cypherockTokenLockConfig} />
    </div>
  );
};

export default TokenLockView;
