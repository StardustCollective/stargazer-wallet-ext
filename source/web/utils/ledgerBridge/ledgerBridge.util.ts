import { LedgerBridge, LedgerAccount } from '@stardust-collective/dag4-ledger';
import webHidTransport from '@ledgerhq/hw-transport-webhid';
import { dag4 } from '@stardust-collective/dag4';
import { DAG_NETWORK } from 'constants/index';
import store from 'state/store';

/////////////////////////////
// Interface
/////////////////////////////

class LedgerBridgeUtil {
  /////////////////////////////
  // Properties
  /////////////////////////////

  /**
   * transport
   * Stores an instance of the web HID object
   */

  private transport: any;

  /**
   * ledgerBridge
   * Stores an instance of the LedgerBridge object
   */
  private ledgerBridge: LedgerBridge;

  /**
   * startIndex
   * The starting index to look up accounts.
   */

  public startIndex: number = 0;

  /**
   * onProgressUpdate
   * Called when the ledger bridged has loaded an account.
   */

  private onProgressUpdate: (update: number) => void;

  /////////////////////////////
  // Constants Properties
  ////////////////////////////

  /**
   * NUMBER_OF_ACCOUNTS
   * The number of accounts that should be fetched per page request.
   */
  private readonly NUMBER_OF_ACCOUNTS = 5;

  /////////////////////////////
  // Constructor
  /////////////////////////////

  constructor() {
    // Initialize required dependencies
    this.initialize();
  }

  /////////////////////////////
  // Private Methods
  /////////////////////////////

  private initialize = async () => {
    // Configure Dag4 network
    const { activeNetwork } = store.getState().vault;
    const dagNetworkValue = activeNetwork.Constellation;
    dag4.account.connect(
      {
        id: DAG_NETWORK[dagNetworkValue].id,
        networkVersion: DAG_NETWORK[dagNetworkValue].version,
        ...DAG_NETWORK[dagNetworkValue].config,
      },
      false
    );
  };

  private getAccountData = async (startIndex: number): Promise<LedgerAccount[]> => {
    // Close any existing connection before creating a new one.
    this.transport.close();
    // Begins requesting public keys from ledger
    const publicKeys = await this.ledgerBridge.getPublicKeys(
      startIndex,
      this.NUMBER_OF_ACCOUNTS,
      this.onProgressUpdate
    );
    const accountData = await this.ledgerBridge.getAccountInfoForPublicKeys(publicKeys);
    return accountData.map((d: LedgerAccount) => ({
      ...d,
      balance: Number(d.balance).toFixed(2).toString(),
    }));
  };

  /////////////////////////////
  // Public Methods
  /////////////////////////////

  public buildTransaction = (
    amount: number,
    publicKey: string,
    bip44Index: number,
    fromAddress: string,
    toAddress: string
  ) => {
    return this.ledgerBridge.buildTx(
      amount,
      publicKey,
      bip44Index,
      fromAddress,
      toAddress
    );
  };

  public signMessage = (message: string, bip44Index: number) => {
    return this.ledgerBridge.signMessage(message, bip44Index);
  };

  /**
   * Closes any existing transport connections
   */
  public closeConnection = () => {
    // Close any existing connection before creating a new one.
    this.transport.close();
  };

  /**
   * Requests permission to access the Ledger device via USB.
   * And sets the transport to the Ledger Bridge.
   */
  public requestPermissions = async () => {
    // Instantiate the ledger transport
    this.transport = await webHidTransport.create();
    // Close any existing connections;
    if (this.transport.device) {
      this.transport.close();
    }
    // Instantiate the ledger bridge
    this.ledgerBridge = new LedgerBridge(webHidTransport);
  };

  /**
   * Sets the onProgressUpdate callback which is called with the progress signature.
   * The callback is fired every time a public key is retrieved from the ledger,
   * the progress parameter returns a decimal ex 0.1 to 1.00.
   * @param onProgressUpdate A callback that will be fired every time a
   */
  public setOnProgressUpdate(onProgressUpdate: (progress: number) => void) {
    // Set the progress update callback if it was passed.
    if (onProgressUpdate) {
      this.onProgressUpdate = onProgressUpdate;
    }
  }

  /**
   * Retrieves the first page of accounts from the Ledger. Note! If paging
   * has progressed and getInitialPage is called the paging count will
   * reset to 0.
   * @returns Returns a promise with the results of an Array of Ledger Accounts.
   */
  public getInitialPage = (): Promise<LedgerAccount[]> => {
    // Set the starting index to 0, to reset the paging back to the first page.
    this.startIndex = 0;
    // Fetch the initial page data.
    return this.getAccountData(this.startIndex);
  };

  /**
   * Retrieves the next page of accounts from the Ledger.
   * @returns Returns a promise with the results of an Array of Ledger Accounts.
   */
  public getNextPage = (): Promise<LedgerAccount[]> => {
    // Increment the startingIndex by the NUMBER_OF_ACCOUNTS to get the next page of data.
    this.startIndex += this.NUMBER_OF_ACCOUNTS;
    // Fetch the initial page data.
    return this.getAccountData(this.startIndex);
  };

  /**
   * Retrieves the previous page of accounts from the Ledger.
   * @returns Returns a promise with the results of an Array of Ledger Accounts.
   */

  public getPreviousPage = (): Promise<LedgerAccount[]> => {
    // If the startIndex is already 0 throw an error and warn the user.
    if (this.startIndex === 0) {
      throw Error('You are at page 1, no more previous pages');
    }
    // Decrement the startingIndex by the NUMBER_OF_ACCOUNTS to get the previous page of data.
    this.startIndex -= this.NUMBER_OF_ACCOUNTS;
    // Fetch the initial page data.
    return this.getAccountData(this.startIndex);
  };
}

export default new LedgerBridgeUtil();
