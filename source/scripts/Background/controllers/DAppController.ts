import { removeDapp } from 'state/dapp';
import store from 'state/store';
import { AvailableWalletEvent, ProtocolProvider } from 'scripts/common';
import { StargazerWSMessageBroker } from '../messaging';

class DAppController {
  async #notifySiteDisconnected(origin: string) {
    StargazerWSMessageBroker.sendEvent(
      ProtocolProvider.CONSTELLATION,
      AvailableWalletEvent.disconnect,
      [],
      [origin]
    );

    StargazerWSMessageBroker.sendEvent(
      ProtocolProvider.ETHEREUM,
      AvailableWalletEvent.disconnect,
      [],
      [origin]
    );
  }

  fromUserDisconnectDApp(origin: string) {
    this.#notifySiteDisconnected(origin);
    store.dispatch(removeDapp({ id: origin }));
  }
}
export default DAppController;
