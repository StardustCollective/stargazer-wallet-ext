import React, { FC } from 'react';

import styles from './index.scss';

const AboutView: FC = () => {
  return (
    <div className={styles.about}>
      <span>Stargazer Wallet Chrome Extension v1.0</span>
      <span>About: </span>
      <span>Release date: 2021/02/01</span>
      <span>Team: </span>
      <span>Contact: </span>
    </div>
  );
};

export default AboutView;
