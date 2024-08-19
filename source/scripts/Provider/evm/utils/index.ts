import { isHexString, toUtf8 } from 'ethereumjs-util';
import { ALL_EVM_CHAINS } from 'constants/index';
import { EIPErrorCodes, EIPRpcError, StargazerChain } from 'scripts/common';
import store from 'state/store';
import IVaultState from 'state/vault/types';
import { getWalletController } from 'utils/controllersUtils';
import { getChainId as getChainIdFn } from 'scripts/Background/controllers/EVMChainController/utils';
import { encodeToBase64 } from 'utils/encoding';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { StargazerSignatureRequest } from '../../constellation/utils';

const LEDGER_URL = '/ledger.html';
export const EXTERNAL_URL = '/external.html';
export const WINDOW_TYPES: Record<string, chrome.windows.createTypeEnum> = {
  popup: 'popup',
  normal: 'normal',
};
export const WINDOW_SIZE = {
  small: { width: 386, height: 624 },
  large: { width: 1000, height: 1000 },
};

export const getWalletInfo = () => {
  const { vault } = store.getState();

  const allWallets = [
    ...vault.wallets.local,
    ...vault.wallets.ledger,
    ...vault.wallets.bitfi,
  ];
  const activeWallet = vault?.activeWallet
    ? allWallets.find((wallet: any) => wallet.id === vault.activeWallet.id)
    : null;
  const isLedger = activeWallet?.type === KeyringWalletType.LedgerAccountWallet;

  const windowUrl = isLedger ? LEDGER_URL : EXTERNAL_URL;
  const windowType = isLedger ? WINDOW_TYPES.normal : WINDOW_TYPES.popup;
  const windowSize = isLedger ? WINDOW_SIZE.large : WINDOW_SIZE.small;

  return { activeWallet, windowUrl, windowType, windowSize };
};

export const getNetworkInfo = () => {
  const { currentEVMNetwork }: IVaultState = store.getState().vault;
  const networkInfo = Object.values(ALL_EVM_CHAINS).find(
    (chain) => chain.id === currentEVMNetwork
  );

  if (!networkInfo)
    throw new EIPRpcError('Network not found', EIPErrorCodes.ChainDisconnected);

  return networkInfo;
};

export const getNetworkLabel = () => {
  const network = getNetworkInfo();
  return network.network;
};

export const getNetworkId = () => {
  const network = getNetworkInfo();
  return network.networkId;
};

export const getNetworkToken = () => {
  const network = getNetworkInfo();
  return network.nativeToken;
};

export const getNetwork = () => {
  const { activeNetwork }: IVaultState = store.getState().vault;
  const networkLabel = getNetworkLabel();

  return activeNetwork[networkLabel as keyof typeof activeNetwork];
};

export const getChainId = () => {
  const networkName = getNetwork();

  return getChainIdFn(networkName);
};

export const getWallet = () => {
  const walletController = getWalletController();
  const networkId = getNetworkId();

  if (networkId === StargazerChain.ETHEREUM) {
    return walletController.account.networkController.ethereumNetwork.getWallet();
  }
  if (networkId === StargazerChain.POLYGON) {
    return walletController.account.networkController.polygonNetwork.getWallet();
  }
  if (networkId === StargazerChain.BSC) {
    return walletController.account.networkController.bscNetwork.getWallet();
  }
  if (networkId === StargazerChain.AVALANCHE) {
    return walletController.account.networkController.avalancheNetwork.getWallet();
  }

  throw new EIPRpcError('Wallet not found', EIPErrorCodes.Unauthorized);
};

export const normalizeSignatureRequest = (message: string): string => {
  // Test for hex message data
  if (isHexString(message)) {
    try {
      message = toUtf8(message);
    } catch (e) {
      // NOOP
    }
  }

  const signatureRequest: StargazerSignatureRequest = {
    content: message,
    metadata: {},
  };

  const stringSignature = JSON.stringify(signatureRequest);
  const newEncodedSignatureRequest = encodeToBase64(stringSignature);

  return newEncodedSignatureRequest;
};

export const remove0x = (hash: string) => {
  return hash.startsWith('0x') ? hash.slice(2) : hash;
};

export const preserve0x = (hash: string) => {
  return hash.startsWith('0x') ? hash : `0x${hash}`;
};
