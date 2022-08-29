import { ERC20Asset, ERC20AssetWithAddress, SearchAsset } from "./types";
import { IAssetInfoState } from '../assets/types';
import { AssetSymbol, AssetType } from "state/vault/types";
import { EthChainId } from "scripts/Background/controllers/EVMChainController/types";
import { constellationInitialValues } from "./index";
import { getMainnetFromPlatform } from "scripts/Background/controllers/EVMChainController/utils";

const INITIAL_ARRAY_LENGTH = 203;
const ETH_ID = 'ethereum';

export const mapToAssetsArray = (tokensArray: ERC20Asset[], tokensAddressArray: ERC20AssetWithAddress[]): IAssetInfoState[] => {
  const CONSTELLATION_ASSETS = constellationInitialValues.map(asset => asset.priceId).filter(priceId => !['matic-network'].includes(priceId));
  const tokensArrayReduced = tokensArray.slice(0, INITIAL_ARRAY_LENGTH).filter(token => token.id !== ETH_ID);
  return tokensArrayReduced
            .map((token: ERC20Asset) => ({...token, ...tokensAddressArray.find((tokenAddress: ERC20AssetWithAddress) => token.id === tokenAddress.id && !CONSTELLATION_ASSETS.includes(token.id) && tokenAddress?.platforms?.ethereum?.length)}))
            .map(item => ({
              id: `${item?.platforms?.ethereum}-mainnet` ,
              address: item?.platforms?.ethereum as string,
              label: item.name,
              symbol: item.symbol.toUpperCase(),
              type: AssetType.ERC20,
              priceId: item.id,
              network: 'mainnet' as EthChainId,
              logo: item.image,
              decimals: 18,
            }))
            .filter(token => token?.address);
}

export const mapSearchAssetsToArray = (tokens: SearchAsset[], tokensAddressArray: ERC20AssetWithAddress[] = []): IAssetInfoState[] => {
  const CONSTELLATION_ASSETS = constellationInitialValues.map(asset => asset.priceId).filter(priceId => !['matic-network'].includes(priceId));
  // TODO-349: Only Polygon ['ethereum', 'binance-smart-chain', 'avalanche', 'polygon-pos']
  const SUPPORTED_NETWORKS = ['ethereum', 'polygon-pos'];
  const tokensWithAddress = tokens.map((token: SearchAsset) => (
    {
      ...token, 
      ...tokensAddressArray?.find(function(tokenAddress: ERC20AssetWithAddress) { 
        const networks = !!tokenAddress?.platforms ? Object.keys(tokenAddress.platforms) : [];
        return token.id === tokenAddress.id && !CONSTELLATION_ASSETS.includes(token.id) && SUPPORTED_NETWORKS.some(net => networks.includes(net));
      })
    }));
  let tokensArray = [];
  for (const tokenItem of tokensWithAddress) {
    const platforms = !!tokenItem?.platforms ? Object.keys(tokenItem.platforms) : [];
    if (platforms.length) {
      for (const platform of SUPPORTED_NETWORKS) {
        if (platforms.includes(platform)) {
          // Create a new token for each platform.
          const address = tokenItem.platforms[platform] as string;
          const network = getMainnetFromPlatform(platform);
          const newItem = {
              id: `${address}-${network}`,
              address,
              label: tokenItem.name,
              symbol: tokenItem.symbol.toUpperCase(),
              type: AssetType.ERC20,
              priceId: tokenItem.id,
              network,
              logo: tokenItem.large,
              decimals: 18,
          }
          // TODO-349: Only Polygon. Do not include MATIC - Polygon in the array. It's already hardcoded.
          if (newItem.symbol === AssetSymbol.MATIC && newItem.network === 'matic') {
            continue;
          }
          tokensArray.push(newItem);
        }
      }
    }
  }

  return tokensArray;
}