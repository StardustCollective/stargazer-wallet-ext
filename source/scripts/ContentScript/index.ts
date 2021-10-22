import { SUPPORTED_WALLET_METHODS } from 'scripts/Background/controllers/MessageHandler/types';
import { providerManager, stargazerProvider } from './inject';

import { Script } from 'scripts/Provider/Script';

new Script().start();

inject(`window.SUPPORTED_WALLET_METHODS = ${JSON.stringify(SUPPORTED_WALLET_METHODS)}`);
inject(providerManager);
inject(stargazerProvider);

function inject(content: string) {
  const container = document.head || document.documentElement;
  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('async', 'false');
  scriptTag.textContent = `(() => {${content}})()`;
  container.insertBefore(scriptTag, container.children[0]);
}
