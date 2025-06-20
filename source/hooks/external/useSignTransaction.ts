import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import type { BaseExternalRequestHook } from 'scenes/external/ExternalRequestContainer';
import { type SignTransactionDataDAG, type SignTransactionDataEVM, TransactionType } from 'scenes/external/SignTransaction/types';

import assetsSelectors from 'selectors/assetsSelectors';

import type { IAssetInfoState } from 'state/assets/types';

import { CHAIN_FULL_ASSET } from 'utils/assetsUtil';
import { toDag } from 'utils/number';

import { useExternalRequest, UseExternalRequestReturn } from './useExternalRequest';

export type SignTransactionData = SignTransactionDataDAG & SignTransactionDataEVM;

export interface UseSignTransactionReturn extends UseExternalRequestReturn<SignTransactionData>, BaseExternalRequestHook<SignTransactionData> {
  nativeAsset: IAssetInfoState | null;
  metagraphAsset: IAssetInfoState | null;
  isDAG: boolean;
  isMetagraph: boolean;
  isEvmNative: boolean;
  isErc20Transfer: boolean;
  isErc20Approve: boolean;
  isContractInteraction: boolean;
  fee: string;
  gasConfig: { gasPrice: string; gasLimit: string };
  setFee: (fee: string) => void;
  setGasConfig: (gasConfig: { gasPrice: string; gasLimit: string }) => void;
}

/**
 * Custom hook that extends useExternalRequest for sign transaction operations
 */
export const useSignTransaction = (): UseSignTransactionReturn => {
  const baseHook = useExternalRequest<SignTransactionData>('Sign transaction');
  const { chain, type, metagraphAddress } = baseHook.decodedData.extras;
  const metagraphAsset: IAssetInfoState | null = useSelector(assetsSelectors.getMetagraphAsset(metagraphAddress ?? null));

  const feeInDatum = baseHook.decodedData?.fee ?? 0;

  // Initialize fee state with default value from decoded data
  const [fee, setFee] = useState<string>(() => {
    return toDag(feeInDatum).toString();
  });
  const [gasConfig, setGasConfig] = useState<{ gasPrice: string; gasLimit: string }>({ gasPrice: '', gasLimit: '' });

  // Determine transaction type
  const isDAG = useMemo(() => {
    return type === TransactionType.DagNative;
  }, [type]);

  const isMetagraph = useMemo(() => {
    return type === TransactionType.DagMetagraph;
  }, [type]);

  const isEvmNative = useMemo(() => {
    return type === TransactionType.EvmNative;
  }, [type]);

  const isErc20Transfer = useMemo(() => {
    return type === TransactionType.Erc20Transfer;
  }, [type]);

  const isErc20Approve = useMemo(() => {
    return type === TransactionType.Erc20Approve;
  }, [type]);

  const isContractInteraction = useMemo(() => {
    return type === TransactionType.EvmContractInteraction;
  }, [type]);

  const nativeAsset = useMemo(() => {
    return CHAIN_FULL_ASSET[chain] ?? null;
  }, [chain]);

  return {
    ...baseHook,
    nativeAsset,
    metagraphAsset,
    isDAG,
    isMetagraph,
    isEvmNative,
    isErc20Transfer,
    isErc20Approve,
    isContractInteraction,
    fee,
    gasConfig,
    setFee,
    setGasConfig,
  };
};
