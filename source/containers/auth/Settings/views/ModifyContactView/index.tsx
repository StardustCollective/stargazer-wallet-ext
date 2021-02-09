import Button from 'components/Button';
import TextInput from 'components/TextInput';
import React, { FC } from 'react';

import styles from './index.scss';

interface IModifyContactView {
  type: 'add' | 'edit';
  showId?: string;
}

const ModifyContactView: FC<IModifyContactView> = () => {
  return (
    <div className={styles.wrapper}>
      <span>Contact Name</span>
      <TextInput fullWidth variant={styles.input} />
      <span>Address</span>
      <TextInput fullWidth variant={styles.input} />
      <span>Memo</span>
      <TextInput fullWidth multiline variant={styles.textarea} />
      <div className={styles.actions}>
        <Button type="button" variant={styles.cancel}>
          Cancel
        </Button>
        <Button type="button" variant={styles.save}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ModifyContactView;
