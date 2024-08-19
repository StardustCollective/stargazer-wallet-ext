import { BitfiDump, BitfiV2, DagLastTxRef, TransferType } from '@bitfi/bitfi.js';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';
import { dag4 } from '@stardust-collective/dag4';
import { DAG_NETWORK } from 'constants/index';
import localStorage from 'utils/localStorage';
import store from 'state/store';
import { toDatum } from 'utils/number';

const SESSION_KEY = 'bitfi_session';
const APPROVE_TIMEOUT_MSEC = 2 * 60 * 1000;
const CONNECT_TIMEOUT_MSEC = 10 * 60 * 1000;
const REQUEST_TIMOUT_MSEC = 7 * 1000;

const checkCodeMessage = (code: string) =>
  `Make sure the code on the device is equal to ${code.toUpperCase()} and then approve the request`;

class BitfiBridgeUtil {
  private bitfiBridge: BitfiV2;
  private readonly NUMBER_OF_ACCOUNTS = 5;
  public startIndex: number = 0;

  constructor() {
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
  }

  switchDagNetwork = (dagNetwork: string) => {
    dag4.account.connect(
      {
        id: DAG_NETWORK[dagNetwork].id,
        networkVersion: DAG_NETWORK[dagNetwork].version,
        ...DAG_NETWORK[dagNetwork].config,
      },
      false
    );
  };

  private getAccountData = async (): // startIndex: number
  Promise<LedgerAccount[]> => {
    //uncomment for multiple accounts
    // const indexes = Array.from({length: this.NUMBER_OF_ACCOUNTS}, (_, index) => index + startIndex);
    const indexes = [0];

    const accounts = await this.bitfiBridge.getAccounts(
      'dag',
      indexes,
      false,
      REQUEST_TIMOUT_MSEC
    );
    const publicKeys = await this.bitfiBridge.getPublicKeys(
      'dag',
      indexes,
      REQUEST_TIMOUT_MSEC
    );
    const balances = await Promise.all(
      accounts.map(async ({ address }) => {
        return (await dag4.account.getBalanceFor(address)) || 0;
      })
    );

    const accountData = accounts.map(
      (acc, i) =>
        ({
          address: acc.address,
          //index: acc.index,
          publicKey: publicKeys[i],
          balance: Number(balances[i]).toFixed(2).toString(),
        } as LedgerAccount)
    );

    return accountData;
  };

  public buildTransaction = async (
    amount: string,
    fromAddress: string,
    toAddress: string,
    fee?: string
  ) => {
    const { activeNetwork } = store.getState().vault;
    const dagNetworkValue = activeNetwork.Constellation;
    const dagNetworkVersion = DAG_NETWORK[dagNetworkValue].version;
    // TODO-421: Check if bitfiBridge.transfer works for 1.0 and 2.0
    const lastTxRef = (await dag4.network.getAddressLastAcceptedTransactionRef(
      fromAddress
    )) as DagLastTxRef;

    const feeSat = (fee && toDatum(fee).toString()) || '0';
    const amountSat = toDatum(amount).toString();

    let tx: any = await this.bitfiBridge.transfer<TransferType.OUT_SELF, 'dag'>(
      {
        from: fromAddress,
        to: toAddress,
        amount: amountSat,
        symbol: 'dag',
        fee: feeSat,
        index: 0 /*index ||*/,
        lastTxRef,
        transferType: TransferType.OUT_SELF,
      },
      APPROVE_TIMEOUT_MSEC
    );

    if (dagNetworkVersion === '1.0') {
      if (tx.edge.data.fee == '0') {
        delete tx.edge.data.fee;
      }

      if (
        tx.edge.data.amount !== amountSat ||
        (tx.edge.data.fee && tx.edge.data.fee !== feeSat)
      ) {
        throw new Error('Transaction was formed incorrectly');
      }
    }

    if (dagNetworkVersion === '2.0') {
      if (
        !tx.value ||
        !tx.proofs ||
        tx.value.amount !== amountSat ||
        (tx.value.fee && tx.value.fee !== feeSat)
      ) {
        throw new Error('Transaction was formed incorrectly');
      }
    }

    return tx;
  };

