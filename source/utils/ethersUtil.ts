import * as ethers from 'ethers';
import { EthNetworkId } from 'scripts/Background/controllers/EthChainController/types';
import { getNetworkInfo } from 'scripts/Background/controllers/EthChainController/utils';
import { INFURA_CREDENTIAL } from './envUtil';

const getInfuraProvider = (network: EthNetworkId) => {
  const networkInfo = getNetworkInfo(network);
  return new ethers.providers.InfuraProvider(networkInfo.value, INFURA_CREDENTIAL);
};

export { getInfuraProvider };
