import {
  V3Keystore,
  KDFParamsPhrase,
} from '@stardust-collective/dag4-keystore/types/v3-keystore';
import { WalletStatus } from './consts';
export type Keystore = V3Keystore<KDFParamsPhrase>;

export default interface IWalletState {
  keystore: Keystore | null;
  status: WalletStatus;
}
