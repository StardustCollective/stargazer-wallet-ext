import React, { useState } from 'react';
import Button from 'components/Button';

import Layout from '../Layout';

import { TEST_PHRASES } from './consts';
import styles from './index.scss';

const ConfirmPhrase = () => {
  const [orgList, setOrgList] = useState<Array<string>>(TEST_PHRASES);
  const [newList, setNewList] = useState<Array<string>>([]);

  const handleOrgPhrase = (idx: number) => {
    const tempList = [...orgList];
    setNewList([...newList, orgList[idx]]);
    tempList.splice(idx, 1);
    setOrgList([...tempList]);
  };

  const handleNewPhrase = (idx: number) => {
    const tempList = [...newList];
    setOrgList([...orgList, newList[idx]]);
    tempList.splice(idx, 1);
    setNewList([...tempList]);
  };

  return (
    <Layout
      title={`Verify your recovery\nphrase`}
      linkTo="/create/phrase/generated"
    >
      <div className="body-description">
        Select the words in the correct order.
      </div>
      <section className={styles.topzone}>
        {newList.map((phrase, idx) => (
          <Button
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
        {orgList.map((phrase, idx) => (
          <Button
            key={phrase}
            type="button"
            variant={styles.phrase}
            onClick={() => handleOrgPhrase(idx)}
          >
            {phrase}
          </Button>
        ))}
      </section>
      <Button type="button" variant={styles.validate}>
        Validate
      </Button>
    </Layout>
  );
};

export default ConfirmPhrase;
