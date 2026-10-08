///////////////////////////
// Routes
///////////////////////////

import routes from './routes';
import screens from './screens';

///////////////////////////
// Linking Configs
///////////////////////////

const config = {
  screens: routes,
};

// Screens that reveal or remove secrets must never be reachable from an external link
const BLOCKED_PATHS = [
  routes[screens.settings.checkPassword],
  routes[screens.settings.removeWallet],
];

const linking = {
  prefixes: ['stargazer://'],
  config,
  filter: (url: string) => !BLOCKED_PATHS.some((path) => url.includes(path)),
};

export default linking;
