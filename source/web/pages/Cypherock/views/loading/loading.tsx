import React from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { ReactComponent as SpinnerIcon } from 'assets/images/svg/spinner.svg';
import { ReactComponent as CypherockLogo } from 'assets/images/svg/cypherock-animated.svg';
import styles from './styles.scss';

const LoadingView = ({ text }: { text: string }) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerContainer}>
        <SpinnerIcon className={styles.spinnerSvg} />
        <CypherockLogo className={styles.cypherockLogo} />
      </div>

      <TextV3.Header extraStyles={styles.text} align={TEXT_ALIGN_ENUM.CENTER}>
        {text}
      </TextV3.Header>
    </div>
  );
};

export default LoadingView;
