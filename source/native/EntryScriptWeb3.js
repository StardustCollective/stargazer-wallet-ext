import RNFS from 'react-native-fs';
import {iosPlatform} from 'utils/platform';

const EntryScriptWeb3 = {
  entryScriptWeb3: null,
  // Cache injectedScript.bundle so that it is immediately available
  async init() {
    this.entryScriptWeb3 = iosPlatform()
      ? await RNFS.readFile(
          `${RNFS.MainBundlePath}/injectedScript.bundle.js`,
          'utf8',
        )
      : await RNFS.readFileAssets(`injectedScript.bundle.js`);

    return this.entryScriptWeb3;
  },
  async get() {
    // Return from cache
    if (this.entryScriptWeb3) return this.entryScriptWeb3;

    // If for some reason it is not available, get it again
    return await this.init();
  },
};

export default EntryScriptWeb3;
