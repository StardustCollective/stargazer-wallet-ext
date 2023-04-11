import { AssetType } from "state/vault/types";

enum StargazerChain {
  CONSTELLATION = 'constellation',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
}

const ASSET_ID: { [chain: string]: string } = {
  [StargazerChain.CONSTELLATION]: AssetType.Constellation,
  [StargazerChain.ETHEREUM]: AssetType.Ethereum,
  [StargazerChain.POLYGON]: AssetType.Polygon,
}

export { StargazerChain, ASSET_ID };
