import axios from 'axios'
import { w3cwebsocket, IMessageEvent } from 'websocket'
import bs58 from 'bs58'
import * as CryptoJS from 'crypto';
import * as base64 from './base64';


var ecdsa = require('secp256k1')

const WebSocket = w3cwebsocket;

export type BitfiConfig = {
  envoyUrl: string,
  apiUrl: string
}

export type SignedMessageResponse = {
  success: boolean,
  nodeResponse: string,
  signatureResponse: string
}

export type SignedTransactionResponse = {
  Success: boolean,
  Response: {
    toAddress: string,
    fullySigned: boolean,
    txnBroadcast: boolean,
    signedTransaction: string
  }
}

export type BitfiMessage = {
  user_message: string,
  display_code: string,
  completed: boolean,
  notified: boolean,
  signature_der?: string,
  request_id?: string,
  public_key?: string,
  error_message?: string
}

export type EnvoyMessage = {
  error_message?: string
  ticks: string,
  user_message: string,
  completed: boolean
}


export type Callback<T extends (EnvoyMessage | BitfiMessage)> = (mes: T) => void

export type SignInParams = {
  appSecret: string,
  signData: string,
  url: string,
  deviceId: string,
  onMessage?: Callback<BitfiMessage>,
  onNotified?: () => void,
  config: BitfiConfig,
}

export function calculateCode(randomSigningData: string, privKey: string, deviceId: string) {
  const pubKey = Buffer.from(ecdsa.publicKeyCreate(Buffer.from(privKey, 'hex'), true))
  const ripemd160 = CryptoJS.createHash('ripemd160')
  const sha256 = CryptoJS.createHash('sha256')
  const md5 = CryptoJS.createHash('md5')

  const key160 = ripemd160.update(sha256.update(pubKey).digest()).digest()

  const data = Buffer.concat([
    key160,
    Buffer.from(deviceId, 'hex'),
    Buffer.from(randomSigningData, 'hex')
  ])
  
  const md5hash = md5.update(data).digest().toString('hex')

  const tmp = md5hash.slice(-12)
  const first = bs58.encode(Buffer.from(tmp.slice(0, 4), 'hex'))
  const second = tmp.slice(4, 10)
  
  return `${first}-${second}`.toUpperCase()
}

export class Bitfi {
  private _config: BitfiConfig
  private _authToken: string
  private _publicKey: string
  private _address: string
  private _sessionSecret: string

  private constructor(
    authToken: string, 
    publicKey: string, 
    sessionSecret: string, 
    address: string, 
    config: BitfiConfig
  ) {
    this._config = config
    this._authToken = authToken
    this._publicKey = publicKey
    this._address = address,
    this._sessionSecret = sessionSecret
  }

  public getPublicKey = (): string => {
    return this._publicKey
  }

  public getAddress() {
    return this._address
  }

  public getAuthToken() {
    return this._authToken
  }

  private receiveEnvoy = <T extends any>(envoyToken: string, onMessage?: Callback<EnvoyMessage>): Promise<T> => {
    return new Promise((res, rej) => {
      var websocket = new WebSocket(this._config.envoyUrl);
      
      websocket.onopen =  () => {
        websocket.send(JSON.stringify({ ClientToken: envoyToken }));
      };
  
      websocket.onmessage = (message: IMessageEvent) => {
        var obj = JSON.parse(message.data as string);

        const envoyMes: EnvoyMessage = {
          completed: obj.Completed,
          error_message: obj.Error,
          user_message: obj.Message,
          ticks: obj.Ticks
        } 

        if (envoyMes.error_message) {
          //websocket.close()
          rej(envoyMes.error_message)
        }

        if (!envoyMes.completed) {
          onMessage && onMessage(envoyMes)
        }
        
        if (envoyMes.user_message && envoyMes.completed) {
          websocket.close()
          res(JSON.parse(base64.decode(envoyMes.user_message)))
        }
      }
    })
  }

  public signMessageBlind = async (message: string, onMessage?: Callback<EnvoyMessage>): Promise<SignedMessageResponse> => {
    let envoyToken = ''
    
    const sessionSecret = Buffer.from(this._sessionSecret, 'hex')
    const sha256 = CryptoJS.createHash('sha256')
    const hash = sha256.update(message, 'utf8').digest()    
    const pubKey = ecdsa.publicKeyCreate(sessionSecret)
    const res = ecdsa.ecdsaSign(hash, sessionSecret)


    //verify signature
    const verified = ecdsa.ecdsaVerify(res.signature, hash, pubKey)

    if (!verified) {
      throw new Error("Signature is not valid")
    }

    const signatureDer = ecdsa.signatureExport(res.signature)

    try {

      const request = {
        authToken: this._authToken,
        method: 'BlindMessage',
        messageModel: {
          BlindRequest: {
            PublicKey: Buffer.from(pubKey).toString('hex'),
            RequestMessage: message,
            Signature: Buffer.from(signatureDer).toString('hex')
          },
          MessageRequest: {
            Address: this._address,
            Symbol: 'dag',
          }
        }
      }

      const { data } = await axios.post(this._config.apiUrl, request)
  
      if (data && data.error) {
        throw new Error(data.error && data.error.message)
      }
  
      if (!data && typeof data !== 'string') {
        throw new Error("Not valid envoy token")
      }
  
      envoyToken = data
    }
    catch (exc) {
      throw new Error(`Unable to fetch envoy token: ${JSON.stringify(exc && exc.message)}`)
    }
  
    const raw = await this.receiveEnvoy<any>(envoyToken, onMessage)

    return {
      success: raw.Success,
      signatureResponse: raw.SignatureResponse,
      nodeResponse: raw.NodeResponse
    }
  }
  

