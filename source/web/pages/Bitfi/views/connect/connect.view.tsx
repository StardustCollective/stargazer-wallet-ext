/////////////////////////
// Module Imports
/////////////////////////

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles'

/////////////////////////
// Components Imports
/////////////////////////

import Button from '@material-ui/core/Button';

/////////////////////////
// Image Imports
/////////////////////////

import LedgerIcon from 'assets/images/svg/ledger.svg';


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

/////////////////////////
// Interface
/////////////////////////

interface IConnectProps {
  onConnectClick: (deviceId: string) => void
}

/////////////////////////
// Component
/////////////////////////

function Connect(props: IConnectProps) {

  const [deviceId, setDeviceId] = useState<string>('')
  const [error, setError] = useState<string>('')
  /////////////////////////
  // Callbacks
  /////////////////////////

  const onClick = () => {
    try {
      if (Buffer.from(deviceId, 'hex').length !== 3) {
        throw new Error('Invalid device ID')
      }
  
      if (props.onConnectClick) {
        props.onConnectClick(deviceId);
      }
  
    }
    catch (exc) {
      //@ts-ignore
      setError(JSON.stringify(exc.message ||exc))
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
        <div className={styles.instructions}>
          <h2 style={{ marginBottom: '15px' }}>Bitfi signin</h2>
          <span style={{ marginBottom: '15px', paddingTop: '0px', fontSize: '15px' }}>
            Connect your hardware device and click the <br/>"Connect to Bitfi" button below.
          </span>
          <input
            style={{ height: '30px', width: '100px', textAlign: 'center' }}
            value={deviceId} 
            onChange={(e) => setDeviceId(e.target.value)} 
            placeholder='FFFFFF'
          />
        </div>
        
        {error}
        <div>
          <BlueButton
            style={{textTransform: 'none'}}
            onClick={onClick}
            className={styles.button}
            size={BUTTON_SIZE_PROP}
            variant={BUTTON_VARIANT_PROP}
            color={BUTTON_COLOR_PROP}>
            {CONNECT_TO_LEDGER_STRING}
          </BlueButton>
        </div>
      </div>
    </div>
  );
}

export default Connect;
