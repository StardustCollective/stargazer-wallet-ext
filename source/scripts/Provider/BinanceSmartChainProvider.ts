import { EVMProvider } from './EVMProvider';
import { StargazerChain } from '../common';

export class BinanceSmartChainProvider extends EVMProvider {

  constructor() {
    super(StargazerChain.BSC);
  }
  
}
