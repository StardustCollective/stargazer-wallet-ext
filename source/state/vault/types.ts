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

export interface IAssetState {
  id: string;
  type?: AssetType;
  label: string;
  balance?: number;
  address?: string;
  contract?: string;
  transactions: Transaction[];
}

// export interface IActiveAssetState extends IAssetState {
//   transactions: Transaction[];
// }

export interface IWalletState {
  id: string;
  type: KeyringWalletType;
  label: string;
  supportedAssets: KeyringAssetType[]; //eth,dag,erc20
  assets: IAssetState[];
  // accounts: {
  //   address: string,
  //   assets: IAssetState[]
  // }[]
  //activeAssetId: string;
  // type: AccountType;
}

// export interface IActiveWalletState extends IWalletState {
//   assets: IAssetState[];
// }

export interface IAccountUpdateState {
  id: string;
  assets: {
    [address: string]: IAssetState;
  };
}

// export interface IKeyStoreState {
//   [keystoreId: string]: Keystore;
// }

//Wallet
//  Keystore[id] - JSON-phrase, JSON-key
//  accounts[keystore-id]
//    Account - id, label
//      Assets

//separate descriptors and instances
//walletInfoMap[id]: WalletInfo
//activeWallet: WalletState
export default interface IVaultState {
  status: number;
  version: string;
  //activeWalletId: string; //Can be used to rebuild activeWallet
  wallets: KeyringWalletState[];
  activeWallet: IWalletState;
  activeAsset: IAssetState;
  activeNetwork: {
    //Network:ChainId
    [network: string]: string;
  };
}

// export default interface IVaultState {
//   keystores: IKeyStoreState;
//   status: number;
//   version: string;
//   accounts: {
//     [accountId: string]: IWalletState;
//   };
//   activeAccountId: string;
//   activeNetwork: {
//     [assetId: string]: string;
//   };
// }
