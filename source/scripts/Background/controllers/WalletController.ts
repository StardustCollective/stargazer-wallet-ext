import { dag4 } from '@stardust-collective/dag4';
import store from 'state/store';
import { changeActiveNetwork, changeActiveWallet, setVaultInfo, updateBalances, updateStatus } from 'state/vault';
import { AccountController } from './AccountController';
import { DAG_NETWORK } from 'constants/index';
import IVaultState from 'state/vault/types';
import IAssetListState from 'state/assets/types';
import { browser } from 'webextension-polyfill-ts';
import { KeyringManager, KeyringNetwork, KeyringVaultState, KeyringWalletType} from '@stardust-collective/dag4-keyring';
import { IWalletController } from './IWalletController';
import { OnboardWalletHelper } from '../helpers/onboardWalletHelper';
import { KeystoreToKeyringHelper } from '../helpers/keystoreToKeyringHelper';
import DappController from 'scripts/Background/controllers/DAppController';
import { AccountItem } from 'scripts/types';
import { addLedgerWallet, deleteLedgerWallet } from 'state/vault';
import { KeyringAssetType } from '@stardust-collective/dag4-keyring';

const LedgerWalletIdPrefix = 'L';
export class WalletController implements IWalletController {
  account: AccountController;
  keyringManager: KeyringManager;
  onboardHelper: OnboardWalletHelper;

  constructor() {
    this.onboardHelper = new OnboardWalletHelper();
    this.keyringManager = new KeyringManager();
    this.keyringManager.on('update', (state: KeyringVaultState) => {
      store.dispatch(setVaultInfo(state));
      const vault: IVaultState = store.getState().vault;
      if (vault && !vault.activeWallet && state.wallets.length) {
        this.switchWallet(state.wallets[0].id);
      }
    });

    this.account = new AccountController(this.keyringManager);
  }

  checkPassword(password: string) {
    return this.keyringManager.checkPassword(password);
  }

  isUnlocked() {
    return this.keyringManager.isUnlocked();
  }

  getPhrase(walletId: string, password: string) {
    if (!this.checkPassword(password)) return null;
    return this.keyringManager.exportWalletSecretKeyOrPhrase(walletId);
  }

  getPrivateKey(walletId: string, password: string) {
    if (!this.checkPassword(password)) return null;
    return this.keyringManager.exportWalletSecretKeyOrPhrase(walletId);
  }

  async unLock(password: string): Promise<boolean> {
    await this.keyringManager.login(password);

    const state = store.getState();
    const vault: IVaultState = state.vault;

    if (vault) {

      //Check for v1.4 migration
      if (vault.migrateWallet) {
        try {
          await KeystoreToKeyringHelper.migrate(vault.migrateWallet, password);
        }
        catch (e) {
          return false;
        }
      }

      if (vault.activeWallet) {
        await this.switchWallet(vault.activeWallet.id);
      }
    }
    return true;
  }

  async importSingleAccount(label: string, network: KeyringNetwork, privateKey: string, silent?: boolean) {
    const wallet = await this.keyringManager.createSingleAccountWallet(label, network, privateKey);

    if (!silent) {
      await this.switchWallet(wallet.id);
    }
    return wallet.id;
  }

  async createWallet(label: string, phrase?: string, resetAll = false) {
    let wallet;
    if (resetAll) {
      wallet = await this.keyringManager.createOrRestoreVault(label, phrase);
    } else {
      wallet = await this.keyringManager.createMultiChainHdWallet(label, phrase);
    }

    await this.switchWallet(wallet.id);

    return wallet.id;
  }

  async createLedgerWallets(accountItems: AccountItem[]) {

    for (let i = 0; i < accountItems.length; i++) {
      let accountItem = accountItems[i];

      const wallet = {
        id: `${LedgerWalletIdPrefix}${accountItem.id}`,
        label: 'Ledger ' + (accountItem.id + 1),
        type: KeyringWalletType.LedgerAccountWallet,
        accounts: [
          {
            address: accountItem.address,
            network: KeyringNetwork.Constellation,
            publicKey: accountItem!.publicKey,
          },
        ],
        supportedAssets: [KeyringAssetType.DAG],
      };

      await store.dispatch(addLedgerWallet(wallet));
      
      // Switches wallets immediately after adding the first item 
      // to prevent a visual delay in the wallet extension.
      if(i === 0){
       // Switches wallets to the first ledger item in the accountItem array.
        this.switchWallet(`${LedgerWalletIdPrefix}${accountItems[0].id}`);
      }
    }
  }

  async deleteWallet(walletId: string, password: string) {
    if (this.checkPassword(password)) {
      // const { wallet }: IVaultState = store.getState().vault;
      await this.keyringManager.removeWalletById(walletId);
      // store.dispatch(deleteWalletState());
      const vault: IVaultState = store.getState().vault;
      if (vault && vault.activeWallet && vault.activeWallet.id === walletId) {
        const wallets = this.keyringManager.getWallets();
        if (wallets.length) {
          this.switchWallet(wallets[0].id);
        }
      }
      store.dispatch(updateStatus());
      return true;
    }
    return false;
  }

  async deleteLedgerWallet(walletId: string, password: string){
    const vault: IVaultState = store.getState().vault;
    if(this.checkPassword(password)){
      store.dispatch(deleteLedgerWallet(walletId));
      if (vault && vault.activeWallet && vault.activeWallet.id === walletId) {
        const wallets = this.keyringManager.getWallets();
        if (wallets.length) {
          this.switchWallet(wallets[0].id);
        }
      }
      store.dispatch(updateStatus());
      return true;
    }
    return false;
  }

  async switchWallet(id: string) {
    store.dispatch(updateBalances({ pending: 'true' }));

    await this.account.buildAccountAssetInfo(id);
    await this.account.getLatestTxUpdate();
    this.account.assetsBalanceMonitor.start();
    this.account.txController.startMonitor();

  }

  async notifyWalletChange(accounts: string[]) {
    return DappController().notifyAccountsChanged(accounts)
  }

  switchNetwork(network: KeyringNetwork, chainId: string) {

    store.dispatch(updateBalances({ pending: 'true' }));

    const { activeAsset }: IVaultState = store.getState().vault;
    const assets: IAssetListState = store.getState().assets;
    console.log(network, chainId);

    if (network === KeyringNetwork.Constellation && DAG_NETWORK[chainId]!.id) {
      dag4.network.setNetwork({
        id: DAG_NETWORK[chainId].id,
        beUrl: DAG_NETWORK[chainId].beUrl,
        lbUrl: DAG_NETWORK[chainId].lbUrl,
      });
    }

    if (network === KeyringNetwork.Ethereum) {
      this.account.txController.setNetwork(chainId as any);
    }

    store.dispatch(changeActiveNetwork({ network, chainId }));

    if (activeAsset) {
      if (assets[activeAsset.id].network !== chainId) {
        this.account.updateAccountActiveAsset(activeAsset);
      }

      this.account.getLatestTxUpdate();
    }

    //restart monitor with different network
    this.account.assetsBalanceMonitor.start();
  }

  setWalletPassword(password: string) {
    this.keyringManager.setPassword(password);
  }

  async logOut() {
    this.keyringManager.logout();
    this.account.ethClient = undefined;
    store.dispatch(changeActiveWallet(undefined));
    store.dispatch(updateStatus());
    browser.runtime.reload();
  }
}
