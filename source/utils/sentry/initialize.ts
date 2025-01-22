import {
  BrowserClient,
  defaultStackParser,
  getDefaultIntegrations,
  makeFetchTransport,
  Scope,
} from '@sentry/browser';

// filter integrations that use the global variable
const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
  return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(
    defaultIntegration.name
  );
});

export const initializeSentry = (): Scope => {
  const client = new BrowserClient({
    dsn: process.env.SENTRY_DNS_WEB,
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: integrations,
  });

  const scope = new Scope();
  scope.setClient(client);

  client.init();

  return scope;
};
