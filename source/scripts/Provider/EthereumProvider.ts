import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';
import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import IVaultState, { AssetType, IAssetState } from '../../state/vault/types';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

export class EthereumProvider {
  constructor() {}

  getNetwork () {
    const { activeNetwork }: IVaultState = store.getState().vault;

    return activeNetwork[KeyringNetwork.Ethereum];
  }

  getChainId () {
    const networkName = this.getNetwork();

    return networkName === 'mainnet' ? 1 : 3;
  }

  getAddress() {
    let stargazerAsset: IAssetState = this.getAssetByType(AssetType.Ethereum);

    return stargazerAsset && stargazerAsset.address;
  }

  getBalance() {
    const { balances }: IVaultState = store.getState().vault;

    let stargazerAsset: IAssetState = this.getAssetByType(AssetType.Ethereum);

    return stargazerAsset && balances[AssetType.Ethereum];
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

  /*
  async importLedgerAccounts(addresses: AccountItem[]) {
    for (let i = 0; i < addresses.length; i++) {
      let accountItem = addresses[i];

      window.controller.wallet.keyringManager.findAccount(accountItem.address);

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
  }*/

  // async postTransactionResult (hash: string) {
  //   console.log('postTransactionResult.addToMemPoolMonitor', hash);
  //
  //   dag4.monitor.addToMemPoolMonitor(hash);
  //
  //   setTimeout(() => {
  //     console.log('postTransactionResult.watchMemPool');
  //     window.controller.wallet.account.watchMemPool();
  //   }, 1000)
  // }

  // private async getAccountByAddress(address: string): Promise<IAccountInfo> {
  //   dag4.account.setKeysAndAddress('', '', address);
  //   const balance = await dag4.account.getBalance();
  //   const transactions = await dag4.account.getTransactions(10);
  //   return {
  //     address: {
  //       constellation: dag4.account.address,
  //     },
  //     balance,
  //     transactions,
  //   };
  // }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }
}

// type AccountItem = {
//   id: number;
//   address: string;
//   publicKey: string;
// };
