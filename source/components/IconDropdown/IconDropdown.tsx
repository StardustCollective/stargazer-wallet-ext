import React, { FC } from 'react';
import clsx from 'clsx';
import TextV3 from 'components/TextV3';
import IIconDropdown from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './IconDropdown.scss';

const IconDropdown: FC<IIconDropdown> = ({ options }): JSX.Element => {
  const { icon, items, isOpen = false, onPress } = options;

  const containerSelected = isOpen && styles.containerSelected;

  return (
    <div onClick={onPress} className={styles.container}>
      <div className={clsx(styles.iconContainer, containerSelected)}>{icon}</div>
      {isOpen && (
        <div className={styles.listContainer}>
          {!!items &&
            items.map((item) => {
              return (
                <div
                  key={item.id}
                  className={styles.itemContainer}
                  onClick={item.onPressItem}
                >
                  {!!item?.icon && (
                    <div className={styles.itemIconContainer}>{item.icon}</div>
                  )}
                  <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                    {item.label}
                  </TextV3.CaptionStrong>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default IconDropdown;
