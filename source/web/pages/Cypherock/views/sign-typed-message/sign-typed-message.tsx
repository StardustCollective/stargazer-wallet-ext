import React from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import styles from './styles.scss';

const SignTypedMessageView = () => {
  return (
    <div className={styles.container}>
      <TextV3.Header extraStyles={styles.text} align={TEXT_ALIGN_ENUM.CENTER}>
        Sign Typed Message
      </TextV3.Header>
    </div>
  );
};

export default SignTypedMessageView;
