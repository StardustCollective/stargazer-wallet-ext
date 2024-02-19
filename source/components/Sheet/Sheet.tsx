import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import { BottomSheet } from 'react-spring-bottom-sheet';
import TextV3 from 'components/TextV3';
import CloseIcon from 'assets/images/svg/close.svg';

///////////////////////////
// Types
///////////////////////////

import { ISheet } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './Sheet.scss';
import 'react-spring-bottom-sheet/dist/style.css';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
export const TITLE_ALIGNMENT = {
  LEFT: 'left',
  CENTER: 'center',
};

const Sheet: FC<ISheet> = ({
  children,
  title = {
    label: 'Lorem Ipsum',
    align: TITLE_ALIGNMENT.LEFT,
  },
  isVisible,
  onClosePress,
}) => {
  const RenderHeader = () => {
    if (title.align === TITLE_ALIGNMENT.LEFT) {
      return (
        <>
          <div>
            <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
              {title.label}
            </TextV3.BodyStrong>
          </div>
          <div onClick={onClosePress} className={styles.headerCloseButton}>
            <img src={`/${CloseIcon}`} className={styles.closeIcon} />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <BottomSheet open={isVisible} onDismiss={onClosePress} snapPoints={() => [300, 500]}>
      <div className={styles.sheetContainer}>
        <div className={styles.sheetHeader}>
          <RenderHeader />
        </div>
        <div className={styles.sheetContent}>{children}</div>
      </div>
    </BottomSheet>
  );
};

export default Sheet;
