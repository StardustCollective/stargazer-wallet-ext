import { dag4 } from '@stardust-collective/dag4';
import store from 'state/store';
import { 
  changeActiveNetwork, 
  changeActiveWallet, 
  setVaultInfo, 
  updateBalances,
  addLedgerWallet, 
  updateWallets, 
  addBitfiWallet 
} from 'state/vault';
import { IVaultWalletsStoreState } from 'state/vault/types'
import { DAG_NETWORK } from 'constants/index';
import IVaultState from 'state/vault/types';
import { ProcessStates } from 'state/process/enums';
import { updateLoginState } from 'state/process';
import { KeyringAssetType, KeyringManager, KeyringNetwork, KeyringWalletState, KeyringVaultState, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { IWalletController } from './IWalletController';
import { OnboardWalletHelper } from '../helpers/onboardWalletHelper';
import { KeystoreToKeyringHelper } from '../helpers/keystoreToKeyringHelper';
import { AccountController } from './AccountController';
import ControllerUtils from './ControllerUtils';
import AssetsController from './AssetsController';
import { getEncryptor } from 'utils/keyringManagerUtils';
import { getDappController } from 'utils/controllersUtils';
import { AccountItem } from 'scripts/types';
import { EthChainId } from './EVMChainController/types';
import filter from 'lodash/filter';

// Constants
const LEDGER_WALLET_PREFIX = 'L';
const BITFI_WALLET_PREFIX = 'B';
const LEDGER_WALLET_LABEL = 'Ledger';
const BITFI_WALLET_LABEL = 'Bitfi';
const ACCOUNT_ITEMS_FIRST_INDEX = 0;

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
      store.dispatch(updateLoginState({ processState: ProcessStates.IDLE }));
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
    store.dispatch(updateLoginState({ processState: ProcessStates.IN_PROGRESS }));
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

  private checkForDuplicateWallet(address: string) {

    const state = store.getState();
    const { vault } = state;
    const { wallets } = vault;
    const allWallets = [...wallets.local, ...wallets.ledger, ...wallets.bitfi];

    for (let i = 0; i < allWallets.length; i++) {
      let accounts = allWallets[i].accounts;
      for (let j = 0; j < accounts.length; j++) {
        let account = accounts[j];
        if (account.address === address)
          return true;
      }
    }

    return false;

  }

  private getNextHardwareWaletAccountId = (wallets: any, prefix: string) => {
    // If no wallets exist return 1 as the first ID.
    if (wallets.length === 0) {
      return 1;
    }

    let walletIds = [];

    // Move all the existing IDs the walletIds array.
    for (let i = 0; i < wallets.length; i++) {
      const wallet = wallets[i];
      const num = wallet.id.replace(prefix, "");
      walletIds.push((parseInt(num)));
    }

    //Determin the next ID.
    return walletIds.sort(function (a, b) { return a - b; })[walletIds.length - 1] + 1;

  };

  async importHardwareWalletAccounts(accountItems: AccountItem[]) {

    for (let i = 0; i < accountItems.length; i++) {
      const state = store.getState();
      const { vault } = state;
      const { wallets } = vault;
      const accountItem = accountItems[i];
      const isDuplicate = this.checkForDuplicateWallet(accountItem.address);

      // Skip the account if it already exist in the vault.wallets redux store.
      if (isDuplicate) {
        continue;
      }

      const wallet = accountItem.type === KeyringWalletType.LedgerAccountWallet ? wallets.ledger : wallets.bitfi;
      const prefix = accountItem.type === KeyringWalletType.LedgerAccountWallet ? LEDGER_WALLET_PREFIX : BITFI_WALLET_PREFIX;
      const label = accountItem.type === KeyringWalletType.LedgerAccountWallet ? LEDGER_WALLET_LABEL : BITFI_WALLET_LABEL;
      const addWallet = accountItem.type === KeyringWalletType.LedgerAccountWallet ? addLedgerWallet : addBitfiWallet;
      // Determine the next ID for either a ledger or bitfi wallet.
      const id: number = this.getNextHardwareWaletAccountId(wallet, prefix);

      // Determine the name of the wallet for Ledger we need to create a recursive 
      // function that will name the wallets.
      const newWallet = {
        id: `${prefix}${id}`,
        // The account id is offset by one so the UI displays will
        // the first account as 1 and not 0.
        label: `${label} ${id}`,
        type: accountItem.type,
        accounts: [
          {
            address: accountItem.address,
            network: KeyringNetwork.Constellation,
            publicKey: accountItem!.publicKey,
          },
        ],
        supportedAssets: [KeyringAssetType.DAG],
      };

      await store.dispatch(addWallet(newWallet));

      // Switches wallets immediately after adding the first account item 
      // to prevent a rendering delay in the wallet extension.
      if (i === ACCOUNT_ITEMS_FIRST_INDEX) {
        // Switches wallets to the first hardware wallet account item in the accountItem array.
        this.switchWallet(`${prefix}${accountItems[0].id}`);
      }
    }
  }

  async deleteWallet(wallet: KeyringWalletState, password: string) {

    if (this.checkPassword(password)) {

      const { vault } = store.getState();
      const { wallets } = vault;
      const { local, bitfi, ledger } = wallets;

      let newWalletState: IVaultWalletsStoreState = { local: [], ledger: [], bitfi: []}
      let newLocalState = [...local];
      let newLedgerState = [...ledger];
      let newBitfiState = [...bitfi];

      if (wallet.type !== KeyringWalletType.LedgerAccountWallet &&
        wallet.type !== KeyringWalletType.BitfiAccountWallet) {
         newLocalState = filter(newLocalState, (w) => w.id !== wallet.id);
      } else {
        if (wallet.type === KeyringWalletType.LedgerAccountWallet) {
          newLedgerState = filter(newLedgerState, (w) => w.id !== wallet.id);
        } else if (wallet.type === KeyringWalletType.BitfiAccountWallet) {
          newBitfiState = filter(newBitfiState, (w) => w.id !== wallet.id);
        }
      }

      newWalletState = {
        local: [...newLocalState],
        ledger: [...newLedgerState],
        bitfi: [...newBitfiState],
      }

      const newAllWallets  = [...newWalletState.local, ...newWalletState.ledger, ...newWalletState.bitfi];

      if (vault && vault.activeWallet && vault.activeWallet.id === wallet.id) {
        if (newAllWallets.length) {
          this.switchWallet(newAllWallets[0].id);
        }
      }

      store.dispatch(updateWallets({wallets: newWalletState}));

      if (wallet.type !== KeyringWalletType.LedgerAccountWallet &&
        wallet.type !== KeyringWalletType.BitfiAccountWallet
      ) {
        await this.keyringManager.removeWalletById(wallet.id);
      }

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

  async switchNetwork(network: string, chainId: string) {
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
      this.account.txController.setChain(chainId as EthChainId);
      this.account.ethClient.setChain(chainId as EthChainId);
      this.account.assetsController.setChain(chainId as EthChainId);
    }

    // TODO-349: Check if we need to add some logic here
    if (network === 'Avalanche') {
      // Do AVALANCHE stuff
      console.log('Avalanche - ', chainId);
    }
    if (network === 'BSC') {
      // Do BSC stuff
      console.log('BSC - ', chainId);
    }
    if (network === 'Polygon') {
      // Do Polygon stuff
      console.log('Polygon - ', chainId);
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
  }
}

export default new WalletController();
