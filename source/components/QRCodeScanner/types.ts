export default interface IQRCodeScanner {
  visble: boolean;
  onRead: (event: any) => void;
  onClosePress: () => void;
}
