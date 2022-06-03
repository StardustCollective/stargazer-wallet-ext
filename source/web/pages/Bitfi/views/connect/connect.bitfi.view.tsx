import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import styles from './styles.module.scss';


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
          <div className={styles.instructions}>
            <h2 style={{ marginBottom: '15px' }}>Bitfi signin</h2>
            <span style={{ marginBottom: '15px', paddingTop: '0px', fontSize: '15px' }}>
              {message}
            </span>
            <span style={{ fontSize: '20px' }}>Please, make sure the code below matches what's displayed on your device</span>
            <h2 style={{ marginBottom: '15px' }}>{code}</h2>
            
          </div>

          {error}
          <div>
          <BlueButton
            style={{textTransform: 'none'}}
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
