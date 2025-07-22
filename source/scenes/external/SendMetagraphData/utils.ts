import { dag4 } from '@stardust-collective/dag4';
import type { DataFeeTransaction, DataTransactionBody, EstimateFeeResponse } from '@stardust-collective/dag4-network';

import type { IAssetInfoState } from 'state/assets/types';

import { decodeFromBase64 } from 'utils/encoding';
import { toDag, toDatum } from 'utils/number';

export const generateProof = async (message: string, privateKey: string, publicKey: string) => {
  const signature = await dag4.keyStore.dataSign(privateKey, message);

  return {
    id: publicKey,
    signature,
  };
};

export const generateFeeProof = async (message: string, privateKey: string, publicKey: string) => {
  const serializedMessage = Buffer.from(message, 'utf8').toString('hex');
  const hash = dag4.keyStore.sha256(Buffer.from(serializedMessage, 'hex'));
  const signature = await dag4.keyStore.sign(privateKey, hash);

  return {
    id: publicKey,
    signature,
  };
};

export const buildFeeTransaction = (fee: string, destination: string, updateHash: string): DataFeeTransaction => {
  const { address } = dag4.account.keyTrio;
  return {
    source: address,
    destination,
    amount: toDatum(fee),
    dataUpdateRef: updateHash,
  };
};

export const buildTransactionBody = async (dataEncoded: string, fee: string, destination: string, updateHash: string): Promise<DataTransactionBody> => {
  const { privateKey, publicKey } = dag4.account.keyTrio;

  const uncompressedPublicKey = publicKey.length === 128 ? `04${publicKey}` : publicKey;
  const pubKey = uncompressedPublicKey.substring(2);

  const proof = await generateProof(dataEncoded, privateKey, pubKey);
  const dataDecoded = JSON.parse(decodeFromBase64(dataEncoded));
  const body: DataTransactionBody = {
    data: {
      value: {
        ...dataDecoded,
      },
      proofs: [proof],
    },
  };

  const shouldBuildFeeTransaction = !!fee && !!destination && !!updateHash;

  if (shouldBuildFeeTransaction) {
    const feeObject = buildFeeTransaction(fee, destination, updateHash);
    const feeProof = await generateFeeProof(JSON.stringify(feeObject), privateKey, pubKey);
    body.fee = {
      value: {
        ...feeObject,
      },
      proofs: [feeProof],
    };
  }

  return body;
};

export const getFeeEstimation = async (asset: IAssetInfoState, data: string): Promise<{ fee: string; address: string; updateHash: string }> => {
  const zeroFee = {
    fee: '0',
    address: '',
    updateHash: '',
  };

  try {
    const metagraphClient = dag4.account.createMetagraphTokenClient({
      metagraphId: asset.address,
      id: asset.address,
      l0Url: asset.l0endpoint,
      l1Url: asset.l1endpoint,
      dl1Url: asset.dl1endpoint,
      beUrl: '',
    });

    const response: EstimateFeeResponse = await metagraphClient.getDataFeeEstimate(data);

    if (!!response.address && !!response.updateHash) {
      return {
        ...response,
        fee: toDag(response.fee).toString(),
      };
    }

    return zeroFee;
  } catch (err) {
    return zeroFee;
  }
};