  public signMessagePrefixed = async (message: string, onMessage?: Callback<EnvoyMessage>): Promise<SignedMessageResponse> => {
    let envoyToken = ''
  
    try {
      const { data } = await axios.post(this._config.apiUrl, {
        authToken: this._authToken,
        method: 'SignMessage',
        messageModel: {
          MessageRequest: {
            Message: message,
            Address: this._address,
            Symbol: 'dag',
          }
        }
      })
  
      if (data && data.error) {
        throw new Error(data.error && data.error.message)
      }
  
      if (!data && typeof data !== 'string') {
        throw new Error("Not valid envoy token")
      }
  
      envoyToken = data
    }
    catch (exc) {
      throw new Error(`Unable to fetch envoy token: ${JSON.stringify(exc && exc.message)}`)
    }
  
    const raw = await this.receiveEnvoy<any>(envoyToken, onMessage)

    return {
      success: raw.Success,
      signatureResponse: raw.SignatureResponse,
      nodeResponse: raw.NodeResponse
    }
  }
  
  public createSignedTransaction = async (
    amountBtc: string, 
    feeBtc: string, 
    toAddress: string, 
    onMessage?: Callback<EnvoyMessage>, 
    broadcast = false
  ): Promise<SignedTransactionResponse["Response"]> => {
    let envoyToken = ''
  
    try {
      const { data } = await axios.post(this._config.apiUrl, {
        authToken: this._authToken,
        method: 'Transfer',
        transferModel: {
          broadcastTxn: broadcast,
          Info: {
            From: this._address,
            To: toAddress,
            "TokenAddr": null,
            "Symbol":"DAG",
            "Amount":{
              "Sat":"0",
              "Btc": amountBtc
            },
            "Fee":{
              "Sat":"0",
              "Btc": feeBtc
            },
            "Addition":{
              "PaymentId":null,
              "DestTag":null,
              "FeePriority":null,
              "Memo":null
            }
          }
        }
      })
  
      if (data && data.error) {
        throw new Error(data.error && data.error.message)
      }
  
      if (!data && typeof data !== 'string') {
        throw new Error("Not valid envoy token")
      }
  
      envoyToken = data
    }
    catch (exc) {
      throw new Error(`Unable to fetch envoy token: ${JSON.stringify(exc && exc.message)}`)
    }
  
    const res = await this.receiveEnvoy<SignedTransactionResponse>(envoyToken, onMessage)

    res.Response.signedTransaction = JSON.parse(Buffer.from(res.Response.signedTransaction, 'hex').toString('utf-8'))
    return res.Response
  }
  
    
  public static signin = (params: SignInParams): Promise<Bitfi> => {
    const privKey = Buffer.from(params.appSecret, 'hex')
    const randomSigningData = Buffer.from(params.signData, 'hex')
    const deviceId = Buffer.from(params.deviceId, 'hex')
    
    if (!ecdsa.privateKeyVerify(privKey)) {
      throw new Error("Invalid ecdsa key, please, provide another one")
    }

    if (deviceId.length !== 3) {
      throw new Error('Invalid device ID')
    }

    if (randomSigningData.length !== 16) {
      throw new Error("Invalid randomsigning data")
    }

    if (privKey.length !== 32) {
      throw Error("Inavlid private key")
    }

    const pubKey = Buffer.from(ecdsa.publicKeyCreate(privKey, true))
    const code = calculateCode(params.signData, params.appSecret, params.deviceId)

    let notified = false

    return new Promise((res, rej) => {
      let websocket = new WebSocket(params.url);
      
      const request = {
        data_for_signing: randomSigningData.toString('hex'),
        device_id: params.deviceId,
        match_profile: true,
        request_method: "register",
        public_key: `${pubKey.toString('hex')}`, //04 means uncompressed public key
        request_id: "",
        derivation_index: "22" //dag
      }

      websocket.onopen = () => {
        websocket.send(JSON.stringify(request));
      };
      

      websocket.onmessage = async (e: any) => {
        const response = JSON.parse(e.data) as BitfiMessage

        if (response.display_code && response.display_code !== code) {
          rej('Codes are not equal, please, contact support')
        }

        if (response.error_message) {
          //websocket.close()
          rej(response.error_message)
        }

        if (response.notified && !notified) {
          params.onNotified && params.onNotified()
          notified = true
        }

        if (response.completed === false) {
          params.onMessage && params.onMessage(response)
        } else {
          const token = response.request_id 

          try {
            const bitfi = await Bitfi.init(token, response.public_key, params.appSecret, params.config)
            res(bitfi)
          }
          catch (exc) {
            rej(exc)
          }
          finally {
            websocket.close()
          }
        }
      }
    })
  };

  public static init = async (token: string, public_key: string, secret: string, config: BitfiConfig) => {
    
    const addresses = await Bitfi.request(token, 'GetAddresses', config.apiUrl)

    if (!addresses || !addresses[0])
      throw new Error('No address')
    
    const valid = await Bitfi.request(token, 'IsTokenValid', config.apiUrl)

    if (!valid)
      throw new Error('Invalid token, sign in again')
    
    const address = addresses[0]
    const bitfi = new Bitfi(token, public_key, secret, address, config)
    
    return bitfi
    
  }
  
  private static request = async (token: string, method: 'GetAddresses' | 'IsTokenValid', url: string, params: any = undefined) => {
    const res = await axios.post(url, {
      authToken: token,
      method,
      transferModel: params
    })

  
    if (res.data.error)
      throw new Error(res.data.error)
  
    return res.data.Content || res.data.content || res.data
  }
  
}



