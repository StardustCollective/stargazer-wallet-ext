import React from 'react';
import Button from 'components/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPhrases } from 'state/auth';
import { dag } from '@stardust-collective/dag-wallet-sdk';

import Layout from '../Layout';

import styles from './index.scss';

const RemindPhrase = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const generatePhrases = () => {
    dispatch(setPhrases(dag.keyStore.generateSeedPhrase().split(' ')));
    history.push('/create/phrase/generated');
  };

  return (
    <Layout
      title={`First, let's create your\nrecovery phrase`}
      linkTo="/create/pass"
    >
      <span className="body-description">
        A recovery phrase is a series of 12 words in a specific order. This word
        combination is unique to your wallet. Make sure to have pen and paper
        ready so you can write it down.
      </span>

      <Button type="button" variant={styles.start} onClick={generatePhrases}>
        Start
      </Button>
    </Layout>
  );
};

export default RemindPhrase;
