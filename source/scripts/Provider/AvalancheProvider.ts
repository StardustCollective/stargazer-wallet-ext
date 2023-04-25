import { EVMProvider } from './EVMProvider';
import { StargazerChain } from '../common';

export class AvalancheProvider extends EVMProvider {

  constructor() {
    super(StargazerChain.AVALANCHE);
  }
  
}
