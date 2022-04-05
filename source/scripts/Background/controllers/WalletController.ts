import { dag4 } from '@stardust-collective/dag4';
import store from 'state/store';
import { changeActiveNetwork, changeActiveWallet, setVaultInfo, updateBalances, updateStatus } from 'state/vault';
import { DAG_NETWORK } from 'constants/index';
import IVaultState from 'state/vault/types';
import { ProcessStates } from 'state/process/enums';
import { updateLoginState } from 'state/process';
import { IKeyringWallet, KeyringManager, KeyringNetwork, KeyringVaultState, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { IWalletController } from './IWalletController';
import { OnboardWalletHelper } from '../helpers/onboardWalletHelper';
import { KeystoreToKeyringHelper } from '../helpers/keystoreToKeyringHelper';
import { AccountController } from './AccountController';
import ControllerUtils from './ControllerUtils';
import AssetsController from './AssetsController';
import { getEncryptor } from 'utils/keyringManagerUtils';
import { getDappController } from 'utils/controllersUtils';
import { AccountItem } from 'scripts/types';
import { addLedgerWallet, deleteLedgerWallet } from 'state/vault';

const LedgerWalletIdPrefix = 'L';

class WalletController implements IWalletController {
  account: AccountController;

  keyringManager: KeyringManager;

  onboardHelper: OnboardWalletHelper;

  static instance: WalletController;

  constructor() {
    this.onboardHelper = new OnboardWalletHelper();
    this.keyringManager = new KeyringManager({
      encryptor: getEncryptor(),
    });
    this.keyringManager.on('update', async (state: KeyringVaultState) => {
      store.dispatch(setVaultInfo(state));
      const { vault } = store.getState();

      try {
        if (vault && vault.activeWallet) {
          await this.switchWallet(vault.activeWallet.id);
        } else if (state.wallets.length) {
          await this.switchWallet(state.wallets[0].id);
        }
      } catch (e) {
        console.log('Error while switching wallet at login');
        console.log(e);
      }
      store.dispatch(updateLoginState({processState: ProcessStates.IDLE}));
    });

    const utils = Object.freeze(ControllerUtils());

    this.account = new AccountController(
      this.keyringManager,
      AssetsController(() => utils.updateFiat())
    );
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
    store.dispatch(updateLoginState({processState: ProcessStates.IN_PROGRESS}));
    await this.keyringManager.login(password);

    const state = store.getState();
    const { vault } = state;

    if (vault) {
      // Check for v1.4 migration
      if (vault.migrateWallet) {
        try {
          await KeystoreToKeyringHelper.migrate(vault.migrateWallet, password);
        } catch (e) {
          return false;
        }
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
    try {
      if (resetAll) {
        wallet = await this.keyringManager.createOrRestoreVault(label, phrase);
      } else {
        wallet = await this.keyringManager.createMultiChainHdWallet(label, phrase);
      }
    } catch (err) {
      console.log('CREATE WALLET ERR CAUGHT =====>>>>> ', err);
      console.log('err.stack');
      throw err;
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
      const { vault } = store.getState();
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
    await this.account.assetsBalanceMonitor.start();
    await this.account.txController.startMonitor();
  }

  async notifyWalletChange(accounts: string[]) {
    const dappController = getDappController();

    // No Dapp controller on mobile
    if (!dappController) {
      return;
    }

    return dappController.notifyAccountsChanged(accounts)
  }

  async switchNetwork(network: KeyringNetwork, chainId: string) {
    store.dispatch(updateBalances({ pending: 'true' }));

    const { activeAsset }: IVaultState = store.getState().vault;
    const { assets } = store.getState();
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
        await this.account.updateAccountActiveAsset(activeAsset);
      }

      await this.account.getLatestTxUpdate();
    }

    // restart monitor with different network
    await this.account.assetsBalanceMonitor.start();
  }

  setWalletPassword(password: string) {
    this.keyringManager.setPassword(password);
  }

  async logOut() {
    this.keyringManager.logout();
    this.account.ethClient = undefined;
    store.dispatch(changeActiveWallet(undefined));
    store.dispatch(updateStatus());
  }
}

export default new WalletController();
