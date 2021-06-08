import React, { useState, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import Button from 'components/Button';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { useHistory } from 'react-router-dom';
import shuffle from 'lodash/shuffle';
import isEqual from 'lodash/isEqual';
import { useController } from 'hooks/index';

import Layout from '../../common/Layout';

import styles from './index.scss';

const ConfirmPhrase = () => {
  const history = useHistory();
  const controller = useController();
  const phrases = controller.wallet.onboardHelper.getSeedPhrase();
  const [orgList] = useState<Array<string>>(
    shuffle((phrases || '').split(' '))
  );
  const [checkList, setCheckList] = useState<Array<boolean>>(
    new Array(12).fill(true)
  );
  const [newList, setNewList] = useState<Array<string>>([]);
  const [passed, setPassed] = useState(false);
  const title = passed
    ? `Your Wallet is ready`
    : `Verify your recovery\nphrase`;

  const isNotEqualArrays = useMemo((): boolean => {
    if (!phrases) return true;
    return !isEqual(phrases.split(' '), newList);
  }, [phrases, newList]);

  const handleSetPhrase = (idx: number) => {
    const checkNewList = [...checkList];
    if (checkNewList[idx]) {
      setNewList([...newList, orgList[idx]]);
    } else {
      const newIdx = newList.indexOf(orgList[idx]);
      const tempList = [...newList];
      tempList.splice(newIdx, 1);
      setNewList([...tempList]);
    }
    checkNewList[idx] = !checkNewList[idx];
    setCheckList([...checkNewList]);
  };

  const handleOrgPhrase = (idx: number) => {
    handleSetPhrase(idx);
  };

  const handleNewPhrase = (idx: number) => {
    const orgIdx = orgList.indexOf(newList[idx]);
    handleSetPhrase(orgIdx);
  };

  const handleConfirm = async () => {
    if (!passed) {
      setPassed(true);
    } else {
      await controller.wallet.createWallet('Main Wallet', phrases, true);
      controller.wallet.onboardHelper.reset();
      history.push('/app.html');
    }
  };

  const handleKeydown = (ev: KeyboardEvent) => {
    console.log(ev);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <Layout title={title} linkTo="/create/phrase/generated">
      {passed && <CheckIcon className={styles.checked} />}
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
      <Button
        type="button"
        variant={passed ? styles.start : styles.validate}
        disabled={isNotEqualArrays}
        onClick={handleConfirm}
      >
        {passed ? 'Next' : 'Validate'}
      </Button>
    </Layout>
  );
};

export default ConfirmPhrase;
