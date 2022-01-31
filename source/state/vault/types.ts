import { V3Keystore, KDFParamsPhrase, KDFParamsPrivateKey } from '@stardust-collective/dag4-keystore';
import { Transaction as DAGTransaction } from '@stardust-collective/dag4-network';
import {
  KeyringAssetType,
  KeyringNetwork,
  KeyringWalletState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';

export type SeedKeystore = V3Keystore<KDFParamsPhrase>;
export type PrivKeystore = V3Keystore<KDFParamsPrivateKey>;

export type Keystore = SeedKeystore | PrivKeystore;

export enum AssetType {
  Constellation = 'constellation',
  Ledger = 'ledger',
  Ethereum = 'ethereum',
  ERC20 = 'erc20',
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
}

export type Transaction = DAGTransaction | any;

export type ActiveNetwork = {
  [KeyringNetwork.Constellation]: string;
  [KeyringNetwork.Ethereum]: string;
};

export interface IAssetState {
  id: string;
  type: AssetType;
  label: string;
  address: string;
  contractAddress?: string;
}

export interface IActiveAssetState extends IAssetState {
  transactions: Transaction[];
}

export type AssetBalances = {
  [AssetType.Ethereum]?: string;
  [AssetType.Constellation]?: string;
  [contractAddress: string]: string;
};

export interface IAccountUpdateState {
  id: string;
  assets: {
    [address: string]: IActiveAssetState;
  };
}

export interface IAccountDerived {
  label: string;
  address: string;
  network: string;
  tokens?: string[];
}

export interface IWalletState {
  id: string;
  type: KeyringWalletType;
  label: string;
  supportedAssets: KeyringAssetType[]; // eth,dag,erc20,erc721
  assets: IAssetState[];
}

export default interface IVaultState {
  hasEncryptedVault: boolean;
  balances: AssetBalances;
  status: number;
  version: string;
  wallets: KeyringWalletState[];
  activeWallet: IWalletState;
  activeAsset: IActiveAssetState;
  activeNetwork: ActiveNetwork;
  migrateWallet?: any;
}
