/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';
import { withStyles } from '@material-ui/core/styles'

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
const CONNECT_TO_BITFI_STRING = 'Connect to Bitfi';
const BITFI_LOGO_ALT = 'bitfi_icon';
// Numbers 
const BITFI_LOGO_SIZE = 180;

/////////////////////////
// Interface
/////////////////////////

interface IConnectProps {
  onConnectClick: React.MouseEventHandler<HTMLButtonElement>
}

/////////////////////////
// Component
/////////////////////////

function Connect(props: IConnectProps) {


  /////////////////////////
  // Callbacks
  /////////////////////////

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    if (props.onConnectClick) {
      props.onConnectClick(event);
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
          <img src={BitfiLogo} alt={BITFI_LOGO_ALT} width={BITFI_LOGO_SIZE} height={BITFI_LOGO_SIZE} />
          <span>
            Turn on your hardware device and connect to wifi, then click<br/>"Connect to Bitfi" button below.
          </span>
        </div>
        <div>
          <BlueButton
            style={{textTransform: 'none'}}
            onClick={onClick}
            className={styles.button}
            size={BUTTON_SIZE_PROP}
            variant={BUTTON_VARIANT_PROP}
            color={BUTTON_COLOR_PROP}>
            {CONNECT_TO_BITFI_STRING}
          </BlueButton>
        </div>
      </div>
    </div>
  );
}

export default Connect;
