import {
  V3Keystore,
  KDFParamsPhrase,
  KDFParamsPrivateKey,
} from '@stardust-collective/dag4-keystore/types/v3-keystore';
import { Transaction as DAGTransaction } from '@stardust-collective/dag4-network';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

export type SeedKeystore = V3Keystore<KDFParamsPhrase>;
export type PrivKeystore = V3Keystore<KDFParamsPrivateKey>;

export type Keystore = SeedKeystore | PrivKeystore;

export enum AssetType {
  Constellation = 'constellation',
  Ethereum = 'ethereum',
  ERC20 = 'erc20',
}

export enum NetworkType {
  Ethereum,
  Constellation,
  //MultiChain,
}

export type Transaction = DAGTransaction | any;

export interface IAssetState {
  id: string;
  type: AssetType;
  label: string;
  balance: number;
  address: string;
  contract?: string;
}

export interface IActiveAssetState extends IAssetState {
  transactions: Transaction[];
}

export interface IWalletState {
  id: string;
  type: KeyringWalletType;
  label: string;
  supportedAssets: string; //eth,dag,erc20
  //activeAssetId: string;
  // type: AccountType;
}

export interface IActiveWalletState extends IWalletState {
  assets: IAssetState[];
}

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

/*
  "wallets": [
    {
      "id": "MCW1",
      "type": "MCW",
      "label": "Wallet #1",
      "accounts": [
        {
          "label": "Constellation #1",
          "address": "DAG6C2vbjLkH3wzxVJaEu1fCwLSobRCTQnARZxyo"
        },

 */

export default interface IVaultState {
  status: number;
  version: string;
  wallets: IWalletState[];
  wallet: IActiveWalletState;
  asset: IActiveAssetState;
  activeNetwork: { //Network:ChainId
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
