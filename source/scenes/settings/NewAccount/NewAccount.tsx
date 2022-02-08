import React, { FC } from 'react';
import clsx from 'clsx';

import SeedIcon from '@material-ui/icons/Description';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import TextInput from 'components/TextInput';
import Icon from 'components/Icon';
import Button from 'components/Button';

import styles from './NewAccount.scss';
// import { MAIN_VIEW, PHRASE_VIEW } from '../routes';

import INewAccountSettings from './types';

const NewAccount: FC<INewAccountSettings> = ({
  onClickResetStack,
  onShowPhraseClick,
  onSubmit,
  handleSubmit,
  register,
  accountName,
  loading,
}) => {
  return (
    <div className={styles.newAccount}>
      {accountName ? (
        <>
          <span>{`Your new account ${accountName} has been created`}</span>
          <label>Backup Options</label>
          <section id="newAccount-showRecoveryPhrase" className={styles.menu} onClick={onShowPhraseClick}>
            <Icon Component={SeedIcon} />
            <span>Show Recovery Phrase</span>
            <ArrowIcon />
          </section>
          <span>If you lose access to this wallet, your funds will be lost, unless you back up!</span>
          <div className={clsx(styles.actions, styles.centered)}>
            <Button id="addWallet-finishButton" type="button" variant={styles.button} onClick={onClickResetStack}>
              Finish
            </Button>
          </div>
        </>
      ) : (
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
            <Button id="newAccount-confirmButton" type="submit" variant={styles.button} loading={loading}>
              Next
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewAccount;
