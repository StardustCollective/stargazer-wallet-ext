import React, { FC } from 'react';

import styles from './CircleIcon.scss';

interface ICircleIcon {
  logo: string;
  label: string;
}

const CircleIcon: FC<ICircleIcon> = ({ logo, label }) => {

  return (
    <div className={styles.logoWrapper}>
      <img src={logo} alt={label} height="23" />
    </div>
  );

}

export default CircleIcon;