import { IAssetInfoState } from 'state/assets/types';

export default interface IAssetHeader {
  navigation: any;
  asset: IAssetInfoState;
  address: string;
  addressUrl: string;
}
