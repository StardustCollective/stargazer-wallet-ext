import { ERC20Asset, ERC20AssetWithAddress } from "./types";
import { IAssetInfoState } from '../assets/types';
import { AssetType } from "state/vault/types";
import { EthNetworkId } from "scripts/Background/controllers/EthChainController/types";
import { constellationInitialValues } from ".";

export const mapToAssetsArray = (tokensArray: ERC20Asset[], tokensAddressArray: ERC20AssetWithAddress[]): IAssetInfoState[] => {
  const tokensFiltered = tokensAddressArray.filter(item => { return !!item?.platforms?.ethereum?.length });
  const constellationAssets = constellationInitialValues.map(asset => asset.priceId);
  console.log(constellationAssets);
  const response: IAssetInfoState[] = tokensArray
                    .map((token: ERC20Asset) => ({...token, ...tokensFiltered.find((tokenAddress: ERC20AssetWithAddress) => token.id === tokenAddress.id)}))
                    .map(item => (item?.platforms?.ethereum && {
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
                    .filter(item => item !== undefined && !constellationAssets.includes(item.priceId));
  return response;
}