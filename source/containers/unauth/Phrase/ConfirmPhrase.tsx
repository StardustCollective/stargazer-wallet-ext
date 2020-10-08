import React, { useState } from 'react';
import Button from 'components/Button';
import CheckIcon from 'assets/images/svg/check.svg';

import Layout from '../Layout';

import { TEST_PHRASES } from './consts';
import styles from './index.scss';

const ConfirmPhrase = () => {
  const [orgList, setOrgList] = useState<Array<string>>(TEST_PHRASES);
  const [newList, setNewList] = useState<Array<string>>([]);
  const [passed, setPassed] = useState(false);
  const title = passed
    ? `Your Wallet is ready`
    : `Verify your recovery\nphrase`;

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

  const nextHandler = () => {
    setPassed(true);
  };

  return (
    <Layout title={title} linkTo="/create/phrase/generated">
      {passed && (
        <img src={`/${CheckIcon}`} className={styles.checked} alt="Success" />
      )}
      <div className="body-description">
        {passed
          ? 'You should now have your recovery phrase and your wallet password written down for future reference.'
          : 'Select the words in the correct order.'}
      </div>
      {!passed && (
        <>
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
        </>
      )}
      <Button
        type="button"
        variant={passed ? styles.start : styles.validate}
        disabled={newList.length !== 12}
        onClick={nextHandler}
      >
        {passed ? 'Next' : 'Validate'}
      </Button>
    </Layout>
  );
};

export default ConfirmPhrase;
