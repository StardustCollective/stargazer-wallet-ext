import { dag4 } from '@stardust-collective/dag4';
import type { GlobalDagNetwork, MetagraphTokenNetwork, SignedTokenLock, TokenLockWithParent } from '@stardust-collective/dag4-network';
import React from 'react';
import { useSelector } from 'react-redux';

import { DAG_NETWORK } from 'constants/index';

import { useTokenLock } from 'hooks/external/useTokenLock';

import TokenLockContainer, { TokenLockProviderConfig } from 'scenes/external/TokenLock/TokenLockContainer';

import type { StargazerRequestMessage } from 'scripts/common';
import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import type { TokenLockDataParam } from 'scripts/Provider/constellation';

import walletsSelectors from 'selectors/walletsSelectors';

import type { IAssetInfoState } from 'state/assets/types';

import { WalletState } from 'web/pages/Cypherock/Cypherock';
import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import styles from './styles.scss';
import { retry } from 'utils/httpRequests/utils';

interface ITokenLockViewProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: any, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const TokenLockView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: ITokenLockViewProps) => {
  const { requestMessage } = useTokenLock();
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);

  const sendTokenLockTransaction = async (data: TokenLockDataParam, asset: IAssetInfoState): Promise<string> => {
    if (!cypherockId) {
      throw new CypherockError('Wallet id not found', ErrorCode.UNKNOWN);
    }

    if (!dag4?.account?.publicKey || !dag4?.account?.address) {
      throw new CypherockError('Wallet public key not found', ErrorCode.UNKNOWN);
    }

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

    const { publicKey, address } = dag4.account;

    const lastRef = await networkInstance.l1Api.getTokenLockLastRef(address);

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
    const walletId = decodeArrayFromBase64(cypherockId);

    const { signature } = await service.blindSign({
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      message: messageHash,
    });

    const signedTokenLock: SignedTokenLock = {
      value: normalized,
      proofs: [{ id: publicKey.substring(2), signature }],
    };

    let hash: string | null = null;

    try {
      const { hash: hashResponse } = await networkInstance.l1Api.postTokenLock(signedTokenLock);
      hash = hashResponse;
    } catch (err) {
      const { hash: hashResponse } = await retry(() => networkInstance.l1Api.postTokenLock(signedTokenLock, { sticky: false }));
      hash = hashResponse;
    }

    if (!hash) {
      throw new Error('Failed to generate signed token lock transaction');
    }

    return hash;
  };

  const cypherockTokenLockConfig: TokenLockProviderConfig = {
    title: 'Cypherock - Token Lock',
    onTokenLock: async ({ decodedData, asset, wallet }) => {
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

      return await sendTokenLockTransaction(decodedData, asset);
    },
    onSuccess: async txHash => {
      await handleSuccessResponse(txHash, requestMessage);
      changeState(WalletState.TransactionSent);
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
      <TokenLockContainer {...cypherockTokenLockConfig} />
    </div>
  );
};

export default TokenLockView;
