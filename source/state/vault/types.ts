import {
  V3Keystore,
  KDFParamsPhrase,
  KDFParamsPrivateKey,
} from '@stardust-collective/dag4-keystore/types/v3-keystore';
import { Transaction as DAGTransaction } from '@stardust-collective/dag4-network';
import {
  KeyringAssetType,
  KeyringWalletState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';

export type SeedKeystore = V3Keystore<KDFParamsPhrase>;
export type PrivKeystore = V3Keystore<KDFParamsPrivateKey>;

export type Keystore = SeedKeystore | PrivKeystore;

export enum AssetType {
  Constellation = 'constellation',
  Ethereum = 'ethereum',
  ERC20 = 'erc20',
}

export type Transaction = DAGTransaction | any;

export interface IAssetState   {
  id: string;
  type: AssetType;
  label: string;
  address: string;
  // balance?: number;
}

export interface IActiveAssetState extends IAssetState {
  transactions: Transaction[];
}

export type AssetBalances = {
  [AssetType.Ethereum]?: number;
  [AssetType.Constellation]?: number;
  [tokenAddress: string]: number;
}

export interface IWalletState {
  id: string;
  type: KeyringWalletType;
  label: string;
  supportedAssets: KeyringAssetType[]; //eth,dag,erc20
  assets: IAssetState[];
}

export interface IAccountUpdateState {
  id: string;
  assets: {
    [address: string]: IActiveAssetState;
  };
}

export default interface IVaultState {
  balances: AssetBalances;
  status: number;
  version: string;
  wallets: KeyringWalletState[];
  activeWallet: IWalletState;
  activeAsset: IActiveAssetState;
  activeNetwork: {
    [network: string]: string;
  };
}
