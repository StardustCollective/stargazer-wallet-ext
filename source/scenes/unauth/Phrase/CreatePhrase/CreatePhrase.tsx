///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import Button from 'components/Button';
import Layout from 'scenes/common/Layout';

///////////////////////////
// Styles
///////////////////////////

import styles from '../styles.scss';

///////////////////////////
// Types
///////////////////////////

import ICreatePhrase from './types';

///////////////////////////
// Scene
///////////////////////////

const CreatePhrase: FC<ICreatePhrase> = ({
  title,
  description,
  nextHandler,
  phrases,
  passed,
}) => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Layout title={title}>
      <div className="body-description mb-30">{description}</div>
      {!passed && phrases && (
        <ul className={styles.generated}>
          {phrases.split(' ').map((phrase: string, index: number) => (
            <li key={phrase}>
              <span className="t-gray-medium">{String(index + 1).padStart(2, '0')}.</span>
              <span id="createPhrase-phrase">{phrase}</span>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.buttonContainer}>
        <Button
          id="createPhrase-confirmButton"
          type="button"
          onClick={nextHandler}
          variant={clsx(styles.written, { [styles.passed]: passed })}
        >
          {passed ? "Let's do it" : "I've written it down"}
        </Button>
      </div>
    </Layout>
  );
};

export default CreatePhrase;
