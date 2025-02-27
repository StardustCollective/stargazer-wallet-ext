import { IAssetInfoState } from 'state/assets/types';

export interface IQRCodeModal {
  address: string;
  asset: IAssetInfoState;
  open: boolean;
  onClose: () => void;
  textTooltip: string;
  copyAddress: (address: string) => void;
}
