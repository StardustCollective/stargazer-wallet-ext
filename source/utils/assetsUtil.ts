import { StargazerChain } from 'scripts/common';
import { initialState as initialStateAssets } from 'state/assets';
import { IAssetInfoState } from 'state/assets/types';
import { OpenSeaSupportedChains } from 'state/nfts/types';
import { AssetType } from 'state/vault/types';

export const DAG_FULL_ASSET = initialStateAssets[AssetType.Constellation];
export const ETH_FULL_ASSET = initialStateAssets[AssetType.Ethereum];
export const MATIC_FULL_ASSET = initialStateAssets[AssetType.Polygon];
export const AVAX_FULL_ASSET = initialStateAssets[AssetType.Avalanche];
export const BNB_FULL_ASSET = initialStateAssets[AssetType.BSC];

export const ETH_WALLET_ASSET = {
  id: AssetType.Ethereum,
  type: AssetType.Ethereum,
  label: 'Ethereum',
};

export const MATIC_WALLET_ASSET = {
  id: AssetType.Polygon,
  type: AssetType.Ethereum,
  label: 'Polygon',
};

export const BNB_WALLET_ASSET = {
  id: AssetType.BSC,
  type: AssetType.Ethereum,
  label: 'BNB',
};

export const AVAX_WALLET_ASSET = {
  id: AssetType.Avalanche,
  type: AssetType.Ethereum,
  label: 'Avalanche',
};

export const CHAIN_FULL_ASSET = {
  [StargazerChain.CONSTELLATION]: DAG_FULL_ASSET,
  [StargazerChain.ETHEREUM]: ETH_FULL_ASSET,
  [StargazerChain.POLYGON]: MATIC_FULL_ASSET,
  [StargazerChain.AVALANCHE]: AVAX_FULL_ASSET,
  [StargazerChain.BSC]: BNB_FULL_ASSET,
};

export const CHAIN_WALLET_ASSET = {
  [StargazerChain.ETHEREUM]: ETH_WALLET_ASSET,
  [StargazerChain.POLYGON]: MATIC_WALLET_ASSET,
  [StargazerChain.BSC]: BNB_WALLET_ASSET,
  [StargazerChain.AVALANCHE]: AVAX_WALLET_ASSET,
};

export const OPENSEA_ASSET_MAP: { [chain: string]: IAssetInfoState } = {
  [OpenSeaSupportedChains.ETHEREUM]: ETH_FULL_ASSET,
  [OpenSeaSupportedChains.SEPOLIA]: ETH_FULL_ASSET,
  [OpenSeaSupportedChains.POLYGON]: MATIC_FULL_ASSET,
  [OpenSeaSupportedChains.POLYGON_TESTNET]: MATIC_FULL_ASSET,
  [OpenSeaSupportedChains.AVALANCHE]: AVAX_FULL_ASSET,
  [OpenSeaSupportedChains.AVALANCHE_FUJI]: AVAX_FULL_ASSET,
  [OpenSeaSupportedChains.BSC]: BNB_FULL_ASSET,
  [OpenSeaSupportedChains.BSC_TESTNET]: BNB_FULL_ASSET,
};
