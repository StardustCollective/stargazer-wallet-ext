const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

const extraNodeModules = {
  source: path.resolve(__dirname + '/../'),
  navigation: path.resolve(__dirname + '/../navigation'),
  dag4: path.resolve(__dirname + '/../dag4'),
  scenes: path.resolve(__dirname + '/../scenes'),
  hooks: path.resolve(__dirname + '/../hooks'),
  components: path.resolve(__dirname + '/../components'),
  constants: path.resolve(__dirname + '/../constants'),
  context: path.resolve(__dirname + '/../context'),
  selectors: path.resolve(__dirname + '/../selectors'),
  state: path.resolve(__dirname + '/../state'),
  types: path.resolve(__dirname + '/../types'),
  utils: path.resolve(__dirname + '/../utils'),
  assets: path.resolve(__dirname + '/../assets'),
  scripts: path.resolve(__dirname + '/../scripts'),
  web: path.resolve(__dirname + '/../web'),
  // TODO-migration: check if we need these
  // process: nodeModules.process,
  // crypto: nodeModules.crypto,
  // stream: nodeModules.stream,
  // http: nodeModules.http,
  // https: nodeModules.https,
  // os: nodeModules.os,
  fs: require.resolve('react-native-fs'),
  'react-native': require.resolve('react-native-web'),
};

const nodeModulesPaths = [
  path.resolve(__dirname + '/node_modules'),
  path.resolve(__dirname + '/../../node_modules'),
];

const watchFolders = [
  path.resolve(__dirname + '/../../source'),
  path.resolve(__dirname + '/../../node_modules'),
];

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve(
      'react-native-svg-transformer/react-native',
    ),
  },
  resolver: {
    extraNodeModules,
    nodeModulesPaths,
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
  // This is required for monorepo setup
  // https://reactnative.dev/blog/2023/12/06/0.73-debugging-improvements-stable-symlinks#monorepo-workarounds
  watchFolders,
};

module.exports = mergeConfig(defaultConfig, config);
