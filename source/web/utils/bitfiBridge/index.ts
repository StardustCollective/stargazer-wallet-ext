import { BitfiDump, BitfiV2, TransferType } from '@bitfi/bitfi.js';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';
import { dag4 } from '@stardust-collective/dag4';

const DEVICE_ID_KEY = 'bitfi_device_id'
const SESSION_KEY = 'bitfi_session'

const APPROVE_TIMEOUT_MSEC = 120 * 1000
const CONNECT_TIMEOUT_MSEC = 5 * 60 * 1000
const REQUEST_TIMOUT_MSEC = 7 * 1000

const checkCodeMessage = (code: string) => 
`Make sure the code on the device is equal to ${code.toUpperCase()} and then approve the request`

class BitfiBridgeUtil {
  private bitfiBridge: BitfiV2;

  public startIndex: number = 0;

  constructor() {
    // Configure Dag4 network
    dag4.di.useFetchHttpClient();
    dag4.network.config({
      id: 'main',
      beUrl: 'https://www.dagexplorer.io/api/scan',
      lbUrl: 'https://www.dagexplorer.io/api/node',
    });
  }

  //there is only one account available
  private getAccountData = async (): Promise<LedgerAccount[]> => {
    const addresses = await this.bitfiBridge.getAccounts('dag', REQUEST_TIMOUT_MSEC)
    const publicKeys = await this.bitfiBridge.getPublicKeys('dag', REQUEST_TIMOUT_MSEC)

    const address = addresses[0]
    const publicKey = publicKeys[0]
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

  public buildTransaction = async (
    amount: number, fromAddress: string, toAddress: string, fee?: number
  ) => {
    const lastTxRef = await dag4.network.loadBalancerApi.getAddressLastAcceptedTransactionRef(fromAddress)
    
    const feeSat = (fee && (fee * Math.pow(10, 8)).toString()) || "1"
    const amountSat = (amount * Math.pow(10, 8)).toString()
    const tx = await this.bitfiBridge.transfer<TransferType.OUT_SELF, 'dag'>({
      from: fromAddress,
      to: toAddress,
      amount: amountSat,
      symbol: 'dag',
      fee: feeSat, 
      lastTxRef,
      transferType: TransferType.OUT_SELF,
    }, APPROVE_TIMEOUT_MSEC)

    console.log(tx)
    if (tx.edge.data.amount !== amountSat || tx.edge.data.fee !== feeSat) {
      throw new Error('Transaction was formed incorrectly')
    }

    return tx
  };

  // not used
  public closeConnection = () => {
    this.bitfiBridge = null
  };   
  
  // Should be use when deleting the wallet
  public logOut = () => {
    this.bitfiBridge = null
    localStorage.removeItem(DEVICE_ID_KEY)
    localStorage.removeItem(SESSION_KEY)
  }

  private async _signin(deviceId: string, onMessage: (mes: string) => void) {
    try {
      this.bitfiBridge = new BitfiV2(
        "https://dpx.async360.com", 
        "029e6fae4c08d3136631c5a5a20e03677136d0cf143e0942f925b26d954a20536c",
        deviceId,
      )
      
      onMessage(`Open your wallet, click on "Private Channels" button and then enter your salt and secret phrase to start a session`)
      
      await this.bitfiBridge.enable(CONNECT_TIMEOUT_MSEC)
      
      
      await this.bitfiBridge.authorize(code => {
        onMessage(`Authorization: ${checkCodeMessage(code)}`)
      }, APPROVE_TIMEOUT_MSEC)
      
      const dump = await this.bitfiBridge.serialize()
      localStorage.setItem(DEVICE_ID_KEY, dump.deviceId)
      delete dump.deviceId
      localStorage.setItem(SESSION_KEY, JSON.stringify(dump)) 
    }
    catch (exc) {
      this.bitfiBridge = null
      throw exc
    }
    
  }

  public requestPermissions = async (deviceId?: string, onMessage?: (mes: string) => void) => {
    if (!this.bitfiBridge) {
      if (deviceId) {
        await this._signin(deviceId, onMessage || (() => {}))
      } else {
        const savedDeviceId = localStorage.getItem(DEVICE_ID_KEY)
        const session = localStorage.getItem(SESSION_KEY)

        if (savedDeviceId) {
          if (session) {
            const dump = {
              deviceId: savedDeviceId,
              ...JSON.parse(session)
            } as BitfiDump

            if (!dump.code || !dump.eckey || !dump.sharedSecretHash) {
              localStorage.removeItem(SESSION_KEY)
              throw new Error('Invalid session format')
            }

            this.bitfiBridge = new BitfiV2(
              "https://dpx.async360.com", 
              "029e6fae4c08d3136631c5a5a20e03677136d0cf143e0942f925b26d954a20536c"
            )

            try {
              await this.bitfiBridge.deserialize(dump)
              onMessage('Checking session...')
              const info = await this.bitfiBridge.getDeviceInfo(3000)

              if (info) {
                // session is still open, no need to authorize 
                onMessage && onMessage(checkCodeMessage(dump.code))
                return
              }
            }
            catch (exc) {
              console.log(exc)
            }
          }

          await this._signin(savedDeviceId, onMessage || (() => {}))
        } else {
          throw new Error('NO saved account found, NO device ID provided')
        }
      }
    } else {
      const code = (await this.bitfiBridge.serialize()).code
      onMessage && onMessage(checkCodeMessage(code))
    }
    
  };

  public async signMessage(msg: string) {
    const address = (await this.bitfiBridge.getAccounts('dag', REQUEST_TIMOUT_MSEC))[0]
    const sig = await this.bitfiBridge.signMessage(address, msg, 'dag', APPROVE_TIMEOUT_MSEC)
    return sig;
  }

  // There is only one account, there is nothing to iterate through
  public getInitialPage = (): Promise<LedgerAccount[]> => {
    return this.getAccountData()
  };

  public getNextPage = (): Promise<LedgerAccount[]> => {
    return this.getAccountData()
  };

  public getPreviousPage = (): Promise<LedgerAccount[]> => {
    return this.getAccountData()
  };
}

export default new BitfiBridgeUtil();
