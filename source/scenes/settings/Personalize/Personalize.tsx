import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import Switch from '@material-ui/core/Switch';
import { IPersonalize } from './types';
import { TITLE, ITEM_TEXT } from './constants';
import styles from './Personalize.scss';

const Personalize: FC<IPersonalize> = ({ hidden, toggleHideElpacaCard }) => {
  return (
    <div className={styles.wrapper}>
      <TextV3.CaptionStrong
        color={COLORS_ENUMS.SECONDARY_TEXT}
        extraStyles={styles.title}
      >
        {TITLE}
      </TextV3.CaptionStrong>
      <div className={styles.cardContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
          {ITEM_TEXT}
        </TextV3.CaptionStrong>
        <Switch
          checked={hidden || false}
          color={'primary'}
          onChange={toggleHideElpacaCard}
        />
      </div>
    </div>
  );
};

export default Personalize;
