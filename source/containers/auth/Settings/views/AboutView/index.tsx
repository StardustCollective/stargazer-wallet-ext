import React, { FC } from 'react';

import clsx from 'clsx';
import styles from './index.scss';

import PACKAGE from '../../../../../../manifest.json';

function majorMinor (version: string) {
  const v = version.split('.');
  if (v.length > 2) {
    v.pop();
  }
  return v.join('.');
}

const AboutView: FC = () => {
  return (
    <div className={styles.about}>
      <span>Stargazer Wallet Chrome Extension v{majorMinor(PACKAGE.version)}</span>
      <span>Version: {PACKAGE.version}</span>
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
      <span>
        Terms and Conditions:
        <a
          className={clsx(styles.link, styles.terms)}
          href="https://www.stargazer.network/assets/static/terms.html"
          target="_blank"
        >
          https://www.stargazer.network/.../terms.html
        </a>
      </span>
    </div>
  );
};

export default AboutView;
