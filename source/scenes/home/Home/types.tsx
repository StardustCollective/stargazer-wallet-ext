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
  activeWallet: IWalletState;
  balanceObject: IBalanceObject;
  balance: string;
  onBuyPressed: () => void;
}
