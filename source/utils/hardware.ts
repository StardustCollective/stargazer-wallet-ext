import { KeyringWalletState, KeyringWalletType } from '@stardust-collective/dag4-keyring';

export const LEDGER_PAGE = '/ledger.html';
export const BITFI_PAGE = '/bitfi.html';
export const CYPHEROCK_PAGE = '/cypherock.html';

export const LEDGER_WALLET_PREFIX = 'L';
export const BITFI_WALLET_PREFIX = 'B';
export const CYPHEROCK_WALLET_PREFIX = 'C';
export const LEDGER_WALLET_LABEL = 'Ledger';
export const BITFI_WALLET_LABEL = 'Bitfi';
export const CYPHEROCK_WALLET_LABEL = 'Cypherock';

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
  return (
    type === KeyringWalletType.LedgerAccountWallet ||
    type === KeyringWalletType.BitfiAccountWallet ||
    type === KeyringWalletType.CypherockAccountWallet
  );
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
