import { IAssetInfoState } from 'state/assets/types';

export type IAssetHeader = {
  asset: IAssetInfoState;
  address: string;
};

export default interface IAssetHeaderSettings {
  isCopied: boolean;
  onClickCopyText: (event: any) => void;
  shortenedAddress: string;
  asset: IAssetInfoState;
  copiedTextToolip: string;
}
