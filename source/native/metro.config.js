const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

// Root directory of the monorepo
const rootDir = path.resolve(__dirname, '../..');

// Resolve node-libs-react-native from root since it's not nohoisted
const nodeLibsPath = path.resolve(
  rootDir,
  'node_modules/node-libs-react-native',
);
const nodeModules = require(nodeLibsPath);

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
  // Node.js core module polyfills for React Native
  process: require.resolve('process/browser.js'),
  crypto: require.resolve('react-native-quick-crypto'),
  stream: nodeModules.stream,
  http: nodeModules.http,
  https: nodeModules.https,
  os: nodeModules.os,
  fs: require.resolve('react-native-fs'),
  // React is resolved from the native workspace via nohoist
  react: path.resolve(__dirname + '/node_modules/react'),
  'react-native': path.resolve(__dirname + '/node_modules/react-native'),
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
 * Metro configuration for React Native 0.74.7 in a monorepo
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  transformer: {
    babelTransformerPath: require.resolve(
      'react-native-svg-transformer/react-native',
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules,
    nodeModulesPaths,
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    // Exclude web workspace's node_modules and React Native packages from root
    blockList: exclusionList([
      // Exclude web workspace node_modules entirely
      /\/source\/web\/node_modules\/.*/,
      // Exclude ALL react-native packages from root node_modules (use native's versions)
      new RegExp(`${rootDir}/node_modules/react/.*`),
      new RegExp(`${rootDir}/node_modules/react-native/.*`),
      new RegExp(`${rootDir}/node_modules/react-native-.*/.*`),
      new RegExp(`${rootDir}/node_modules/@react-native/.*`),
      new RegExp(`${rootDir}/node_modules/@react-native-.*/.*`),
    ]),
    disableHierarchicalLookup: false,
  },
  watchFolders,
};

module.exports = mergeConfig(defaultConfig, config);
