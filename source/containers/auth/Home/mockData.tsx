import { Asset } from './types';

const mockAssets: Array<Asset> = [
  {
    name: 'ETH',
    shortName: 'ETH',
    price: 1245.34,
    logo:
      'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    priceChange: 7.48,
    balance: 5.28275,
  },
  {
    name: 'Constellation',
    shortName: 'DAG',
    price: 0.00727502,
    logo:
      'https://assets.coingecko.com/coins/images/4645/small/Constellation.jpg?1613976385',
    priceChange: -3.61,
    balance: 5.53,
  },
  {
    name: 'API3',
    shortName: 'API3',
    price: 2.35,
    logo:
      'https://assets.coingecko.com/coins/images/13256/small/api3.jpg?1606751424',
    priceChange: -7.48,
    balance: 57.037,
  },
];
export default mockAssets;
