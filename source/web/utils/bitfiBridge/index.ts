import { BitfiBridge, calculateCode } from '../../../libs/BitfiBridge';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';
import { dag4 } from '@stardust-collective/dag4';
import Vault from './vault'
import * as CryptoJS from 'crypto'


/////////////////////////////
// Interface
/////////////////////////////

class BitfiBridgeUtil {
  /////////////////////////////
  // Properties
  /////////////////////////////

  /**
   * bitfiBridge
   * Stores an instance of the BitfiBridge object
   */
  private bitfiBridge: BitfiBridge;

  /**
   * startIndex
   * The starting index to look up accounts.
   */
  public startIndex: number = 0;

  /////////////////////////////
  // Constructor
  /////////////////////////////

  constructor() {
    this.initialize();
  }

  /////////////////////////////
  // Private Methods
  /////////////////////////////
  
  private initialize = async () => {
    // Configure Dag4 network
    dag4.di.useFetchHttpClient();
    dag4.network.config({
      id: 'main',
      beUrl: 'https://www.dagexplorer.io/api/scan',
      lbUrl: 'https://www.dagexplorer.io/api/node',
    });
  };
  

  //there is only one account available
  private getAccountData = async (
    startIndex: number
  ): Promise<LedgerAccount[]> => {

    const address = this.bitfiBridge.getAccount()
    const publicKey = this.bitfiBridge.getPublicKey()
    const balance = await dag4.account.getBalanceFor(address)

    const accountData = [
      {
        address,
        publicKey,
        balance: balance.toString()
      }
    ]

    return accountData.map((d: LedgerAccount) => ({
      ...d,
      balance: Number(d.balance).toFixed(2).toString(),
    }));
  };

  /////////////////////////////
  // Public Methods
  /////////////////////////////

  public buildTransaction = async (amount: number, publicKey: string, bip44Index: number, fromAddress: string, toAddress: string) => {
    const res = await this.bitfiBridge.buildTx(amount.toString(), "0", toAddress)
    return res.signedTransaction
  };

  public signMessage = (message: string) => {
    return this.bitfiBridge.signMessagePrefixed(message);
  }

  // not used
  public closeConnection = () => {
  };   
  
  // Should be use when deleting the wallet
  public logOut = () => {
    this.bitfiBridge = undefined
    Vault.clearContext()
  }

  /**
   * Requests permission to access Bitfi wallet
   */
  public requestPermissions = async (deviceId?: string, onMessage?: (m: string) => void, onCodeGenerated?: (code: string) => void) => {
    if (!this.bitfiBridge) {
      let bridge = null
      
      if (Vault.hasContext()) {
        try {
          const { authToken, publicKey, appSecret } = Vault.getContext()

          bridge = await BitfiBridge.signingOffline( 
            authToken,
            publicKey,
            appSecret,
            {
              apiUrl: 'https://www.bitfi.com/exchange/dagapi',
              envoyUrl: 'wss://env.async360.com'
            }
          )
        } 
        catch (exc) {
          console.log(exc)
          Vault.clearContext()
          throw new Error("Unable to sign in, please, try again")
        }
        
      } else {
        const appSecret = CryptoJS.randomBytes(32).toString('hex')
        const randomSigningData = CryptoJS.randomBytes(16).toString('hex')

        // The code should be displayed to user so it can compare it to the code on his device
        const code = calculateCode(
          randomSigningData,
          appSecret,
          deviceId
        )

        onCodeGenerated(code)

        // BitfiBridge. - persistent socket for asynchronous round trip and instant device communication  
        bridge = await BitfiBridge.signin({
          appSecret,
          signData: randomSigningData,
          url: 'wss://bitfi.com/bfa',
          deviceId,
          config: {
            apiUrl: 'https://www.bitfi.com/exchange/dagapi',
            envoyUrl: 'wss://env.async360.com'
          },
          //optional callback
          onMessage: (m) => {
            onMessage(m.user_message)
          }
        })

        const authToken = bridge.getAuthToken()
        Vault.saveContext(authToken, bridge.getPublicKey(), appSecret, deviceId) 
      }

      this.bitfiBridge = bridge
    }

    
  };

  //not used
  public setOnProgressUpdate(onProgressUpdate: (progress: number) => void) {
  }

  // There is only one account, there is nothing to iterate through
  public getInitialPage = (): Promise<LedgerAccount[]> => {
    return this.getAccountData(0)
  };

  public getNextPage = (): Promise<LedgerAccount[]> => {
    return this.getAccountData(0)
  };

  public getPreviousPage = (): Promise<LedgerAccount[]> => {
    return this.getAccountData(0)
  };
}

export default new BitfiBridgeUtil();
