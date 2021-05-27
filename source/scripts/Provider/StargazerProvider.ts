import IWalletState from 'state/wallet/types';
import store from 'state/store';
import { dag } from '@stardust-collective/dag4';
import { hashPersonalMessage, ecsign, toRpcSig } from 'ethereumjs-util';

export class StargazerProvider {
  constructor() {}

  getNetwork () {
    const { activeNetwork }: IWalletState = store.getState().wallet;

    return activeNetwork;
  }

  getAddress() {
    const { accounts, activeAccountId }: IWalletState = store.getState().wallet;

    const account = accounts && accounts[activeAccountId];

    return account && account.address && account.address.constellation;
  }

  getBalance() {
    const { accounts, activeAccountId }: IWalletState = store.getState().wallet;

    const account = accounts && accounts[activeAccountId];

    return account && account.balance;
  }

  signMessage(msg: string) {
    //const address = dag.account.keyTrio.address;
    const privateKeyHex = dag.account.keyTrio.privateKey;
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(msg));

    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = this.remove0x(toRpcSig(v, r, s));

    return sig;
  }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }
}
