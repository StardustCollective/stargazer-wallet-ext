import { EVMProvider } from './EVMProvider';
import { StargazerChain } from '../common';

export class PolygonProvider extends EVMProvider {

  constructor() {
    super(StargazerChain.POLYGON);
  }
  
}
