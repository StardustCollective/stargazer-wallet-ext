///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import Icon from 'components/Icon';
import ChevronRight from 'assets/images/svg/arrow-rounded-right.svg';
import CheckIcon from 'assets/images/svg/check-transparent.svg';

///////////////////////
// Types
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import IMenu from './types';

///////////////////////
// Styles
///////////////////////

import styles from './Menu.scss';

///////////////////////
// Constants
///////////////////////

const ICON_SIZE = 14;

const Menu: FC<IMenu> = ({ items, title, titleStyles, containerStyle }): JSX.Element => {
  ///////////////////////
  // Render
  ///////////////////////

  return (
    <div className={clsx(styles.container, containerStyle)}>
      {!!title && (
        <TextV3.Caption
          color={COLORS_ENUMS.BLACK}
          dynamic
          extraStyles={clsx(styles.title, titleStyles)}
        >
          {title}
        </TextV3.Caption>
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
            data,
            showArrow = true,
            rightIcon,
            selected = false,
          } = item;

          const titleTextStyle = subtitle ? styles.smallTitle : styles.largeTitle;

          return (
            <div
              key={item.title}
              className={clsx(
                styles.itemContainer,
                i === 0 && styles.firstChild,
                i === items.length - 1 && styles.lastChild,
                disabled && styles.disabled
              )}
              onClick={disabled ? null : () => onClick(data)}
            >
              {!!icon &&
                typeof icon === 'string' &&
                (icon.startsWith('http') ? (
                  <div className={styles.walletIcon}>
                    <img src={icon} width={36} height={36} />
                  </div>
                ) : (
                  <Icon width={36} Component={icon} />
                ))}
              {!!title && (
                <div className={styles.contentContainer}>
                  <TextV3.LabelSemiStrong
                    color={COLORS_ENUMS.BLACK}
                    extraStyles={clsx(titleTextStyle, item.titleStyles)}
                  >
                    {title}
                  </TextV3.LabelSemiStrong>
                  {!!subtitle && (
                    <TextV3.Caption
                      color={COLORS_ENUMS.BLACK}
                      extraStyles={clsx(styles.subtitle, item.subtitleStyles)}
                    >
                      {subtitle}
                    </TextV3.Caption>
                  )}
                </div>
              )}
              {!!labelRight && (
                <TextV3.LabelSemiStrong
                  color={COLORS_ENUMS.BLACK}
                  extraStyles={clsx(styles.labelRight, item.labelRightStyles)}
                >
                  {labelRight}
                </TextV3.LabelSemiStrong>
              )}
              {!!showArrow && (
                <div className={styles.arrowContainer}>
                  <img src={`/${ChevronRight}`} height={ICON_SIZE} width={ICON_SIZE} />
                </div>
              )}
              {!!rightIcon && <div className={styles.iconContainer}>{rightIcon}</div>}
              {!!selected && (
                <div className={styles.iconContainer}>
                  <img src={`/${CheckIcon}`} className={styles.checkIcon} />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Menu;
