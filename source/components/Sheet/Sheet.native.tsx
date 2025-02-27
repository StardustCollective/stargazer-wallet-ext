///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

///////////////////////////
// Components
///////////////////////////

import ButtonV3 from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import CloseIcon from 'assets/images/svg/close.svg';

///////////////////////////
// Types
///////////////////////////

import { ISheet } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from '../ButtonV3/ButtonV3.native';

const ICON_SIZE = 16;
export const TITLE_ALIGNMENT = {
  LEFT: 'left',
  CENTER: 'center',
};

///////////////////////////
// Component
///////////////////////////

const Sheet: FC<ISheet> = ({
  children,
  title = {
    label: 'Lorem Ipsum',
    align: TITLE_ALIGNMENT.LEFT,
  },
  height = '50%',
  isVisible,
  showCloseButton = false,
  backdropOpacity = 0.66,
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
          <View style={styles.headerLabel}>{TitleComponent}</View>
          {!showCloseButton && (
            <TouchableOpacity onPress={onClosePress} style={styles.headerCloseButton}>
              <CloseIcon width={ICON_SIZE} height={ICON_SIZE} />
            </TouchableOpacity>
          )}
        </>
      );
    } else if (title.align === TITLE_ALIGNMENT.CENTER) {
      return (
        <>
          <View style={styles.headerColumnOne}></View>
          <View style={styles.headerColumnTwo}>{TitleComponent}</View>
          {!showCloseButton && (
            <TouchableOpacity onPress={onClosePress} style={styles.headerColumnThree}>
              <CloseIcon width={ICON_SIZE} height={ICON_SIZE} />
            </TouchableOpacity>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={onClosePress}
      backdropOpacity={backdropOpacity}
      swipeDirection={['down']}
      useNativeDriverForBackdrop
      onSwipeComplete={onClosePress}
      propagateSwipe={true}
      statusBarTranslucent
    >
      <View style={{ height }}>
        <View style={styles.sheet}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          <View style={styles.headerContainer}>
            <RenderHeader />
          </View>
          <View style={styles.children}>{children}</View>
          {showCloseButton && (
            <ButtonV3
              type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
              size={BUTTON_SIZES_ENUM.SMALL}
              title="Close"
              onPress={onClosePress}
              extraContainerStyles={styles.closeButton}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Sheet;
