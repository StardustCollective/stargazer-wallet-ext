import { RequestArguments, EIPChainProvider } from '../common/eipChainProvider';
import { StargazerChain } from './utils';



/**
 * EIP 1193 JS Provider
 * https://eips.ethereum.org/EIPS/eip-1193
 */
class StargazerChainProvider extends EIPChainProvider {
  #chain: StargazerChain;

  constructor(chain: StargazerChain) {
    super();
    this.#chain = chain;
  }

  get version() {
    return STARGAZER_WALLET_VERSION;
  }

  request(args: RequestArguments): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }

  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
}

export { StargazerChainProvider };
