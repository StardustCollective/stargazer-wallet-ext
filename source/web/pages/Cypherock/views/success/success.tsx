import React from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { ReactComponent as CircleCheck } from 'assets/images/svg/circle-check.svg';
import styles from './styles.scss';

const SuccessView = ({ text }: { text: string }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <CircleCheck className={styles.icon} />
      </div>

      <TextV3.Header extraStyles={styles.text} align={TEXT_ALIGN_ENUM.CENTER}>
        {text}
      </TextV3.Header>
    </div>
  );
};

export default SuccessView;
