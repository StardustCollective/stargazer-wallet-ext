import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';
import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import IVaultState, { AssetType, IAssetState } from '../../state/vault/types';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

export class StargazerProvider {
  constructor() {}

  getNetwork () {
    const { activeNetwork }: IVaultState = store.getState().vault;

    return activeNetwork[KeyringNetwork.Constellation];
  }

  getAddress() {
    let stargazerAsset: IAssetState = this.getAssetByType(AssetType.Constellation);

    return stargazerAsset && stargazerAsset.address;
  }

  getBalance() {
    const { balances }: IVaultState = store.getState().vault;

    let stargazerAsset: IAssetState = this.getAssetByType(AssetType.Constellation);

    return stargazerAsset && balances[AssetType.Constellation];
  }

  signMessage(msg: string) {
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(msg));

    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = this.remove0x(toRpcSig(v, r, s));

    return sig;
  }

  getAssetByType(type: AssetType) {

    const { activeAsset, activeWallet }: IVaultState = store.getState().vault;

    let stargazerAsset: IAssetState = activeAsset as IAssetState;

    if (!activeAsset || activeAsset.type !== type) {
      stargazerAsset = activeWallet.assets.find(a => a.type === type);
    }

    return stargazerAsset
  }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }
}
