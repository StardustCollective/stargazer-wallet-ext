import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from './bitfiStyles.module.scss';
import BitfiUserGuide from 'assets/images/bitfi-user-guide.png';

const BUTTON_SIZE_PROP = 'large';
const BUTTON_VARIANT_PROP = 'contained';
const BUTTON_COLOR_PROP = 'primary';
const BUTTON_CUSTOM_COLOR_PROP = '#521e8a';
const BITFI_USER_GUIDE_WIDTH = 360;
const BITFI_USER_GUIDE_HEIGHT = 130;

interface IConnectProps {
  message: string;
  error: string;
  code: string;
  onBack: () => void;
}

function ConnectBitfiView({ onBack, message, code, error }: IConnectProps) {
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
        {code ? (
          <div className={styles.code}>
            <span className={styles.text}>{code.toUpperCase()}</span>
          </div>
        ) : (
          <div style={{ marginTop: '0px', marginBottom: '50px' }}>
            <img
              src={BitfiUserGuide}
              alt="bitfi_user_guide"
              width={BITFI_USER_GUIDE_WIDTH}
              height={BITFI_USER_GUIDE_HEIGHT}
            />
          </div>
        )}

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
            color={BUTTON_COLOR_PROP}
          >
            Back
          </BlueButton>
        </div>
      </div>
    </div>
  );
}

export default ConnectBitfiView;
