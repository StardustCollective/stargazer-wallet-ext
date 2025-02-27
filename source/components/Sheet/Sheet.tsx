import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import { BottomSheet } from 'react-spring-bottom-sheet';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
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
  snaps = [300, 500],
  isVisible,
  showCloseButton = false,
  onClosePress,
}) => {
  const TitleComponent =
    typeof title?.label === 'string' ? (
      <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>{title.label}</TextV3.BodyStrong>
    ) : (
      title.label
    );

  const RenderHeader = () => {
    if (title.align === TITLE_ALIGNMENT.LEFT) {
      return (
        <>
          <div>{TitleComponent}</div>
          {!showCloseButton && (
            <div onClick={onClosePress} className={styles.headerCloseButton}>
              <img src={`/${CloseIcon}`} className={styles.closeIcon} />
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <BottomSheet open={isVisible} onDismiss={onClosePress} snapPoints={() => snaps}>
      <div className={styles.sheetContainer}>
        <div className={styles.sheetHeader}>
          <RenderHeader />
        </div>
        <div className={styles.sheetContent}>{children}</div>
        {showCloseButton && (
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
            size={BUTTON_SIZES_ENUM.SMALL}
            label="Close"
            onClick={onClosePress}
            extraStyle={styles.closeButton}
          />
        )}
      </div>
    </BottomSheet>
  );
};

export default Sheet;
