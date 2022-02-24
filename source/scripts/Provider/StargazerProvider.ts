import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import find from 'lodash/find';
import IVaultState, { AssetType, IAssetState } from '../../state/vault/types';
import { IDAppState } from '../../state/dapp/types';
import { useController } from 'hooks/index';

export type StargazerSignatureRequest = {
  content: string;
  metadata: Record<string, any>;
};
export class StargazerProvider {
  constructor() {}

  getNetwork() {
    const { activeNetwork }: IVaultState = store.getState().vault;

    return activeNetwork[KeyringNetwork.Constellation];
  }

  // TODO: how to handle chain IDs for DAG? Currently mapped to Eth mainnet + Ropsten
  getChainId() {
    const networkName = this.getNetwork();

    return networkName === 'main' ? 1 : 3;
  }

  getAddress() {
    let stargazerAsset: IAssetState = this.getAssetByType(AssetType.Constellation);

    return stargazerAsset && stargazerAsset.address;
  }

  getPublicKey() {
    const { dapp, vault } = store.getState();
    const { whitelist }: IDAppState = dapp;

    const controller = useController();
    const current = controller.dapp.getCurrent();
    const origin = current && current.origin;

    if (!origin) {
      throw new Error('StargazerProvider.getPublicKey: No origin');
    }

    const _origin = origin.replace(/https?:\/\//, '');

    const dappData = whitelist[_origin];

    if (!dappData?.accounts?.Constellation) {
      throw new Error('StargazerProvider.getPublicKey: Not whitelisted');
    }

    const { activeWallet }: IVaultState = vault;

    if (!activeWallet) {
      throw new Error('StargazerProvider.getPublicKey: No active wallet');
    }

    return dag4.account.keyTrio.publicKey;
  }

  getAccounts(): Array<string> {
    const { dapp, vault } = store.getState();
    const { whitelist }: IDAppState = dapp;

    const controller = useController();
    const current = controller.dapp.getCurrent();
    const origin = current && current.origin;

    if (!origin) {
      return [];
    }

    const _origin = origin.replace(/https?:\/\//, '');

    const dappData = whitelist[_origin];

    if (!dappData?.accounts?.Constellation) {
      return [];
    }

    const { activeWallet }: IVaultState = vault;

    if (!activeWallet) {
      return dappData.accounts.Constellation;
    }

    const dagAddresses = dappData.accounts.Constellation;
    const activeAddress = find(activeWallet.assets, { id: 'constellation' });

    return [activeAddress?.address, ...dagAddresses.filter((address) => address !== activeAddress?.address)].filter(
      Boolean
    ); // if no active address, remove
  }

  getBlockNumber() {
    // TODO
    return 1;
  }

  getGasEstimate() {
    // TODO
    return 0;
  }

  getBalance() {
    const { balances }: IVaultState = store.getState().vault;

    let stargazerAsset: IAssetState = this.getAssetByType(AssetType.Constellation);

    return stargazerAsset && balances[AssetType.Constellation];
  }

  normalizeSignatureRequest(encodedSignatureRequest: string): string {
    let signatureRequest: StargazerSignatureRequest;
    try {
      signatureRequest = JSON.parse(window.atob(encodedSignatureRequest));
    } catch (e) {
      throw new Error('Unable to decode signatureRequest');
    }

    const test =
      typeof signatureRequest === 'object' &&
      signatureRequest !== null &&
      typeof signatureRequest.content === 'string' &&
      typeof signatureRequest.metadata === 'object' &&
      signatureRequest.metadata !== null;

    if (!test) {
      throw new Error('SignatureRequest does not match spec');
    }

    let parsedMetadata: Record<string, any> = {};
    for (const [key, value] of Object.entries(signatureRequest.metadata)) {
      if (['boolean', 'number', 'string'].includes(typeof value) || value === null) {
        parsedMetadata[key] = value;
      }
    }

    signatureRequest.metadata = parsedMetadata;

    const newEncodedSignatureRequest = window.btoa(JSON.stringify(signatureRequest));

    if (newEncodedSignatureRequest !== encodedSignatureRequest) {
      throw new Error('SignatureRequest does not match spec (unable to re-normalize)');
    }

    return newEncodedSignatureRequest;
  }

  signMessage(msg: string) {
    const privateKeyHex = dag4.account.keyTrio.privateKey;
    const sig = dag4.keyStore.sign(privateKeyHex, msg);

    return sig;
  }

  getAssetByType(type: AssetType) {
    const { activeAsset, activeWallet }: IVaultState = store.getState().vault;

    let stargazerAsset: IAssetState = activeAsset as IAssetState;

    if (!activeAsset || activeAsset.type !== type) {
      stargazerAsset = activeWallet.assets.find((a) => a.type === type);
    }

    return stargazerAsset;
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
}

// type AccountItem = {
//   id: number;
//   address: string;
//   publicKey: string;
// };
