import {
  V3Keystore,
  KDFParamsPhrase,
  KDFParamsPrivateKey,
} from '@stardust-collective/dag4-keystore';
import {
  Transaction as DAGTransaction,
  TransactionV2 as DAGTransactionV2,
} from '@stardust-collective/dag4-network';
import {
  KeyringAssetType,
  KeyringNetwork,
  KeyringWalletState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import {
  AvalancheChainId,
  BSCChainId,
  EthChainId,
  PolygonChainId,
} from 'scripts/Background/controllers/EVMChainController/types';
import { IAssetInfoState } from 'state/assets/types';

export type SeedKeystore = V3Keystore<KDFParamsPhrase>;
export type PrivKeystore = V3Keystore<KDFParamsPrivateKey>;

export type Keystore = SeedKeystore | PrivKeystore;

export enum Network {
  Polygon = 'Polygon',
  Avalanche = 'Avalanche',
  BSC = 'BSC',
}

export enum AssetSymbol {
  // 349: New network should be added here.
  DAG = 'DAG',
  ETH = 'ETH',
  MATIC = 'MATIC',
  AVAX = 'AVAX',
  BNB = 'BNB',
}

export enum AssetType {
  Constellation = 'constellation',
  Avalanche = 'avalanche',
  BSC = 'bsc',
  Polygon = 'polygon',
  Ledger = 'ledger',
  LedgerConstellation = 'ledger-constellation',
  Ethereum = 'ethereum',
  ERC20 = 'erc20',
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
}

export type Transaction = DAGTransaction | DAGTransactionV2 | any;
export type Reward = {
  address: string;
  amount: number;
  accruedAt: string;
  ordinal: number;
  metagraphId: string;
  rewardsCount?: number;
};

export type ActiveNetwork = {
  // 349: New network should be added here.
  [KeyringNetwork.Constellation]: string;
  [KeyringNetwork.Ethereum]: EthChainId;
  [Network.Avalanche]: AvalancheChainId;
  [Network.BSC]: BSCChainId;
  [Network.Polygon]: PolygonChainId;
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
  rewards: Reward[];
  loading?: boolean;
}

export type AssetBalances = {
  // 349: New network should be added here.
  [AssetType.Ethereum]?: string;
  [AssetType.Constellation]?: string;
  avalanche?: string;
  bsc?: string;
  polygon?: string;
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

export interface IVaultWalletsStoreState {
  local: KeyringWalletState[];
  ledger: KeyringWalletState[];
  bitfi: KeyringWalletState[];
}

export interface IWalletState {
  id: string;
  bipIndex?: number;
  type: KeyringWalletType;
  label: string;
  supportedAssets: KeyringAssetType[]; // eth,dag,erc20,erc721
  assets: IAssetState[];
}
export interface ICustomNetworkObject {
  id: string;
  value: string;
  label: string;
  explorer: string;
  chainId: number;
  rpcEndpoint: string;
  explorerAPI: string;
  nativeToken: string;
  mainnet: string;
  network: string;
  hexChainId?: string;
}
export interface ICustomNetworkState {
  [networkId: string]: ICustomNetworkObject;
}

export interface ICustomNetworks {
  constellation: ICustomNetworkState;
  ethereum: ICustomNetworkState;
}

export default interface IVaultState {
  hasEncryptedVault: boolean;
  balances: AssetBalances;
  status: number;
  version: string;
  wallets: IVaultWalletsStoreState;
  activeWallet: IWalletState;
  activeAsset: IActiveAssetState;
  activeNetwork: ActiveNetwork;
  migrateWallet?: any;
  customNetworks: ICustomNetworks;
  customAssets: IAssetInfoState[];
  currentEVMNetwork: string;
  publicKey: string;
}
