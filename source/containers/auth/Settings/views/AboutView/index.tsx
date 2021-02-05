import React, { FC } from 'react';

import styles from './index.scss';

const AboutView: FC = () => {
  return (
    <div className={styles.about}>
      <span>Stargazer Wallet Chrome Extension v1.0</span>
      <span>Version: 1.0</span>
      <span>
        Support:{' '}
        <a
          className={styles.link}
          href="https://t.me/StardustSupport"
          target="_blank"
        >
          https://t.me/StardustSupport
        </a>
      </span>
      <span>Terms of use: </span>
    </div>
  );
};

export default AboutView;
