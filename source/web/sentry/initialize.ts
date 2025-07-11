import {
  BrowserClient,
  defaultStackParser,
  getDefaultIntegrations,
  makeFetchTransport,
  Scope,
} from '@sentry/browser';

import packageJson from '../package.json';

// filter integrations that use the global variable
const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
  return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(
    defaultIntegration.name
  );
});

const RELEASE_NAME = `stargazer-wallet-web@${packageJson.version}`;

const client = new BrowserClient({
  dsn: process.env.SENTRY_DNS_WEB,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: integrations,
  release: RELEASE_NAME,
});

const scope = new Scope();
scope.setClient(client);

client.init();

if (typeof window !== 'undefined') {
  window.onerror = function (_, _1, _2, _3, error) {
    scope.captureException(error);
  };
}

export { scope };
