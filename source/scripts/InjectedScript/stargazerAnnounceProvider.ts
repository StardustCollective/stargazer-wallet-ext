import { v4 as uuid } from 'uuid';
import StargazerIcon from 'assets/icons/StargazerURI';
import { ProtocolProvider, readOnlyProxy } from '../common';
import { StargazerChainProvider } from './stargazerChainProvider';

/*
 *
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 * + Announces the Ethereum provider for dApps that supports EIP-6963.
 *
 */

interface EIP6963ProviderInfo {
  uuid: string; // a globally unique identifier the Wallet Provider that MUST be (UUIDv4 compliant) to uniquely distinguish different EIP-1193 provider sessions.
  name: string; // a human-readable local alias of the Wallet Provider to be displayed to the user on the DApp.
  icon: string; // a URI pointing to an image.
  rdns: string; // a domain name from the Domain Name System in reverse syntax ordering. Reverse-DNS
}

// Events
const ANNOUNCE_PROVIDER_EVENT = 'eip6963:announceProvider';
const REQUEST_PROVIDER_EVENT = 'eip6963:requestProvider';

// Provider info
const PROVIDER_UUID = uuid();
const PROVIDER_NAME = 'Stargazer';
const PROVIDER_ICON = StargazerIcon;
const PROVIDER_RDNS = 'io.constellationnetwork';

// Ethereum provider instance
const provider = readOnlyProxy(new StargazerChainProvider(ProtocolProvider.ETHEREUM));

// Dispatchs eip6963:announceProvider event with the provider info
function announceProvider() {
  const info: EIP6963ProviderInfo = {
    uuid: PROVIDER_UUID,
    name: PROVIDER_NAME,
    icon: PROVIDER_ICON,
    rdns: PROVIDER_RDNS,
  };

  window.dispatchEvent(
    new CustomEvent(ANNOUNCE_PROVIDER_EVENT, {
      detail: Object.freeze({ info, provider }),
    })
  );
}

// Listener for eip6963:requestProvider event
window.addEventListener(REQUEST_PROVIDER_EVENT, () => {
  announceProvider();
});

// Announces the provider as soon as the script is injected into the web page
announceProvider();
