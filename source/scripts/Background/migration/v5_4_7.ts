import { saveState } from 'state/localStorage';

import { reload } from 'utils/browser';
import { sanitizeLogo } from 'utils/dappLogo';

const VERSION = '5.4.7';

const MigrateRunner = async (oldState: any) => {
  try {
    const oldWhitelist: Record<string, any> = oldState.dapp?.whitelist ?? {};

    // Drop the removed dapp.current and pin every entry's origin to its key (SGW-919).
    const whitelist = Object.keys(oldWhitelist).reduce<Record<string, any>>((acc, id) => {
      acc[id] = { id, origin: id, logo: sanitizeLogo(oldWhitelist[id]?.logo) };
      return acc;
    }, {});

    const newState = {
      ...oldState,
      dapp: { whitelist },
      vault: {
        ...oldState.vault,
        version: VERSION,
      },
    };

    await saveState(newState);
    console.log(`Migrate to <v${VERSION}> successfully!`);
    reload();
  } catch (error) {
    console.log(`<v${VERSION}> Migration Error`);
    console.log(error);
  }
};

export default MigrateRunner;
