import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { IBalanceObject } from 'hooks/usePrice';
import { IWalletState } from 'state/vault/types';

export interface Asset {
  name: string;
  shortName: string;
  price: number;
  logo: string;
  priceChange: number;
  balance: number;
}

export interface IHome {
  navigation: any;
  route: any;
  activeWallet: IWalletState;
  balanceObject: IBalanceObject;
  isDagOnlyWallet: boolean;
  multiChainWallets: KeyringWalletState[];
  privateKeyWallets: KeyringWalletState[];
  hardwareWallets: KeyringWalletState[];
  onBuyPressed: () => void;
  onSwapPressed: () => void;
}
