/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';
import { withStyles } from '@material-ui/core/styles'

/////////////////////////
// Components Imports
/////////////////////////

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

/////////////////////////
// Icons Imports
/////////////////////////

import UsbIcon from '@material-ui/icons/Usb';

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
const CONNECT_TO_LEDGER_STRING = 'connect to Ledger';

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

    if(props.onConnectClick){
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
    <CardContent>
      <CardActions>
        <BlueButton 
          onClick={onClick} 
          className={styles.button} 
          size={BUTTON_SIZE_PROP} 
          variant={BUTTON_VARIANT_PROP} 
          color={BUTTON_COLOR_PROP}>
          <UsbIcon />&nbsp;{CONNECT_TO_LEDGER_STRING}
        </BlueButton>
      </CardActions>
    </CardContent>
  );
}

export default Connect;
