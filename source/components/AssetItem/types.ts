///////////////////////
// Imports
///////////////////////

import { IAssetState, AssetBalances, ActiveNetwork } from 'state/vault/types';
import { IAssetInfoState } from 'state/assets/types';
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
  assetInfo: IAssetInfoState;
  itemClicked: () => void;
  balances?: AssetBalances;
  fiat?: IFiatState;
  showNetwork?: boolean;
  showPrice?: boolean;
  activeNetwork?: ActiveNetwork;
}
