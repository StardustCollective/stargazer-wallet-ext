import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import styles from './CardRow.scss';

type ICardRow = {
  label: string;
  value: string | JSX.Element;
};

const CardRow: FC<ICardRow> = ({ label, value }) => {
  const renderValue = () => {
    if (typeof value === 'string') {
      return (
        <TextV3.CaptionRegular extraStyles={styles.value}>{value}</TextV3.CaptionRegular>
      );
    }

    return value;
  };

  return (
    <div className={styles.row}>
      <TextV3.CaptionStrong extraStyles={styles.label}>{label}</TextV3.CaptionStrong>
      {renderValue()}
    </div>
  );
};

export default CardRow;
