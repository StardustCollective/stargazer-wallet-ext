///////////////////////
// Modules
///////////////////////
import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////
// Styles
///////////////////////
import styles from './About.scss';

///////////////////////
// Types
///////////////////////
import IAboutSettings from './types';

const About: FC<IAboutSettings> = ({
  version,
  versionMajorMinor,
  supportLabel,
  supportLink,
  termsLabel,
  termsLink,
  privacyLabel,
  privacyLink,
}) => {
  return (
    <div className={styles.about}>
      <span>Stargazer Wallet Chrome Extension v{versionMajorMinor}</span>
      <span>Version: {version}</span>
      <span>
        Support:{' '}
        <a className={styles.link} href={supportLink} target="_blank">
          {supportLabel}
        </a>
      </span>
      <span>
        Terms and Conditions:
        <a className={clsx(styles.link, styles.terms)} href={termsLink} target="_blank">
          {termsLabel}
        </a>
      </span>
      <span>
        Privacy:
        <a className={clsx(styles.link, styles.terms)} href={privacyLink} target="_blank">
          {privacyLabel}
        </a>
      </span>
    </div>
  );
};

export default About;
