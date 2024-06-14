///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './index.module.scss';

///////////////////////////
// Hooks Imports
///////////////////////////

import { useSelector } from 'react-redux';
import dappSelectors from 'selectors/dappSelectors';

///////////////////////////
// Types
///////////////////////////

type ICardLayoutV2Props = {
  stepLabel: string;
  headerLabel: string;
  headerInfo?: React.ReactChild | React.ReactChild[];
  footerLabel?: string;
  captionLabel: string;
  negativeButtonLabel: string;
  onNegativeButtonClick: () => void;
  positiveButtonLabel: string;
  onPositiveButtonClick: () => void;
  isPositiveButtonDisabled?: boolean;
  children: React.ReactChild | React.ReactChild[];
};

///////////////////////////
// View
///////////////////////////

const CardLayoutV2: FC<ICardLayoutV2Props> = ({
  stepLabel,
  headerLabel,
  headerInfo,
  footerLabel = 'Only connect with sites you trust.',
  captionLabel,
  negativeButtonLabel,
  onNegativeButtonClick,
  positiveButtonLabel,
  onPositiveButtonClick,
  isPositiveButtonDisabled,
  children,
}) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const current = useSelector(dappSelectors.getCurrent);

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.stepContainer}>
          <TextV3.Caption color={COLORS_ENUMS.WHITE}>{stepLabel}</TextV3.Caption>
        </div>
        <img className={styles.headerLogo} src={current?.logo} />
        <div className={styles.headerTitle}>
          <TextV3.Header color={COLORS_ENUMS.WHITE}>{headerLabel}</TextV3.Header>
          <TextV3.Caption color={COLORS_ENUMS.WHITE}>{captionLabel}</TextV3.Caption>
        </div>
        <div className={styles.headerContent}>{headerInfo}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardBody}>{children}</div>
        </div>
        <div className={styles.footerLabel}>
          <TextV3.Caption
            color={COLORS_ENUMS.BLACK}
            align={TEXT_ALIGN_ENUM.CENTER}
            extraStyles={styles.footerText}
          >
            {footerLabel}
          </TextV3.Caption>
        </div>
      </div>
      <div className={styles.actions}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          size={BUTTON_SIZES_ENUM.MEDIUM}
          extraStyle={styles.button}
          label={negativeButtonLabel}
          onClick={onNegativeButtonClick}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.MEDIUM}
          label={positiveButtonLabel}
          onClick={onPositiveButtonClick}
          disabled={isPositiveButtonDisabled}
        />
      </div>
    </div>
  );
};

export default CardLayoutV2;
