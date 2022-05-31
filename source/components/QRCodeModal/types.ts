export interface IQRCodeModal {
  address: string;
  open: boolean;
  onClose: () => void;
  textTooltip: string;
  copyAddress: (address: string) => void;
}
