import React, { useState } from 'react';
import CreatePass from './CreatePass';
import ImportPhrase from './ImportPhrase';
import { IMPORT_TYPE } from './ImportPhrase/ImportPhrase.container';

const Import = ({ route }: { route: any }) => {
  const shouldNavigate = route.params.navigate;
  const [registered, setRegistered] = useState(false);

  return registered ? (
    <CreatePass shouldNavigate={shouldNavigate} />
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
