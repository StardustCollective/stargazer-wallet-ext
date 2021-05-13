
import { providerManager, stargazerProvider } from './inject'

import { inject } from 'scripts/Provider/utils';
import { Script } from 'scripts/Provider/Script';

(new Script()).start()

inject(providerManager())
inject(stargazerProvider())

// function injectEthereum (asset: string, name: string) {
//
//   inject(ethereumProvider({
//     name,
//     asset,
//     network: {
//       networkId: 1, chainId: 1
//     },
//     overrideEthereum: true
//   }))
// }
//
// injectEthereum('ETH', 'eth')

