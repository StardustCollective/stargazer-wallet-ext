import { KeyringWalletState, KeyringWalletType } from '@stardust-collective/dag4-keyring';

import { AvailableMethods, EIPErrorCodes, EIPRpcError } from 'scripts/common';

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
    AvailableMethods.personal_sign,
  ],
};

export const validateHardwareMethod = (walletType: KeyringWalletType, method: AvailableMethods) => {
  if (!isHardware(walletType)) return;

  const hardwareWalletType = walletType as HardwareWalletType;

  if (!SupportedMethods[hardwareWalletType].includes(method)) {
    throw new EIPRpcError('Method not supported by the hardware wallet', EIPErrorCodes.Unsupported);
  }
};

export type HardwareWallet = Omit<KeyringWalletState, 'id' | 'label'> & {
  label?: string;
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
