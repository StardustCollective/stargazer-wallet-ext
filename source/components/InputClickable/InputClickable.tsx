///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

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

const InputClickable: FC<IInputClickable> = ({
  options,
  titleStyles = {},
}): JSX.Element => {
  const { title, value, items, onClick, disabled = false, labelRight = '' } = options;

  const selectedItem = items.find((item: any) => item.value === value);

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <div className={styles.container}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={titleStyles}>
        {title}
      </TextV3.CaptionStrong>
      <div
        onClick={disabled ? null : onClick}
        className={clsx(styles.inputContainer, { [styles.cursorPointer]: !disabled })}
      >
        {!!selectedItem?.icon && (
          <div className={styles.iconContainer}>
            <img className={styles.icon} src={selectedItem.icon} />
          </div>
        )}
        <div className={styles.titleContainer}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {selectedItem?.label}
          </TextV3.CaptionStrong>
        </div>
        {!!labelRight ? (
          <TextV3.CaptionRegular extraStyles={styles.labelRight}>
            {labelRight}
          </TextV3.CaptionRegular>
        ) : (
          <img
            src={`/${ArrowRightIcon}`}
            color="white"
            height={ICON_SIZE}
            width={ICON_SIZE}
            alt="arrow"
          />
        )}
      </div>
    </div>
  );
};

export default InputClickable;
