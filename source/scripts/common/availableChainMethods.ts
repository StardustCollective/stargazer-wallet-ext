import { StargazerChain, StargazerProvider } from './chains';
import { AvailableMethods } from './availableMethods';
import { AvailableEthereumChainMethods } from './methods/availableEthereumMethods';
import { AvailableConstellationChainMethods } from './methods/availableConstellationMethods';

type AvailableChainMethod = {
  chain: StargazerChain | StargazerProvider;
  method: AvailableMethods;
  proxied: boolean;
  permissions: string[];
};

const AvailableChainMethods: AvailableChainMethod[] = [
  /* Ethereum */
  ...AvailableEthereumChainMethods,

  /* Constellation */
  ...AvailableConstellationChainMethods
];

export type { AvailableChainMethod };
export { AvailableChainMethods };
