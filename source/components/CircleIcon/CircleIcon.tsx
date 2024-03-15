import React, { FC } from 'react';

import styles from './CircleIcon.scss';

interface ICircleIcon {
  label: string;
  logo: string;
}

const CircleIcon: FC<ICircleIcon> = ({ logo, label }) => {
  const uri = logo?.startsWith('http') ? logo : `/${logo}`;

  return (
    <div className={styles.logoWrapper}>
      <img src={uri} alt={label} className={styles.logo} />
    </div>
  );
};

export default CircleIcon;
