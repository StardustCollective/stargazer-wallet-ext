import { providerManager, stargazerProvider } from './inject';

import { Script } from 'scripts/Provider/Script';

new Script().start();

inject(providerManager);
inject(stargazerProvider);

function inject(content: string) {
  const container = document.head || document.documentElement;
  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('async', 'false');
  scriptTag.textContent = `(() => {${content}})()`;
  container.insertBefore(scriptTag, container.children[0]);
}
