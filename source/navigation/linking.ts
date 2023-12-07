///////////////////////////
// Routes
///////////////////////////

import routes from './routes';

///////////////////////////
// Linking Configs
///////////////////////////

const config = {
  screens: routes,
};

const linking = {
  prefixes: ['https://', 'http://', 'stargazer://'],
  config,
};

export default linking;
