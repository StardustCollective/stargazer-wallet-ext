///////////////////////
// Imports
///////////////////////

import { IAssetState, AssetBalances } from 'state/vault/types';
import { IAssetInfoState } from 'state/assets/types';
import { INFTInfoState } from 'state/nfts/types';
import { IFiatState } from 'state/price/types';

export type IAssetLogo = {
  logo: string | React.Component;
};
///////////////////////
// Types
///////////////////////

export default interface IAssetItem {
  id?: string;
  asset: IAssetState;
  assetInfo: IAssetInfoState | INFTInfoState;
  itemClicked: () => void;
  balances?: AssetBalances;
  fiat?: IFiatState;
  isNFT?: boolean;
}
