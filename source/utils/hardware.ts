import { KeyringWalletState, KeyringWalletType } from '@stardust-collective/dag4-keyring';

import { AvailableMethods, EIPErrorCodes, EIPRpcError } from 'scripts/common';

import { AVALANCHE_NETWORK, BSC_NETWORK, DAG_NETWORK, ETH_NETWORK, POLYGON_NETWORK } from '../constants';

export const LEDGER_PAGE = '/ledger.html';
export const BITFI_PAGE = '/bitfi.html';
export const CYPHEROCK_PAGE = '/cypherock.html';

export const HARDWARE_WALLETS_PAGES = [LEDGER_PAGE, BITFI_PAGE, CYPHEROCK_PAGE];

export const LEDGER_WALLET_PREFIX = 'L';
export const BITFI_WALLET_PREFIX = 'B';
export const CYPHEROCK_WALLET_PREFIX = 'C';
export const LEDGER_WALLET_LABEL = 'Ledger';
export const BITFI_WALLET_LABEL = 'Bitfi';
export const CYPHEROCK_WALLET_LABEL = 'Cypherock';

export type HardwareWalletType = KeyringWalletType.BitfiAccountWallet | KeyringWalletType.CypherockAccountWallet;

export const SupportedMethods: Record<HardwareWalletType, AvailableMethods[]> = {
  [KeyringWalletType.BitfiAccountWallet]: [AvailableMethods.dag_sendTransaction, AvailableMethods.dag_signMessage],
  [KeyringWalletType.CypherockAccountWallet]: [
    AvailableMethods.dag_signData,
    AvailableMethods.dag_signMessage,
    AvailableMethods.dag_sendTransaction,
    AvailableMethods.dag_sendMetagraphTransaction,
    AvailableMethods.dag_tokenLock,
    AvailableMethods.dag_delegatedStake,
    AvailableMethods.dag_withdrawDelegatedStake,
    AvailableMethods.dag_allowSpend,
    AvailableMethods.dag_sendMetagraphDataTransaction,
    AvailableMethods.dag_signMetagraphDataTransaction,
    AvailableMethods.personal_sign,
    AvailableMethods.eth_signTypedData,
    AvailableMethods.eth_sendTransaction,
  ],
};

export const SupportedDagChains: Record<HardwareWalletType, number[]> = {
  [KeyringWalletType.BitfiAccountWallet]: [DAG_NETWORK.main2.chainId, DAG_NETWORK.test2.chainId, DAG_NETWORK.integration2.chainId],
  [KeyringWalletType.CypherockAccountWallet]: [DAG_NETWORK.main2.chainId, DAG_NETWORK.test2.chainId, DAG_NETWORK.integration2.chainId],
};

export const SupportedEvmChains: Record<HardwareWalletType, number[]> = {
  [KeyringWalletType.BitfiAccountWallet]: [],
  [KeyringWalletType.CypherockAccountWallet]: [ETH_NETWORK.mainnet.chainId, AVALANCHE_NETWORK[`avalanche-mainnet`].chainId, BSC_NETWORK.bsc.chainId, POLYGON_NETWORK.matic.chainId],
};

export const validateHardwareMethod = ({ walletType, method, dagChainId, evmChainId }: { walletType: KeyringWalletType; method: AvailableMethods; dagChainId?: number; evmChainId?: number }) => {
  if (!isHardware(walletType)) return;

  const hardwareWalletType = walletType as HardwareWalletType;

  if (!SupportedMethods[hardwareWalletType].includes(method)) {
    throw new EIPRpcError('Method not supported by the hardware wallet', EIPErrorCodes.Unsupported);
  }

  if (dagChainId) {
    if (!SupportedDagChains[hardwareWalletType].includes(dagChainId)) {
      throw new EIPRpcError('Chain not supported by the hardware wallet', EIPErrorCodes.Unsupported);
    }
  }

  if (evmChainId) {
    if (!SupportedEvmChains[hardwareWalletType].includes(evmChainId)) {
      throw new EIPRpcError('Chain not supported by the hardware wallet', EIPErrorCodes.Unsupported);
    }
  }
};

export type HardwareWallet = Omit<KeyringWalletState, 'id' | 'label'> & {
  label?: string;
  cypherockId?: string;
  bipIndex?: number;
};

export const getHardwareWalletPage = (type: KeyringWalletType): string => {
  switch (type) {
    case KeyringWalletType.LedgerAccountWallet:
      return LEDGER_PAGE;
    case KeyringWalletType.BitfiAccountWallet:
      return BITFI_PAGE;
    case KeyringWalletType.CypherockAccountWallet:
      return CYPHEROCK_PAGE;
    default:
      throw new Error(`Unknown hardware wallet type: ${type}`);
  }
};

export const isHardware = (type: KeyringWalletType): boolean => {
  return type === KeyringWalletType.LedgerAccountWallet || type === KeyringWalletType.BitfiAccountWallet || type === KeyringWalletType.CypherockAccountWallet;
};

export const isLedger = (type: KeyringWalletType): boolean => {
  return type === KeyringWalletType.LedgerAccountWallet;
};

export const isBitfi = (type: KeyringWalletType): boolean => {
  return type === KeyringWalletType.BitfiAccountWallet;
};

export const isCypherock = (type: KeyringWalletType): boolean => {
  return type === KeyringWalletType.CypherockAccountWallet;
};
