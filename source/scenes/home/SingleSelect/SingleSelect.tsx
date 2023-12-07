///////////////////////////
// Imports
///////////////////////////

import React, { FC, useState } from 'react';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import CheckIcon from 'assets/images/svg/check-primary.svg';

///////////////////////////
// Types
///////////////////////////

import { ISingleSelect } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './SingleSelect.scss';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const SingleSelect: FC<ISingleSelect> = ({ data, selected, onSelect }) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const [localSelected, setLocalSelected] = useState(selected);

  const changeSelectedValue = (value: string) => {
    setLocalSelected(value);
    onSelect(value);
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  const renderItem = (item: any) => {
    const isSelected = item.value === localSelected;
    const selectedStyle = !!isSelected ? styles.selectedBorder : {};
    return (
      <div
        key={item.value}
        onClick={() => changeSelectedValue(item.value)}
        className={clsx(styles.itemContainer, selectedStyle)}
      >
        <div className={styles.iconContainer}>
          <img className={styles.icon} src={item.icon} />
        </div>
        <div className={styles.titleContainer}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {item.label}
          </TextV3.CaptionStrong>
        </div>
        {!!isSelected && <img src={`/${CheckIcon}`} width={16} />}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {!!data && data.map((item: any) => renderItem(item))}
    </div>
  );
};

export default SingleSelect;
