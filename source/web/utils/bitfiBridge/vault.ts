import { base64 } from 'ethers/lib/utils';

/*

Should be put in stargazer vault which is encrypted by a user password

*/

const key = 'BITFI_KEY'

class Vault {
  public static saveContext = (authToken: string, publicKey: string, appSecret: string, deviceId: string) => {
    const obj = {
      authToken,
      publicKey,
      appSecret,
      deviceId
    }

    const data = base64.encode(Buffer.from(JSON.stringify(obj), 'utf-8'))
    localStorage.setItem(key, data)
  }

  public static getContext = () => {
    const raw = localStorage.getItem(key)
    const data = Buffer.from(base64.decode(raw)).toString('utf-8')
    const parsed = JSON.parse(data)

    return parsed
  }

  public static hasContext = (): boolean => {
    return localStorage.getItem(key) !== null
  }

  public static clearContext = () => {
    localStorage.removeItem(key)
  }
}

export default Vault
  