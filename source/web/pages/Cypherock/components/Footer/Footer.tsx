import React from 'react';
import ButtonV3, { BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import styles from './Footer.scss';
import { BUTTON_TYPES_ENUM } from 'components/ButtonV3';

export type ButtonProps = {
  label: string;
  handleClick: () => void;
  type?: BUTTON_TYPES_ENUM;
  disabled?: boolean;
  loading?: boolean;
};

type FooterProps = {
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
};

const Footer = ({ primaryButton, secondaryButton }: FooterProps) => {
  if (!primaryButton && !secondaryButton) {
    return null;
  }

  return (
    <div className={styles.footer}>
      {secondaryButton && (
        <ButtonV3
          size={BUTTON_SIZES_ENUM.LARGE}
          type={secondaryButton.type || BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          label={secondaryButton.label}
          onClick={secondaryButton.handleClick}
          disabled={secondaryButton.disabled}
          loading={secondaryButton.loading}
          extraStyle={styles.button}
        />
      )}
      {primaryButton && (
        <ButtonV3
          size={BUTTON_SIZES_ENUM.LARGE}
          type={primaryButton.type || BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
          label={primaryButton.label}
          onClick={primaryButton.handleClick}
          disabled={primaryButton.disabled}
          loading={primaryButton.loading}
          extraStyle={styles.button}
        />
      )}
    </div>
  );
};

export default Footer;
