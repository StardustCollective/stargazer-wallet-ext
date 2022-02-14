export type IAddWalletView = {
  navigation: any;
};

export default interface IAddWalletSettings {
  onCreateNewWalletClicked: () => void;
  onImportWalletClicked: () => void;
}
