import React, { useState } from 'react';
import CreatePass from './CreatePass';
import ImportPhrase from './ImportPhrase';
import { IMPORT_TYPE } from './ImportPhrase/ImportPhrase.container';

const Import = () => {
  const [registered, setRegistered] = useState(false);

  return registered ? (
    <CreatePass />
  ) : (
    <ImportPhrase
      type={IMPORT_TYPE.RESTORE}
      title="Restore Stargazer Wallet"
      buttonTitle="Restore"
      onImportPhraseSuccess={() => setRegistered(true)}
    />
  );
};

export default Import;
