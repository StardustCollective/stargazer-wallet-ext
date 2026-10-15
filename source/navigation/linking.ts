///////////////////////////
// Routes
///////////////////////////

import { getStateFromPath } from '@react-navigation/native';
import routes from './routes';
import screens from './screens';

///////////////////////////
// Linking Configs
///////////////////////////

const config = {
  screens: routes,
};

// Screens that reveal or remove secrets must never be reachable from an external link
const BLOCKED_SCREENS = [screens.settings.checkPassword, screens.settings.removeWallet];

type NavState = { routes?: { name: string; state?: NavState }[] };

const containsBlockedScreen = (state?: NavState): boolean =>
  !!state?.routes?.some(
    (route) => BLOCKED_SCREENS.includes(route.name) || containsBlockedScreen(route.state)
  );

// Match on the parsed route, not the raw URL: getStateFromPath normalizes the path
// (e.g. collapses repeated slashes), so a substring check can be bypassed.
const isAllowedUrl = (url: string) => {
  try {
    const path = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
    return !containsBlockedScreen(getStateFromPath(path, config) as NavState);
  } catch (err) {
    return false;
  }
};

const linking = {
  prefixes: ['stargazer://'],
  config,
  filter: isAllowedUrl,
};

export default linking;
