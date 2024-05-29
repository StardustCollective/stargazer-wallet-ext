import { v4 as uuidv4 } from 'uuid';
import StargazerIcon from 'assets/icons/StargazerURI';
import { ProtocolProvider, readOnlyProxy } from 'scripts/common';
import { StargazerISMessageBroker } from './is_message_broker';
import { StargazerChainProvider } from './chain_provider';

/*
 *
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 * + Announces the Ethereum provider for dApps that supports EIP-6963.
 *
 */

export type EIP6963ProviderInfo = {
  uuid: string; // a globally unique identifier the Wallet Provider that MUST be (UUIDv4 compliant) to uniquely distinguish different EIP-1193 provider sessions.
  name: string; // a human-readable local alias of the Wallet Provider to be displayed to the user on the DApp.
  icon: string; // a URI pointing to an image.
  rdns: string; // a domain name from the Domain Name System in reverse syntax ordering. Reverse-DNS
};

export enum EIP6963Event {
  ANNOUNCE_PROVIDER = 'eip6963:announceProvider',
  REQUEST_PROVIDER = 'eip6963:requestProvider',
}

export class StargazerAnnounceProvider {
  #provider: StargazerChainProvider;
  #providerInfo: EIP6963ProviderInfo = {
    uuid: uuidv4(),
    name: 'Stargazer',
    icon: StargazerIcon,
    rdns: 'io.stargazerwallet',
  };

  constructor(broker: StargazerISMessageBroker) {
    this.#provider = readOnlyProxy(
      new StargazerChainProvider(ProtocolProvider.ETHEREUM, broker)
    );
  }

  doAnnounceProvider() {
    window.dispatchEvent(
      new CustomEvent(EIP6963Event.ANNOUNCE_PROVIDER, {
        detail: Object.freeze({ info: this.#providerInfo, provider: this.#provider }),
      })
    );
  }

  announceProvider() {
    window.addEventListener(EIP6963Event.REQUEST_PROVIDER, () => {
      this.doAnnounceProvider();
    });
    this.doAnnounceProvider();
  }
}
