import IWalletState from 'state/wallet/types';
import store from 'state/store';
import { dag } from '@stardust-collective/dag4';
import { hashPersonalMessage, ecsign, toRpcSig } from 'ethereumjs-util';
import { ecrecover, fromRpcSig } from 'ethereumjs-util/dist/signature';

export class StargazerProvider {
  constructor() {}

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
    const address = dag.account.keyTrio.address;
    const privateKeyHex = dag.account.keyTrio.privateKey;
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(msg));

    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = this.remove0x(toRpcSig(v, r, s));

    this.verifyMessage(msg, sig, address);

    return sig;
  }

  verifyMessage(msg: string, signature: string, saysAddress: string) {
    const msgHash = hashPersonalMessage(Buffer.from(msg));
    const signatureParams = fromRpcSig('0x' + signature);
    const publicKeyBuffer = ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    const publicKey = '04' + publicKeyBuffer.toString('hex');
    const actualAddress = dag.keyStore.getDagAddressFromPublicKey(publicKey);

    console.log('publicKey:', publicKey);
    console.log(
      'verifyMessage:',
      saysAddress + ' === ' + actualAddress,
      saysAddress === actualAddress
    );

    return saysAddress === actualAddress;
  }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }
}
