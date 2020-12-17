import {
  V3Keystore,
  KDFParamsPhrase,
} from '@stardust-collective/dag4-keystore/types/v3-keystore';
export type Keystore = V3Keystore<KDFParamsPhrase>;

export default interface IWalletState {
  keystore: Keystore | null;
}
