///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

///////////////////////////
// Components
///////////////////////////

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
  onClosePress,
}) => {
  const RenderHeader = () => {
    if (title.align === TITLE_ALIGNMENT.LEFT) {
      return (
        <>
          <View style={styles.headerLabel}>
            <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
              {title.label}
            </TextV3.BodyStrong>
          </View>
          <TouchableOpacity onPress={onClosePress} style={styles.headerCloseButton}>
            <CloseIcon width={ICON_SIZE} height={ICON_SIZE} />
          </TouchableOpacity>
        </>
      );
    } else if (title.align === TITLE_ALIGNMENT.CENTER) {
      return (
        <>
          <View style={styles.headerColumnOne}></View>
          <View style={styles.headerColumnTwo}>
            <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
              {title.label}
            </TextV3.BodyStrong>
          </View>
          <TouchableOpacity onPress={onClosePress} style={styles.headerColumnThree}>
            <CloseIcon width={ICON_SIZE} height={ICON_SIZE} />
          </TouchableOpacity>
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
      backdropOpacity={0.66}
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
        </View>
      </View>
    </Modal>
  );
};

export default Sheet;
