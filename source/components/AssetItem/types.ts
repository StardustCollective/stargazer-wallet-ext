///////////////////////
// Imports
///////////////////////

import { IAssetState } from 'state/vault/types';
import { IAssetInfoState } from 'state/assets/types';
import { IFiatAssetState } from 'state/price/types';

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
  balance?: string;
  assetPrice?: IFiatAssetState;
  showNetwork?: boolean;
  showPrice?: boolean;
  networkLabel?: string;
  loading?: boolean;
}
