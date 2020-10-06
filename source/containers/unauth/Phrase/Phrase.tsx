import React, { useState } from 'react';

import CreatePhrase from './CreatePhrase';
import ConfirmPhrase from './ConfirmPhrase';

const MnemonicPhrase = () => {
  const [checked, setChecked] = useState(false);
  return checked ? (
    <ConfirmPhrase />
  ) : (
    <CreatePhrase onCheck={() => setChecked(true)} />
  );
};

export default MnemonicPhrase;
