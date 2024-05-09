import { removeDapp } from 'state/dapp';
import store from 'state/store';
import { AvailableEvents } from 'scripts/common';
import { DappRegistry } from '../dappRegistry';

class DAppController {
  #dappRegistry: DappRegistry;

  constructor(dappRegistry: DappRegistry) {
    this.#dappRegistry = dappRegistry;
  }

  async #notifySiteDisconnected(origin: string) {
    this.#dappRegistry.sendOriginChainEvent(origin, '*', AvailableEvents.disconnect);
  }

  fromUserDisconnectDApp(origin: string) {
    this.#notifySiteDisconnected(origin);
    store.dispatch(removeDapp({ id: origin }));
  }
}
export default DAppController;
