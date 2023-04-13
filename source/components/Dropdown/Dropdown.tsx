///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down.svg';
import CheckIcon from 'assets/images/svg/check-transparent.svg';

///////////////////////
// Types
///////////////////////

import IDropdown from './types';

///////////////////////
// Styles
///////////////////////

import styles from './Dropdown.scss';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const MAX_ITEMS = 3;

const Dropdown: FC<IDropdown> = ({ options }): JSX.Element => {
  const { icon, title, value, items, isOpen, toggleItem, onChange } = options;

  const selectedValue = items.find(item => item.value === value);
  const scrollContainer = items?.length > MAX_ITEMS ? styles.itemScrollable : {};

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <div onClick={toggleItem} className={styles.container}>
      {!!icon && 
        <div className={styles.iconContainer}>
          <img className={styles.icon} src={icon}/>
        </div>
      }
      <div className={styles.titleContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{title}</TextV3.CaptionStrong>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{selectedValue?.label}</TextV3.Caption>
      </div>
      <div>
        {isOpen ? (
            <img src={`/${ArrowUpIcon}`} />
          ) : (
            <img src={`/${ArrowDownIcon}`} />
        )}
      </div>
      {isOpen && (
        <div className={clsx(styles.listContainer, scrollContainer)}>
          {!!items && items.map((item) => {
            const selected = item.value === value;
            const selectedStyle = selected ? styles.selectedItem : {};
            const TextComponent = selected ? TextV3.CaptionStrong : TextV3.CaptionRegular;
            return (
              <div key={item.value} className={clsx(styles.itemContainer, selectedStyle)} onClick={() => onChange(item.value)}>
                <TextComponent color={COLORS_ENUMS.BLACK}>
                  {item.label}  
                </TextComponent>
                {!!selected && <img src={`/${CheckIcon}`} className={styles.checkIcon} />}
              </div>
            )})
          }
        </div>
      )}
    </div>
  );
};

export default Dropdown;
