import { EVMProvider } from './EVMProvider';
import { StargazerChain } from '../common';

export class EthereumProvider extends EVMProvider {

  constructor() {
    super(StargazerChain.ETHEREUM);
  }
  
}
