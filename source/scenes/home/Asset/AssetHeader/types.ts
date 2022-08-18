import { IAssetInfoState } from 'state/assets/types';

export type IAssetHeader = {
  asset: IAssetInfoState;
};

export default interface IAssetHeaderSettings {
  asset: IAssetInfoState;
  network: string;
}
