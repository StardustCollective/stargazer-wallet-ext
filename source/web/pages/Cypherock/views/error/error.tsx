import React from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { ReactComponent as TriangleExclamation } from 'assets/images/svg/triangle-exclamation.svg';
import styles from './styles.scss';

const ErrorView = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className={styles.container}>
      <TriangleExclamation className={styles.errorIcon} />

      <TextV3.HeaderLargeRegular
        extraStyles={styles.title}
        align={TEXT_ALIGN_ENUM.CENTER}
      >
        {title}
      </TextV3.HeaderLargeRegular>
      <TextV3.Body extraStyles={styles.description} align={TEXT_ALIGN_ENUM.CENTER}>
        {description}
      </TextV3.Body>
    </div>
  );
};

export default ErrorView;
