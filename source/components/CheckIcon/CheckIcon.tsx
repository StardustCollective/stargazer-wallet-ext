///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import Check from '@material-ui/icons/Check';

///////////////////////////
// Styles
///////////////////////////

import styles from './CheckIcon.scss';

///////////////////////////
// Component
///////////////////////////

const CheckIcon: FC = () => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return <Check className={styles.icon} />;
};

export default CheckIcon;
