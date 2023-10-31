import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import WarningIcon from 'assets/images/svg/warning.svg';
import { IAttributeItem } from './types';
import styles from './WarningMessages.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

const AttributeItem: FC<IAttributeItem> = ({ type, value }) => {
  console.log({ type, value });
  return (
    <div className={styles.container}>
      <img src={`/${WarningIcon}`} className={styles.warningIcon} />
      <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK} extraStyles={styles.warningText}>
        {value}
      </TextV3.CaptionRegular>
    </div>
  );
};

export default AttributeItem;
