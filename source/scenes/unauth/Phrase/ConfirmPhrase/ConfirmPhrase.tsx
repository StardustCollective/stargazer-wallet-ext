///////////////////////////
// Imports
///////////////////////////

import React, { FC, useEffect } from 'react';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import Button from 'components/Button';
import CheckIcon from '@material-ui/icons/CheckCircle';
import Layout from 'scenes/common/Layout';

///////////////////////////
// Styles
///////////////////////////

import styles from '../styles.scss';

///////////////////////////
// Types
///////////////////////////

import IConfirmPhrase from './types';

///////////////////////////
// Scene
///////////////////////////

const ConfirmPhrase: FC<IConfirmPhrase> = ({
  title,
  isButtonDisabled,
  passed,
  orgList,
  newList,
  checkList,
  handleOrgPhrase,
  handleNewPhrase,
  handleConfirm,
}) => {
  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const handleKeydown = (ev: KeyboardEvent) => {
    if (ev.code === 'Enter') {
      handleConfirm();
    }
  };

  ///////////////////////////
  // Hooks
  ///////////////////////////

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [passed]);

  ///////////////////////////
  // Renders
  ///////////////////////////

  return (
    <Layout title={title}>
      {passed && <CheckIcon className={styles.checked} />}
      <div className="body-description">
        {passed
          ? 'You should now have your recovery phrase and your wallet password written down for future reference.'
          : 'Select the words in the correct order.'}
      </div>
      {!passed && (
        <>
          <section className={styles.topzone}>
            {newList.map((phrase: string, idx: number) => (
              <Button
                id={phrase}
                key={phrase}
                type="button"
                variant={`${styles.phrase} ${styles.selected}`}
                onClick={() => handleNewPhrase(idx)}
              >
                {phrase}
              </Button>
            ))}
          </section>
          <section className={styles.bottomzone}>
            {orgList.map((phrase: string, idx: number) => (
              <Button
                id={phrase}
                key={phrase}
                type="button"
                variant={clsx(styles.phrase, {
                  [styles.active]: !checkList[idx],
                })}
                onClick={() => handleOrgPhrase(idx)}
              >
                {phrase}
              </Button>
            ))}
          </section>
        </>
      )}
      <div className={styles.buttonContainer}>
        <Button
          id="confirmPhrase-confirmButton"
          type="button"
          variant={passed ? styles.start : styles.validate}
          disabled={isButtonDisabled}
          onClick={handleConfirm}
        >
          {passed ? 'Next' : 'Validate'}
        </Button>
      </div>
    </Layout>
  );
};

export default ConfirmPhrase;
