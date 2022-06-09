import * as ethers from 'ethers';

import { INFURA_CREDENTIAL } from './envUtil';

const NETWORK_MAP = {
  mainnet: 'homestead',
  testnet: 'ropsten',
} as const;

const getInfuraProvider = (network: keyof typeof NETWORK_MAP) => {
  return new ethers.providers.InfuraProvider(NETWORK_MAP[network], INFURA_CREDENTIAL);
};

export { getInfuraProvider };
