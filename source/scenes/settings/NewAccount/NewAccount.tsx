///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import TextInput from 'components/TextInput';
import Button from 'components/Button';

///////////////////////////
// Styles
///////////////////////////

import styles from './NewAccount.scss';

///////////////////////////
// Types
///////////////////////////

import INewAccountSettings from './types';

const NewAccount: FC<INewAccountSettings> = ({
  onClickResetStack,
  onSubmit,
  handleSubmit,
  register,
}) => {
  return (
    <div className={styles.newAccount}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <span id="newAccount-nameAccountText">Please name your new account:</span>
        <TextInput
          id="newAccount-accountNameInput"
          type="text"
          name="name"
          fullWidth
          variant={styles.input}
          inputRef={register}
        />
        <div className={styles.actions}>
          <Button
            id="newAccount-cancelButton"
            type="button"
            theme="secondary"
            variant={clsx(styles.button, styles.close)}
            onClick={onClickResetStack}
          >
            Close
          </Button>
          <Button id="newAccount-confirmButton" type="submit" variant={styles.button}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewAccount;
