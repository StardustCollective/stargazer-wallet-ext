///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ArrowRightIcon from 'assets/images/svg/arrow-rounded-right.svg';
import CheckIcon from 'assets/images/svg/check-transparent.svg';

///////////////////////
// Types
///////////////////////

import IMenu from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const ICON_SIZE = 32;

const Menu: FC<IMenu> = ({ items, title, titleStyles, containerStyle }): JSX.Element => {
  ///////////////////////
  // Render
  ///////////////////////

  return (
    <View style={[styles.container, containerStyle]}>
      {!!title && (
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.BLACK}
          extraStyles={[styles.title, titleStyles]}
        >
          {title}
        </TextV3.CaptionStrong>
      )}
      {!!items.length &&
        items.map((item, i) => {
          const {
            onClick,
            title,
            disabled,
            icon,
            subtitle,
            labelRight,
            labelRightStyles,
            showArrow = true,
            data,
            rightIcon,
            selected = false,
          } = item;
          const itemStyles = StyleSheet.flatten([
            styles.itemContainer,
            i === 0 ? styles.firstChild : {},
            i === items.length - 1 ? styles.lastChild : {},
            disabled && styles.disabled,
          ]);

          const titleTextStyle = !!subtitle ? styles.smallTitle : styles.largeTitle;

          return (
            <TouchableOpacity
              key={item.title}
              style={itemStyles}
              disabled={disabled || false}
              onPress={() => onClick(data)}
              activeOpacity={0.6}
            >
              {!!icon &&
                (typeof icon === 'string' && icon.startsWith('http') ? (
                  <View style={styles.iconContainer}>
                    <Image style={styles.icon} source={{ uri: icon }} />
                  </View>
                ) : (
                  <View style={styles.iconComponent}>{icon}</View>
                ))}
              {!!title && (
                <View style={styles.contentContainer}>
                  <TextV3.LabelSemiStrong
                    color={COLORS_ENUMS.BLACK}
                    extraStyles={[titleTextStyle, item.titleStyles]}
                  >
                    {title}
                  </TextV3.LabelSemiStrong>
                  {!!subtitle && (
                    <TextV3.Caption
                      color={COLORS_ENUMS.BLACK}
                      extraStyles={[styles.subtitle, item.subtitleStyles]}
                    >
                      {subtitle}
                    </TextV3.Caption>
                  )}
                </View>
              )}
              {!!labelRight && (
                <TextV3.LabelSemiStrong
                  extraStyles={[styles.labelRight, labelRightStyles]}
                >
                  {labelRight}
                </TextV3.LabelSemiStrong>
              )}
              {!!showArrow && <ArrowRightIcon width={ICON_SIZE} />}
              {!!selected && <CheckIcon width={ICON_SIZE} />}
              {!!rightIcon && rightIcon}
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default Menu;
