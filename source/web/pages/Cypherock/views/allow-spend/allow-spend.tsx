import { dag4 } from '@stardust-collective/dag4';
import type { GlobalDagNetwork, MetagraphTokenNetwork, SignedAllowSpend } from '@stardust-collective/dag4-network';
import React from 'react';
import { useSelector } from 'react-redux';

import { DAG_NETWORK } from 'constants/index';

import { useAllowSpend } from 'hooks/external/useAllowSpend';

import AllowSpendContainer, { AllowSpendProviderConfig } from 'scenes/external/AllowSpend/AllowSpendContainer';

import type { StargazerRequestMessage } from 'scripts/common';
import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import type { AllowSpendData } from 'scripts/Provider/constellation';

import walletsSelectors from 'selectors/walletsSelectors';

import type { IAssetInfoState } from 'state/assets/types';

import { toDatum } from 'utils/number';

import { WalletState } from 'web/pages/Cypherock/Cypherock';
import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import styles from './styles.scss';

interface IAllowSpendViewProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: any, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const AllowSpendView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: IAllowSpendViewProps) => {
  const { requestMessage } = useAllowSpend();
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);

  const sendAllowSpendTransaction = async (data: AllowSpendData, asset: IAssetInfoState, fee: string): Promise<string> => {
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

    const lastRef = await networkInstance.l1Api.getAllowSpendLastRef(address);

    const allowSpendBody = {
      source: data.source,
      destination: data.destination,
      approvers: data.approvers,
      amount: data.amount,
      fee: toDatum(fee),
      lastValidEpochProgress: data.validUntilEpoch,
      parent: lastRef,
      currencyId: currency,
    };

    const { normalized, compressed } = await dag4.keyStore.brotliCompress(allowSpendBody);
    const messageHash = dag4.keyStore.sha256(compressed);
    const walletId = decodeArrayFromBase64(cypherockId);

    const { signature } = await service.blindSign({
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      message: messageHash,
    });

    const signedAllowSpend: SignedAllowSpend = {
      value: normalized,
      proofs: [{ id: publicKey.substring(2), signature }],
    };

    const { hash } = await networkInstance.l1Api.postAllowSpend(signedAllowSpend);

    if (!hash) {
      throw new Error('Failed to generate signed token lock transaction');
    }

    return hash;
  };

  const cypherockAllowSpendConfig: AllowSpendProviderConfig = {
    title: 'Cypherock - Allow Spend',
    onAllowSpend: async ({ decodedData, asset, fee, wallet }) => {
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

      return await sendAllowSpendTransaction(decodedData, asset, fee);
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
      <AllowSpendContainer {...cypherockAllowSpendConfig} />
    </div>
  );
};

export default AllowSpendView;
