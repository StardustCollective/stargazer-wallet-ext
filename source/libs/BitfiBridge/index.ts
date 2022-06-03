import { BitfiConfig, Bitfi, SignInParams, EnvoyMessage, Callback,  } from './bitfi'
export { calculateCode } from './bitfi';

export class BitfiBridge {
  private _bitfi: Bitfi

  private constructor(bitfi: Bitfi) {
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
  
  public getAccount() {
    return this._bitfi.getAddress()
  }

  public getPublicKey(): string {
    return this._bitfi.getPublicKey()
  }

  public getAuthToken(): string {
    return this._bitfi.getAuthToken()
  }

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

