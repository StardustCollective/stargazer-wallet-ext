import { dag4 } from '@stardust-collective/dag4';
import type { DataFeeTransaction, DataTransactionBody, SendDataFeeResponse, SignDataFeeResponse } from '@stardust-collective/dag4-network';
import React from 'react';
import { useSelector } from 'react-redux';

import { DAG_NETWORK } from 'constants/index';

import { useSendMetagraphData } from 'hooks/external/useSendMetagraphData';

import SendMetagraphDataContainer, { type SendMetagraphDataProviderConfig } from 'scenes/external/SendMetagraphData/SendMetagraphDataContainer';

import type { StargazerRequestMessage } from 'scripts/common';
import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import { type ISendMetagraphDataParams } from 'scripts/Provider/constellation';

import walletsSelectors from 'selectors/walletsSelectors';

import { type IAssetInfoState } from 'state/assets/types';

import { decodeFromBase64 } from 'utils/encoding';
import { toDatum } from 'utils/number';

import { decodeArrayFromBase64 } from 'web/pages/Cypherock/utils';
import { CypherockError, CypherockService, ErrorCode } from 'web/utils/cypherockBridge';
import { CYPHEROCK_DERIVATION_PATHS } from 'web/utils/cypherockBridge/constants';

import { WalletState } from '../../Cypherock';

import styles from './styles.scss';

interface ISendMetagraphDataViewProps {
  service: CypherockService;
  changeState: (state: WalletState) => void;
  handleSuccessResponse: (result: any, messageRequest: StargazerRequestMessage) => Promise<void>;
  handleErrorResponse: (err: unknown, messageRequest: StargazerRequestMessage) => Promise<void>;
}

const SendMetagraphDataView = ({ service, changeState, handleSuccessResponse, handleErrorResponse }: ISendMetagraphDataViewProps) => {
  const { requestMessage } = useSendMetagraphData();
  const cypherockId = useSelector(walletsSelectors.selectActiveWalletCypherockId);

  const sendMetagraphDataTx = async (decodedData: ISendMetagraphDataParams, asset: IAssetInfoState, fee: { fee: string; address: string; updateHash: string }): Promise<SendDataFeeResponse | SignDataFeeResponse> => {
    if (!cypherockId) {
      throw new CypherockError('Wallet id not found', ErrorCode.UNKNOWN);
    }

    if (!dag4?.account?.publicKey || !dag4?.account?.address) {
      throw new CypherockError('Wallet public key not found', ErrorCode.UNKNOWN);
    }

    const { publicKey, address } = dag4.account.keyTrio;

    const walletId = decodeArrayFromBase64(cypherockId);
    const dataDecoded = JSON.parse(decodeFromBase64(decodedData.payload));

    const { signature: dataSignature } = await service.signDagData({
      walletId,
      derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
      message: decodedData.payload,
    });

    const body: DataTransactionBody = {
      data: {
        value: {
          ...dataDecoded,
        },
        proofs: [
          {
            id: publicKey,
            signature: dataSignature,
          },
        ],
      },
    };

    const shouldBuildFeeTransaction = !!fee && !!fee.fee && fee.address && !!fee.updateHash;

    if (shouldBuildFeeTransaction) {
      const feeObject: DataFeeTransaction = {
        source: address,
        destination: fee.address,
        amount: toDatum(fee.fee),
        dataUpdateRef: fee.updateHash,
      };
      const feeString = JSON.stringify(feeObject);
      const serializedMessage = Buffer.from(feeString, 'utf8').toString('hex');
      const hash = dag4.keyStore.sha256(Buffer.from(serializedMessage, 'hex'));

      const { signature: feeSignature } = await service.signDagMessage({
        walletId,
        derivationPath: CYPHEROCK_DERIVATION_PATHS.DAG_MAINNET,
        message: hash,
      });

      body.fee = {
        value: {
          ...feeObject,
        },
        proofs: [
          {
            id: publicKey,
            signature: feeSignature,
          },
        ],
      };
    }

    const metagraphClient = dag4.account.createMetagraphTokenClient({
      metagraphId: asset.address,
      id: asset.address,
      l0Url: asset.l0endpoint,
      l1Url: asset.l1endpoint,
      dl1Url: asset.dl1endpoint,
      beUrl: '',
    });

    const response: SendDataFeeResponse = await metagraphClient.sendDataTransaction(body);

    if (decodedData.sign) {
      (response as SignDataFeeResponse).signature = body.data.proofs[0].signature;
      if (response?.feeHash) {
        (response as SignDataFeeResponse).feeSignature = body.fee.proofs[0].signature;
      }
    }

    return response;
  };

  const cypherockSendMetagraphDataConfig: SendMetagraphDataProviderConfig = {
    title: 'Cypherock - Send Metagraph Data',
    onSendMetagraphData: async ({ decodedData, asset, wallet, fee }) => {
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

      return await sendMetagraphDataTx(decodedData, asset, fee);
    },
    onSuccess: async result => {
      await handleSuccessResponse(result, requestMessage);
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
      <SendMetagraphDataContainer {...cypherockSendMetagraphDataConfig} />
    </div>
  );
};

export default SendMetagraphDataView;
