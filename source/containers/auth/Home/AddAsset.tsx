import React, { useState } from 'react';

import TextInput from 'components/TextInput';
import styles from './AddAsset.scss';

const AddAsset = () => {
  const [tokenName, setTokenName] = useState('');

  return (
    <section className={styles.addAsset}>
      <TextInput
        placeholder="Search by name ticker or contract"
        fullWidth
        value={tokenName}
        name="address"
        // inputRef={register}
        onChange={(e) => setTokenName(e.target.value)}
        // variant={addressInputClass}
      />
    </section>
  );
};

export default AddAsset;
