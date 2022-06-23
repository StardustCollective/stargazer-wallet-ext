import { ERC20AssetWithAddress } from "./types";

export const filterERC20Assets = (data: ERC20AssetWithAddress[]): ERC20AssetWithAddress[] => {
  const filteredData = data.filter(item => { return !!item?.platforms?.ethereum });
  return filteredData;
}