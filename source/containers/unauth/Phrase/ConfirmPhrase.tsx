import React, { useState, useCallback } from 'react';
import Button from 'components/Button';
import CheckIcon from 'assets/images/svg/check.svg';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'state/store';
import { useHistory } from 'react-router-dom';
import shuffle from 'lodash/shuffle';
import isEqual from 'lodash/isEqual';
import { authUser, loginUser } from 'state/auth';

import Layout from '../Layout';

import styles from './index.scss';

const ConfirmPhrase = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { phrases, isAuth } = useSelector((state: RootState) => state.auth);
  const [orgList, setOrgList] = useState<Array<string>>(shuffle(phrases));
  const [newList, setNewList] = useState<Array<string>>([]);
  const [passed, setPassed] = useState(isAuth);
  const title = passed
    ? `Your Wallet is ready`
    : `Verify your recovery\nphrase`;

  const isNotEqualArrays = useCallback((): boolean => {
    return !isEqual(phrases, newList);
  }, [phrases, newList]);

  const handleOrgPhrase = (idx: number) => {
    const tempList = [...orgList];
    setNewList([...newList, orgList[idx]]);
    tempList.splice(idx, 1);
    setOrgList([...tempList]);
    isNotEqualArrays();
  };

  const handleNewPhrase = (idx: number) => {
    const tempList = [...newList];
    setOrgList([...orgList, newList[idx]]);
    tempList.splice(idx, 1);
    setNewList([...tempList]);
    isNotEqualArrays();
  };

  const handleConfirm = () => {
    if (!passed) {
      setPassed(true);
    } else {
      dispatch(authUser());
      dispatch(loginUser());
      history.push('/app.html');
    }
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
        disabled={isNotEqualArrays()}
        onClick={handleConfirm}
      >
        {passed ? 'Next' : 'Validate'}
      </Button>
    </Layout>
  );
};

export default ConfirmPhrase;
