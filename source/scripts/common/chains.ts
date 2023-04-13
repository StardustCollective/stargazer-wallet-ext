import { AssetType } from "state/vault/types";

enum StargazerChain {
  CONSTELLATION = 'constellation',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  BSC = 'bsc',
}

const ASSET_ID: { [chain: string]: string } = {
  [StargazerChain.CONSTELLATION]: AssetType.Constellation,
  [StargazerChain.ETHEREUM]: AssetType.Ethereum,
  [StargazerChain.POLYGON]: AssetType.Polygon,
  [StargazerChain.BSC]: AssetType.BSC,
}

export { StargazerChain, ASSET_ID };
