/////////////////////////
// Module Imports
/////////////////////////

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

/////////////////////////
// Components Imports
/////////////////////////

import Button from '@material-ui/core/Button';

/////////////////////////
// Image Imports
/////////////////////////

import BitfiLogo from 'assets/images/bitfi_logo.png';

/////////////////////////
// Styles Imports
/////////////////////////

import styles from './styles.module.scss';

/////////////////////////
// Constants
/////////////////////////

// Properties
const BUTTON_SIZE_PROP = 'large';
const BUTTON_VARIANT_PROP = 'contained';
const BUTTON_COLOR_PROP = 'primary';
const BUTTON_CUSTOM_COLOR_PROP = '#521e8a';
// Strings
const CONNECT_TO_LEDGER_STRING = 'Connect to Bitfi';
// Numbers
const BITFI_LOGO_WIDTH = 200;
const BITFI_LOGO_HEIGHT = 200;

/////////////////////////
// Interface
/////////////////////////

interface IConnectProps {
  onConnectClick: (deviceId: string) => void;
  onConnectError: (error: string) => void;
}

/////////////////////////
// Component
/////////////////////////

function Connect(props: IConnectProps) {
  const [deviceId, setDeviceId] = useState<string>('');

  /////////////////////////
  // Callbacks
  /////////////////////////

  const onClick = () => {
    try {
      if (Buffer.from(deviceId, 'hex').length !== 3) {
        throw new Error('Invalid device ID');
      }

      if (props.onConnectClick) {
        props.onConnectClick(deviceId);
      }
    } catch (exc: any) {
      if (props.onConnectError) {
        props.onConnectError(JSON.stringify(exc.message || exc));
      }
    }
  };

  /////////////////////////
  // Renders
  /////////////////////////

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
        <div className={styles.connect}>
          <div className={styles.logo} style={{ marginBottom: '0px' }}>
            <img
              src={BitfiLogo}
              alt="bitfi_logo"
              width={BITFI_LOGO_WIDTH}
              height={BITFI_LOGO_HEIGHT}
            />
          </div>
          <div className={styles.instructions}>
            <span className={styles.text}>
              1. Connect your Bitfi device to WiFi.
              <br />
              2. Enter your Device ID below.
              <br />
              3. Click "Connect to Bitfi" button.
            </span>
          </div>
          <div className={styles.deviceId}>
            <input
              className={styles.input}
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Device ID"
            />
          </div>
        </div>
        <div>
          <BlueButton
            style={{ textTransform: 'none' }}
            onClick={onClick}
            className={styles.button}
            size={BUTTON_SIZE_PROP}
            variant={BUTTON_VARIANT_PROP}
            color={BUTTON_COLOR_PROP}
          >
            {CONNECT_TO_LEDGER_STRING}
          </BlueButton>
        </div>
      </div>
    </div>
  );
}

export default Connect;
