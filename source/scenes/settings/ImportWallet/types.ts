import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

export type IImportWalletView = {};

export default interface IImportWalletSettings {
  handleImport: (network: KeyringNetwork) => () => void;
  onImportPhraseView: () => void;
}
