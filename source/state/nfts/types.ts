import { EthChainId } from 'scripts/Background/controllers/EVMChainController/types';
import { AssetType } from 'state/vault/types';

export interface INFTInfoState {
  id: string;
  label: string;
  type: AssetType;
  address: string;
  quantity: number;
  link: string;
  network?: EthChainId;
  logo?: string;
}

export enum OpenSeaSupportedChains {
  // Mainnets
  ETHEREUM = 'ethereum',
  POLYGON = 'matic',
  AVALANCHE = 'avalanche',
  BSC = 'bsc',
  // Testnets
  SEPOLIA = 'sepolia',
  AVALANCHE_FUJI = 'avalanche_fuji',
  BSC_TESTNET = 'bsctestnet',
  POLYGON_TESTNET = 'amoy',
}

export interface IOpenSeaCollection {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  owner: string;
  safelist_status: string;
  category: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  trait_offers_enabled: boolean;
  opensea_url: string;
  project_url: string;
  wiki_url: string;
  discord_url: string;
  telegram_url: string;
  twitter_username: string;
  instagram_username: string;
  contracts: IOpenSeaContract[];
  editors: string[];
  fees: IOpenSeaFees;
}

export interface IOpenSeaCollectionWithChain extends IOpenSeaCollection {
  chain: OpenSeaSupportedChains;
  nfts: IOpenSeaNFT[];
}

export interface ICollectionData {
  [id: string]: IOpenSeaCollectionWithChain;
}

export interface IUpdateCollectionData {
  id: string;
  data: IOpenSeaCollectionWithChain;
}

export interface INFTListState {
  collections: {
    loading: boolean;
    error: any;
    data: ICollectionData | null;
  };
  selectedNFT: {
    loading: boolean;
    error: any;
    data: IOpenSeaDetailedNFT | null;
  };
  transferNFT: {
    loading: boolean;
    error: any;
    data: string | null;
  };
  tempNFTInfo: ITempNFTInfo;
  selectedCollection: ISelectedCollection;
}

interface ISelectedCollection {
  data: IOpenSeaCollectionWithChain | null;
  loading: boolean;
}

export interface ITempNFTInfo {
  nft: IOpenSeaDetailedNFT;
  quantity: number;
  from: {
    address: string;
    label: string;
  };
  to: string;
  gas: {
    fiatAmount: string;
    limit: number;
    fee: number;
    symbol: string;
    price: number;
  };
}

interface IOpenSeaFees {
  fee: number;
  recipient: string;
  required: boolean;
}

interface IOpenSeaContract {
  address: string;
  chain: OpenSeaSupportedChains;
}

interface IOpenSeaOwner {
  address: string;
  quantity: number;
}

interface IOpenSeaRarity {
  strategy_id: any;
  strategy_version: any;
  rank: number;
  score: any;
  calculated_at: any;
  max_rank: number;
  tokens_scored: any;
  ranking_features: any;
}

interface IOpenSeaTraits {
  trait_type: string;
  display_type: any;
  max_value: any;
  trait_count: number;
  order: any;
  value: string;
}

export interface IOpenSeaNFT {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string | null;
  description: string | null;
  image_url: string | null;
  metadata_url: string | null;
  created_at: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  quantity?: number;
}

export interface IOpenSeaDetailedNFT extends IOpenSeaNFT {
  is_suspicious: boolean;
  owners: IOpenSeaOwner[] | null;
  creator: string;
  traits: IOpenSeaTraits[] | null;
  rarity: IOpenSeaRarity | null;
}
