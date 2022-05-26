import { BitfiConfig, Bitfi, SignInParams, EnvoyMessage, Callback,  } from './bitfi'

export class BitfiBridge {
  private _bitfi: Bitfi

  private constructor(private bitfi: Bitfi) {
    this._bitfi = bitfi 
  }


  async buildTx (amountBtc: string, feeBtc: string, toAddress: string, onMessage?: Callback<EnvoyMessage>, broadcast: boolean = false) {
    const tx = await this._bitfi.createSignedTransaction(amountBtc, feeBtc, toAddress, onMessage, broadcast)
    return tx;
  }

  /**
   * Returns a signed transaction ready to be posted to the network.
   */
  async signTransaction(ledgerEncodedTx: string) {
    const result = await this.sign(ledgerEncodedTx);
    return result;
  }

  async signMessageBlind(message: string, onMessage?: Callback<EnvoyMessage>): Promise<string> {
    const result = await this.sign(message, onMessage);
    return result;
  }

  /**
   * Takes a signed transaction and posts it to the network.
   
  postTransaction() {}
  */

  public getAccount() {
    return this._bitfi.getAddress()
  }

  public getPublicKey(): string {
    return this._bitfi.getPublicKey()
  }

  public getAuthToken(): string {
    return this._bitfi.getAuthToken()
  }
  /*
  public async getAccountInfo() {
    dag4.account.loginPublicKey(this._bitfi.getPublicKey())

    const accounts = [this._bitfi.getAddress()]

    if (accounts.length > 0) {
      let responseArray = [];
      for (let i = 0; i < accounts.length; i++) {
        const address = accounts;
        const balance = (await dag4.account.getBalance() || 0);
        const response = {
          address,
          //publicKey,
          balance: balance
        };
        responseArray.push(response);
      }
      return responseArray;
    } else {
      throw new Error('No accounts found');
    }
  }
  */

  public static async signin(params: SignInParams): Promise<BitfiBridge> {
    const bitfi = await Bitfi.signin(params)
    return new BitfiBridge(bitfi)
  }

  public static async signingOffline(token: string, publicKey: string, sessionSecret: string, config: BitfiConfig): Promise<BitfiBridge> {
    const bitfi = await Bitfi.init(token, publicKey, sessionSecret, config)
    return new BitfiBridge(bitfi)
  }

  public async signMessagePrefixed(message: string, onMessage?: Callback<EnvoyMessage>): Promise<string> {
    const res = await this._bitfi.signMessagePrefixed(message, onMessage)
    return res.signatureResponse
  }

  private async sign(message: string, onMessage?: Callback<EnvoyMessage>) {
    const res = await this._bitfi.signMessageBlind(message, onMessage)
    return res.signatureResponse
  }
}

