///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import Button from 'components/Button';
import Layout from '../../../common/Layout';

///////////////////////////
// Styles
///////////////////////////

import styles from './../styles.scss';

///////////////////////////
// Types
///////////////////////////

import IRemindPhrase from './types';

///////////////////////////
// Scenes
///////////////////////////

const RemindPhrase: FC<IRemindPhrase> = ({ nextHandler }) => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Layout title={`Let's create your\nrecovery phrase`}>
      <span className="body-description">
        A recovery phrase is a series of 12 words in a specific order. This word
        combination is unique to your wallet. Make sure to have pen and paper ready so you
        can write it down.
      </span>
      <div className={styles.buttonContainer}>
        <Button
          id="remindPhrase-startButton"
          type="button"
          variant={styles.start}
          onClick={nextHandler}
        >
          Start
        </Button>
      </div>
    </Layout>
  );
};

export default RemindPhrase;