  public closeConnection = () => {
    this.bitfiBridge = null;
  };

  public logOut = async () => {
    this.bitfiBridge = null;
    await localStorage.removeItem(SESSION_KEY);
  };

  private async _signin(
    deviceId: string,
    onMessage: (mes: string) => void,
    onCodeGenerated: (mes: string) => void
  ) {
    try {
      this.bitfiBridge = new BitfiV2(
        'https://dpx.async360.com',
        '029e6fae4c08d3136631c5a5a20e03677136d0cf143e0942f925b26d954a20536c',
        deviceId
      );

      onMessage(
        `Open your wallet, click on "Connect wallet" and then "Start wallet" button and enter your salt and secret phrase to start a session`
      );

      await this.bitfiBridge.enable(CONNECT_TIMEOUT_MSEC);

      await this.bitfiBridge.authorize((code) => {
        onCodeGenerated && onCodeGenerated(code);
        onMessage && onMessage(`Authorization: ${checkCodeMessage(code)}`);
      }, APPROVE_TIMEOUT_MSEC);

      const dump = await this.bitfiBridge.serialize();
      delete dump.deviceId;
      await localStorage.setItem(SESSION_KEY, JSON.stringify(dump));
    } catch (exc) {
      this.bitfiBridge = null;
      throw exc;
    }
  }

  public requestPermissions = async (
    deviceId: string,
    onMessage?: (mes: string) => void,
    onCodeGenerated?: (mes: string) => void
  ) => {
    const session = await localStorage.getItem(SESSION_KEY);

    if (session) {
      const dump = {
        deviceId,
        ...JSON.parse(session),
      } as BitfiDump;

      if (!dump.code || !dump.eckey || !dump.sharedSecretHash) {
        await localStorage.removeItem(SESSION_KEY);
        throw new Error('Invalid session format');
      }

      this.bitfiBridge = new BitfiV2(
        'https://dpx.async360.com',
        '029e6fae4c08d3136631c5a5a20e03677136d0cf143e0942f925b26d954a20536c'
      );

      try {
        await this.bitfiBridge.deserialize(dump);
        onMessage('Checking session...');
        const info = await this.bitfiBridge.getDeviceInfo(3000);

        if (info) {
          // session is still open, no need to authorize
          onCodeGenerated && onCodeGenerated(dump.code);
          onMessage && onMessage(checkCodeMessage(dump.code));
          return;
        }
      } catch (exc) {
        console.log(exc);
      }
    }

    await this._signin(deviceId, onMessage, onCodeGenerated);
  };

  public async signMessage(msg: string) {
    const account = (
      await this.bitfiBridge.getAccounts('dag', [0], false, REQUEST_TIMOUT_MSEC)
    )[0];
    const sig = await this.bitfiBridge.signMessage(
      account.address,
      msg,
      'dag',
      0,
      false,
      APPROVE_TIMEOUT_MSEC
    );
    return sig;
  }

  //not used
  // public setOnProgressUpdate(onProgressUpdate: (progress: number) => void) {
  // }

  // There is only one account, there is nothing to iterate through
  public getInitialPage = (): Promise<LedgerAccount[]> => {
    this.startIndex = 0;
    return this.getAccountData();
  };

  public getNextPage = (): Promise<LedgerAccount[]> => {
    this.startIndex += this.NUMBER_OF_ACCOUNTS;
    return this.getAccountData();
  };

  public getPreviousPage = (): Promise<LedgerAccount[]> => {
    if (this.startIndex === 0) {
      throw Error('You are at page 1, no more previous pages');
    }
    this.startIndex -= this.NUMBER_OF_ACCOUNTS;
    return this.getAccountData();
  };
}

export default new BitfiBridgeUtil();
