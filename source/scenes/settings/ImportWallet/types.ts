export type IImportWalletView = {};

export default interface IImportWalletSettings {
  handleImport: (network: string) => void;
  onImportPhraseView: () => void;
}
