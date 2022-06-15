import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import styles from './bitfiStyles.module.scss';


import BitfiLogo from 'assets/images/bitfi_logo.png';

const BITFI_LOGO_SIZE = 240;

const BUTTON_SIZE_PROP = 'large';
const BUTTON_VARIANT_PROP = 'contained';
const BUTTON_COLOR_PROP = 'primary';
const BUTTON_CUSTOM_COLOR_PROP = '#521e8a';

interface IConnectProps {
  message: string,
  error: string,
  code: string,
  onBack: () => void
}

function ConnectBitfiView({ onBack, message, error, code }: IConnectProps) {
  const BlueButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(BUTTON_CUSTOM_COLOR_PROP),
      backgroundColor: BUTTON_CUSTOM_COLOR_PROP,
      '&:hover': {
        backgroundColor: BUTTON_CUSTOM_COLOR_PROP,
      },
    },
  }))(Button);

  return (
    <div className={styles.content}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <img src={BitfiLogo} alt="bitfi_logo" width={BITFI_LOGO_SIZE} height={BITFI_LOGO_SIZE} />
        </div>
        <div className={styles.instructions}>
          <span className={styles.text}>
            {message.charAt(0).toUpperCase() + message.slice(1)}.
          </span>
        </div>
        {error}
        <div className={styles.footer}>
          <BlueButton
            style={{ textTransform: 'none' }}
            onClick={onBack}
            className={styles.button}
            size={BUTTON_SIZE_PROP}
            variant={BUTTON_VARIANT_PROP}
            color={BUTTON_COLOR_PROP}>
            Back
          </BlueButton>
        </div>
      </div>
    </div>
  )
}

export default ConnectBitfiView;
