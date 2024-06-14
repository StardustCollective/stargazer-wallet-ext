///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import Button from 'components/Button';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './index.module.scss';

///////////////////////////
// Hooks Imports
///////////////////////////

import dappSelectors from 'selectors/dappSelectors';

///////////////////////////
// Types
///////////////////////////

type ICardLayoutProps = {
  stepLabel: string;
  originDescriptionLabel: string;
  headerLabel: string;
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

const CardLayout: FC<ICardLayoutProps> = ({
  stepLabel,
  originDescriptionLabel,
  headerLabel,
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
  const origin = current && current.origin;

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  return (
    <div className={styles.wrapper}>
      <div className={styles.topCircle} />
      <div className={styles.content}>
        <div className={styles.stepsLabel}>
          <TextV3.Caption>{stepLabel}</TextV3.Caption>
        </div>
        <div className={styles.heading}>
          <img className={styles.logo} src={current.logo} />
          <div className={styles.originLabel}>
            <TextV3.BodyStrong color={COLORS_ENUMS.WHITE}>
              {originDescriptionLabel}
            </TextV3.BodyStrong>
            <TextV3.Body color={COLORS_ENUMS.WHITE}>{origin}</TextV3.Body>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <TextV3.Header color={COLORS_ENUMS.BLACK}>{headerLabel}</TextV3.Header>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>{captionLabel}</TextV3.Caption>
            </div>
            <div className={styles.cardBody}>{children}</div>
            <div className={styles.cardFooter}>
              <TextV3.Caption color={COLORS_ENUMS.BLACK} align={TEXT_ALIGN_ENUM.CENTER}>
                {footerLabel}
              </TextV3.Caption>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            theme="secondary"
            variant={clsx(styles.action, styles.negativeAction)}
            onClick={onNegativeButtonClick}
          >
            {negativeButtonLabel}
          </Button>
          <Button
            type="button"
            onClick={onPositiveButtonClick}
            variant={styles.action}
            disabled={isPositiveButtonDisabled}
          >
            {positiveButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardLayout;
