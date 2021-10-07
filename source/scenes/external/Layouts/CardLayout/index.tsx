///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './index.module.scss';

///////////////////////////
// Hooks Imports
///////////////////////////

import { useController } from 'hooks/index';

///////////////////////////
// Types
///////////////////////////

type ICardLayoutProps = {
  stepLabel: string;
  originDescriptionLabel: string;
  headerLabel: string;
  captionLabel: string;
  negativeButtonLabel: string,
  onNegativeButtonClick: () => void,
  positiveButtonLabel: string,
  onPositiveButtonClick: () => void,
  children: | React.ReactChild
  | React.ReactChild[],
}


///////////////////////////
// View
///////////////////////////

const CardLayout: FC<ICardLayoutProps> = ({
  stepLabel,
  originDescriptionLabel,
  headerLabel,
  captionLabel,
  negativeButtonLabel,
  onNegativeButtonClick,
  positiveButtonLabel,
  onPositiveButtonClick,
  children,
}) => {

  ///////////////////////////
  // Hooks
  ///////////////////////////

  const controller = useController();
  const current = controller.dapp.getCurrent();
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
            <TextV3.Body color={COLORS_ENUMS.WHITE}>
              {origin}
            </TextV3.Body>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <TextV3.Header color={COLORS_ENUMS.BLACK}>
                {headerLabel}
              </TextV3.Header>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                {captionLabel}
              </TextV3.Caption>
            </div>
            <div className={styles.cardBody}>
              {children}
            </div>
            <div className={styles.cardFooter}>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                Only connect with sites you trust.
              </TextV3.Caption>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.negativeAction}>
            <ButtonV3
              type={BUTTON_TYPES_ENUM.ACCENT_ONE_OUTLINE}
              size={BUTTON_SIZES_ENUM.LARGE}
              label={negativeButtonLabel}
              extraStyle={styles.negativeButton}
              onClick={onNegativeButtonClick}
            />
          </div>
          <div className={styles.positiveAction}>
            <ButtonV3
              type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
              size={BUTTON_SIZES_ENUM.LARGE}
              label={positiveButtonLabel}
              extraStyle={styles.nextButton}
              onClick={onPositiveButtonClick}
            />
          </div>
        </div>
      </div>

    </div >
  );

};

export default CardLayout;
