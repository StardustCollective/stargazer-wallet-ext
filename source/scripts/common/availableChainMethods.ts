import { StargazerChain } from './chains';
import { AvailableMethods } from './availableMethods';
import { AvailableEthereumChainMethods } from './methods/availableEthereumMethods';
import { AvailablePolygonChainMethods } from './methods/availablePolygonMethods';
import { AvailableBSCChainMethods } from './methods/availableBSCMethods';
import { AvailableAvalancheChainMethods } from './methods/availableAvalancheMethods';
import { AvailableConstellationChainMethods } from './methods/availableConstellationMethods';

type AvailableChainMethod = {
  chain: StargazerChain;
  method: AvailableMethods;
  proxied: boolean;
  permissions: string[];
};

const AvailableChainMethods: AvailableChainMethod[] = [
  /* Ethereum */
  ...AvailableEthereumChainMethods,

  /* Polygon */
  ...AvailablePolygonChainMethods,

  /* BSC */
  ...AvailableBSCChainMethods,

  /* Avalanche */
  ...AvailableAvalancheChainMethods,

  /* Constellation */
  ...AvailableConstellationChainMethods
];

export type { AvailableChainMethod };
export { AvailableChainMethods };
