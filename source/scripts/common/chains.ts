import { AssetType } from "state/vault/types";

enum StargazerProvider {
  CONSTELLATION = 'constellation',
  ETHEREUM = 'ethereum',
}

enum StargazerChain {
  CONSTELLATION = 'constellation',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  BSC = 'bsc',
  AVALANCHE = 'avalanche',
}

const ASSET_ID: { [chain: string]: string } = {
  [StargazerChain.CONSTELLATION]: AssetType.Constellation,
  [StargazerChain.ETHEREUM]: AssetType.Ethereum,
  [StargazerChain.POLYGON]: AssetType.Polygon,
  [StargazerChain.BSC]: AssetType.BSC,
  [StargazerChain.AVALANCHE]: AssetType.Avalanche,
}

export { StargazerChain, StargazerProvider, ASSET_ID };
