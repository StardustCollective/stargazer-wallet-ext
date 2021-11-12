// global.process: Not the best solution, but good for now to make React Native happy.
global.process = {
  version : '',
  env: {
    NODE_ENV : '',
  }
}

global.localStorage = require('@react-native-async-storage/async-storage').default;
