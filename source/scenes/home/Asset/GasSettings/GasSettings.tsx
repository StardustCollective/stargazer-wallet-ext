///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import EditIcon from 'assets/images/svg/edit.svg';
import CancelIcon from 'assets/images/svg/cancel.svg';

///////////////////////
// Styles
///////////////////////

import styles from './GasSettings.scss'

///////////////////////
// Interfaces
///////////////////////

interface IOutlineButtonProps {
  label: string;
}

interface ICircleIconButtonProps {
  iconPath: string;
  iconSize?: number;
}

const GasSettings: FC = () => {

  const OutlineButton: FC<IOutlineButtonProps> = ({ label }) => {

    return (
      <div className={styles.outlineButton}>
        <span>{label}</span>
      </div>
    )
  }

  const CircleIconButton: FC<ICircleIconButtonProps> = ({ iconPath, iconSize = 16}) => {
    return (
      <div className={styles.circleIconButton}>
        <img src={'/'+iconPath} width={iconSize} height={iconSize} />
      </div>
    );
  };

  return (
    <div className={styles.gasSettings}>
      <div className={styles.options}>
        <OutlineButton 
          label={'Speed Up'}
        />
        <CircleIconButton 
          iconPath={EditIcon} 
        />
        <CircleIconButton 
          iconPath={CancelIcon} 
        />
      </div>

    </div>
  );

}

export default GasSettings;