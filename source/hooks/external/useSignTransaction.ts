import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { StargazerExternalPopups, StargazerWSMessageBroker } from 'scripts/Background/messaging';
import { EIPErrorCodes, EIPRpcError, StargazerChain, StargazerRequestMessage } from 'scripts/common';
import { SignTransactionDataDAG } from 'scripts/Provider/constellation';
import { SignTransactionDataEVM } from 'scripts/Provider/evm';

import assetsSelectors from 'selectors/assetsSelectors';

import { IAssetInfoState } from 'state/assets/types';
import { AssetType } from 'state/vault/types';

import { toDag } from 'utils/number';

export type SignTransactionData = SignTransactionDataDAG & SignTransactionDataEVM;

export interface UseSignTransactionReturn {
  asset: IAssetInfoState | null;
  requestMessage: StargazerRequestMessage;
  decodedData: SignTransactionData;
  isDAGTransaction: boolean;
  isMetagraphTransaction: boolean;
  isEVMTransaction: boolean;
  fee: string;
  origin: string;
  setFee: (fee: string) => void;
  handleReject: () => Promise<void>;
  handleSuccess: (txHash: string) => Promise<void>;
  handleError: (error: unknown) => Promise<void>;
}

/**
 * Custom hook that extracts and manages common sign transaction logic
 * Handles data extraction, rejection, success, and error scenarios for different transaction types
 */
export const useSignTransaction = (): UseSignTransactionReturn => {
  const assets = useSelector(assetsSelectors.getAssets);

  // Extract and decode request data
  const {
    message: requestMessage,
    data: decodedData,
    origin,
  } = useMemo(() => {
    return StargazerExternalPopups.decodeRequestMessageLocationParams<SignTransactionData>(location.href);
  }, []);

  const feeInDatum = decodedData?.fee ?? 0;

  // Initialize fee state with default value from decoded data
  const [fee, setFee] = useState<string>(() => {
    return toDag(feeInDatum).toString();
  });

  // Determine the asset
  const asset = useMemo(() => {
    return decodedData?.assetId ? Object.values(assets).find(a => a.id === decodedData.assetId) : null;
  }, [decodedData?.assetId, assets]);

  // Determine transaction type
  const isDAGTransaction = useMemo(() => {
    return decodedData?.chain === StargazerChain.CONSTELLATION && decodedData?.assetId === AssetType.Constellation;
  }, [decodedData?.chain, decodedData?.assetId]);

  const isMetagraphTransaction = useMemo(() => {
    return decodedData?.chain === StargazerChain.CONSTELLATION && decodedData?.assetId !== AssetType.Constellation;
  }, [decodedData?.chain, decodedData?.assetId]);

  const isEVMTransaction = useMemo(() => {
    return decodedData?.chain !== StargazerChain.CONSTELLATION;
  }, [decodedData?.chain]);

  // Common rejection handler
  const handleReject = useCallback(async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    await StargazerWSMessageBroker.sendResponseError(new EIPRpcError('User rejected request', EIPErrorCodes.Rejected), requestMessage);
    window.close();
  }, [requestMessage]);

  // Common success handler
  const handleSuccess = useCallback(
    async (txHash: string) => {
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseResult(txHash, requestMessage);
      window.close();
    },
    [requestMessage]
  );

  // Common error handler
  const handleError = useCallback(
    async (error: unknown) => {
      console.error('Sign transaction error:', error);
      StargazerExternalPopups.addResolvedParam(location.href);
      await StargazerWSMessageBroker.sendResponseError(error instanceof Error ? error : new EIPRpcError('Unknown error', EIPErrorCodes.Unknown), requestMessage);
      window.close();
    },
    [requestMessage]
  );

  return {
    requestMessage,
    asset,
    decodedData,
    isDAGTransaction,
    isMetagraphTransaction,
    isEVMTransaction,
    fee,
    origin,
    setFee,
    handleReject,
    handleSuccess,
    handleError,
  };
};
