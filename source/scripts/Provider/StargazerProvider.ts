import IWalletState, { AccountType } from 'state/wallet/types';
import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';
import { hashPersonalMessage, ecsign, toRpcSig } from 'ethereumjs-util';
import { IAccountInfo } from 'scripts/types';
import { createAccount } from 'state/wallet';

export class StargazerProvider {
  constructor() {}

  getNetwork() {
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
    //const address = dag4.account.keyTrio.address;
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(msg));

    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = this.remove0x(toRpcSig(v, r, s));

    return sig;
  }

  async importLedgerAccounts(addresses: AccountItem[]) {
    for (let i = 0; i < addresses.length; i++) {
      let accountItem = addresses[i];

      const res = await this.getAccountByAddress(accountItem.address);

      const account = {
        id: 'L' + accountItem.id,
        label: 'Ledger ' + (accountItem.id + 1),
        address: res!.address,
        publicKey: accountItem!.publicKey,
        balance: res!.balance,
        transactions: res!.transactions,
        type: AccountType.Ledger,
      };

      await store.dispatch(createAccount(account));
    }
  }

  private async getAccountByAddress(address: string): Promise<IAccountInfo> {
    dag4.account.setKeysAndAddress('', '', address);
    const balance = await dag4.account.getBalance();
    const transactions = await dag4.account.getTransactions(10);
    return {
      address: {
        constellation: dag4.account.address,
      },
      balance,
      transactions,
    };
  }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }
}

type AccountItem = {
  id: number;
  address: string;
  publicKey: string;
};
