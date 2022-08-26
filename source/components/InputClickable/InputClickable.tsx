///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ArrowRightIcon from 'assets/images/svg/arrow-rounded-right.svg';

///////////////////////
// Types
///////////////////////

import IInputClickable from './types';

///////////////////////
// Styles
///////////////////////

import styles from './InputClickable.scss';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const ICON_SIZE = 16;

const InputClickable: FC<IInputClickable> = ({ options }): JSX.Element => {
  const { title, value, items, onClick } = options;

  const selectedItem = items.find((item: any) => item.value === value);

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <div className={styles.container}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{title}</TextV3.CaptionStrong>
      <div onClick={onClick} className={styles.inputContainer}>
        {!!selectedItem?.icon && 
          <div className={styles.iconContainer}>
            <img className={styles.icon} src={selectedItem.icon} />
          </div>
        }
        <div className={styles.titleContainer}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{selectedItem?.label}</TextV3.CaptionStrong>
        </div>
        <img src={`/${ArrowRightIcon}`} color="white" height={ICON_SIZE} width={ICON_SIZE} alt="arrow" />
      </div>
    </div>
  );
};

export default InputClickable;
