import React, { useState } from 'react';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import CheckIcon from 'assets/images/svg/check.svg';

import Layout from '../Layout';

import styles from './CreatePass.scss';

const CreatePass = () => {
  const [passed, setPassed] = useState(false);
  const title = passed
    ? `Password set\nsuccessfully!`
    : `Let's create a \npassword for your\nStargazer Wallet`;
  const comment = passed
    ? `You can now see your balance and transaction history, send and receive DAG`
    : `DO NOT FORGET to save your password.\nYou will need this Password to unlock your wallet.`;

  return (
    <Layout title={title}>
      {passed ? (
        <img src={`/${CheckIcon}`} className={styles.checked} alt="Success" />
      ) : (
        <>
          <TextInput
            type="password"
            placeholder="Please enter at least 9 characters"
            fullWidth
            visiblePassword
            variant={styles.pass}
          />
          <TextInput
            type="password"
            placeholder="Please enter your password again"
            fullWidth
            visiblePassword
            variant={styles.repass}
          />
        </>
      )}
      <span className="body-comment">{comment}</span>
      <Button
        type="button"
        variant={styles.next}
        onClick={() => setPassed(true)}
      >
        Next
      </Button>
    </Layout>
  );
};

export default CreatePass;
