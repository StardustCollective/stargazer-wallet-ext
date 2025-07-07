import { reload } from 'utils/browser';
import { saveState } from 'state/localStorage';

const VERSION = '5.3.7';

const MigrateRunner = async (oldState: any) => {
  try {
    const newState = {
      ...oldState,
      vault: {
        ...oldState.vault,
        version: VERSION,
      },
    };
    // Remove user from state
    delete newState.user;

    await saveState(newState);
    console.log(`Migrate to <${VERSION}> successfully!`);
    reload();
  } catch (error) {
    console.log(`<${VERSION}> Migration Error`);
    console.log(error);
  }
};

export default MigrateRunner;
