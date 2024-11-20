import axios from 'axios';
import { dag4 } from '@stardust-collective/dag4';
import { toDag, toDatum } from 'utils/number';
import { decodeFromBase64 } from 'utils/encoding';
import { DataFeeResponse, DataFeeTransaction, EstimateFeeResponse } from './types';

export const generateProof = async (
  message: string,
  privateKey: string,
  publicKey: string
) => {
  const signature = await dag4.keyStore.dataSign(privateKey, message);

  return {
    id: publicKey,
    signature,
  };
};

export const generateFeeProof = async (
  message: string,
  privateKey: string,
  publicKey: string
) => {
  const serializedMessage = Buffer.from(message, 'utf8').toString('hex');
  const hash = dag4.keyStore.sha256(Buffer.from(serializedMessage, 'hex'));
  const signature = await dag4.keyStore.sign(privateKey, hash);

  return {
    id: publicKey,
    signature,
  };
};

export const buildFeeTransaction = (
  fee: string,
  destination: string,
  updateHash: string
): DataFeeTransaction => {
  const { address } = dag4.account.keyTrio;
  return {
    source: address,
    destination: destination,
    amount: toDatum(fee),
    dataUpdateRef: updateHash,
  };
};

export const sendMetagraphDataTransaction = async (
  dL1endpoint: string,
  body: any
): Promise<DataFeeResponse> => {
  const response = await axios.post<DataFeeResponse>(
    `${dL1endpoint}/data`,
    JSON.stringify(body)
  );
  return response.data;
};

export const buildTransactionBody = async (
  dataEncoded: any,
  fee: string,
  destination: string,
  updateHash: string
): Promise<any> => {
  const { privateKey, publicKey } = dag4.account.keyTrio;

  const uncompressedPublicKey = publicKey.length === 128 ? '04' + publicKey : publicKey;
  const pubKey = uncompressedPublicKey.substring(2);

  const proof = await generateProof(dataEncoded, privateKey, pubKey);
  const dataDecoded = JSON.parse(decodeFromBase64(dataEncoded));
  const body: any = {
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
    const feeProof = await generateFeeProof(
      JSON.stringify(feeObject),
      privateKey,
      pubKey
    );
    body.fee = {
      value: {
        ...feeObject,
      },
      proofs: [feeProof],
    };
  }

  return body;
};

export const getFeeEstimation = async (
  dL1endpoint: string,
  data: any
): Promise<{ fee: string; address: string; updateHash: string }> => {
  const zeroFee = {
    fee: '0',
    address: '',
    updateHash: '',
  };

  try {
    const response = await axios.post<EstimateFeeResponse>(
      `${dL1endpoint}/data/estimate-fee`,
      JSON.stringify(data)
    );

    if (!!response?.data?.address && !!response?.data?.updateHash) {
      return {
        ...response.data,
        fee: toDag(response.data.fee).toString(),
      };
    }

    return zeroFee;
  } catch (err) {
    return zeroFee;
  }
};
