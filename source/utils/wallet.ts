import { AssetType, IWalletState } from 'state/vault/types';

export const walletHasDag = (activeWallet: IWalletState): boolean => {
  return !!getDagAddress(activeWallet);
};

export const walletHasEth = (activeWallet: IWalletState): boolean => {
  return !!getEthAddress(activeWallet);
};

export const getEthAddress = (activeWallet: IWalletState): string | null => {
  const ethAsset =
    activeWallet?.assets?.find((asset) => asset?.id === AssetType.Ethereum) ?? null;

  if (!ethAsset) {
    return null;
  }

  return ethAsset.address;
};

export const getDagAddress = (activeWallet: IWalletState): string | null => {
  const dagAsset =
    activeWallet?.assets?.find((asset) => asset?.id === AssetType.Constellation) ?? null;

  if (!dagAsset) {
    return null;
  }

  return dagAsset.address;
};
