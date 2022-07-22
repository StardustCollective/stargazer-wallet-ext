import { ERC20Asset, ERC20AssetWithAddress, SearchAsset } from "./types";
import { IAssetInfoState } from '../assets/types';
import { AssetType } from "state/vault/types";
import { EthNetworkId } from "scripts/Background/controllers/EVMNetworkController/types";
import { constellationInitialValues } from "./index";

const INITIAL_ARRAY_LENGTH = 203;
const ETH_ID = 'ethereum';

export const mapToAssetsArray = (tokensArray: ERC20Asset[], tokensAddressArray: ERC20AssetWithAddress[]): IAssetInfoState[] => {
  const CONSTELLATION_ASSETS = constellationInitialValues.map(asset => asset.priceId);
  const tokensArrayReduced = tokensArray.slice(0, INITIAL_ARRAY_LENGTH).filter(token => token.id !== ETH_ID);
  return tokensArrayReduced
            .map((token: ERC20Asset) => ({...token, ...tokensAddressArray.find((tokenAddress: ERC20AssetWithAddress) => token.id === tokenAddress.id && !CONSTELLATION_ASSETS.includes(token.id) && tokenAddress?.platforms?.ethereum?.length)}))
            .map(item => ({
              id: item?.platforms?.ethereum as string,
              address: item?.platforms?.ethereum as string,
              label: item.name,
              symbol: item.symbol.toUpperCase(),
              type: AssetType.ERC20,
              priceId: item.id,
              network: 'mainnet' as EthNetworkId,
              logo: item.image,
              decimals: 18,
            }))
            .filter(token => token?.address);
}

export const mapSearchAssetsToArray = (tokens: SearchAsset[], tokensAddressArray: ERC20AssetWithAddress[]): IAssetInfoState[] => {
  const CONSTELLATION_ASSETS = constellationInitialValues.map(asset => asset.priceId);
  return tokens
          .map((token: SearchAsset) => ({...token, ...tokensAddressArray.find((tokenAddress: ERC20AssetWithAddress) => token.id === tokenAddress.id && !CONSTELLATION_ASSETS.includes(token.id) && tokenAddress?.platforms?.ethereum?.length)}))
          .map(item => ({
            id: item?.platforms?.ethereum as string,
            address: item?.platforms?.ethereum as string,
            label: item.name,
            symbol: item.symbol.toUpperCase(),
            type: AssetType.ERC20,
            priceId: item.id,
            network: 'mainnet' as EthNetworkId,
            logo: item.large,
            decimals: 18,
          }))
          .filter(token => token?.address);
}