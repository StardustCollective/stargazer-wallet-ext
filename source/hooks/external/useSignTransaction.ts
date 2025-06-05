import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import type { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';

import { StargazerChain } from 'scripts/common';
import type { SignTransactionDataDAG } from 'scripts/Provider/constellation';
import type { SignTransactionDataEVM } from 'scripts/Provider/evm';

import assetsSelectors from 'selectors/assetsSelectors';

import type { IAssetInfoState } from 'state/assets/types';
import { AssetType } from 'state/vault/types';

import { toDag } from 'utils/number';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export type SignTransactionData = SignTransactionDataDAG & SignTransactionDataEVM;

export interface UseSignTransactionReturn extends UseExternalRequestReturn<SignTransactionData>, BaseExternalRequestHook<SignTransactionData> {
  asset: IAssetInfoState | null;
  isDAGTransaction: boolean;
  isMetagraphTransaction: boolean;
  isEVMTransaction: boolean;
  fee: string;
  setFee: (fee: string) => void;
}

/**
 * Custom hook that extends useExternalRequest for sign transaction operations
 */
export const useSignTransaction = (): UseSignTransactionReturn => {
  const baseHook = useExternalRequest<SignTransactionData>('Sign transaction');
  const asset = useSelector(assetsSelectors.getAssetById(baseHook?.decodedData?.assetId));

  const feeInDatum = baseHook.decodedData?.fee ?? 0;

  // Initialize fee state with default value from decoded data
  const [fee, setFee] = useState<string>(() => {
    return toDag(feeInDatum).toString();
  });

  // Determine transaction type
  const isDAGTransaction = useMemo(() => {
    return baseHook.decodedData?.chain === StargazerChain.CONSTELLATION && baseHook.decodedData?.assetId === AssetType.Constellation;
  }, [baseHook.decodedData?.chain, baseHook.decodedData?.assetId]);

  const isMetagraphTransaction = useMemo(() => {
    return baseHook.decodedData?.chain === StargazerChain.CONSTELLATION && baseHook.decodedData?.assetId !== AssetType.Constellation;
  }, [baseHook.decodedData?.chain, baseHook.decodedData?.assetId]);

  const isEVMTransaction = useMemo(() => {
    return baseHook.decodedData?.chain !== StargazerChain.CONSTELLATION;
  }, [baseHook.decodedData?.chain]);

  return {
    ...baseHook,
    asset,
    isDAGTransaction,
    isMetagraphTransaction,
    isEVMTransaction,
    fee,
    setFee,
  };
};
