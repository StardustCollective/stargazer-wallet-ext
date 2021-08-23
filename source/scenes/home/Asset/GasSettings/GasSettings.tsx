///////////////////////
// Modules
///////////////////////

import React, { FC, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';

///////////////////////
// Components
///////////////////////

import EditIcon from 'assets/images/svg/edit.svg';
import CancelIcon from 'assets/images/svg/cancel.svg';
import Slider from '@material-ui/core/Slider';

///////////////////////
// Styles
///////////////////////

import styles from './GasSettings.scss'

const PurpleSlider = withStyles({
  root: {
    color: '#521E8A',
    height: 4,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 4,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
})(Slider);

///////////////////////
// Constants
///////////////////////

const SPEED_UP_STRING = 'Speed Up';

///////////////////////
// Enums
///////////////////////

enum GAS_SETTINGS_STATE_ENUM {
  NONE = 1,
  OPTIONS,
  SETTINGS,
  CANCEL,
  UPDATED,
}

///////////////////////
// Interfaces
///////////////////////

interface IOutlineButtonProps {
  label: string;
  onClick: () => void;
}

interface ICircleIconButtonProps {
  iconPath: string;
  iconSize?: number;
  onClick?: () => void;
}

interface IGasSettingsProps {
  isVisible: boolean
}

///////////////////////
// Component
///////////////////////

const GasSettings: FC<IGasSettingsProps> = ({isVisible}) => {
  
  ///////////////////////
  // Hooks
  ///////////////////////

  const [viewState, setViewState] = useState(GAS_SETTINGS_STATE_ENUM.NONE);
  const [gasValue, setGasValue] = useState(33);

  useEffect(() => {
    if(isVisible){
      setViewState(GAS_SETTINGS_STATE_ENUM.SETTINGS)
    }
  }, [])

  ///////////////////////
  // Callbacks
  ///////////////////////

  const onSpeedUpButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.SETTINGS);
  }

  const onCancelButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.CANCEL)
  }

  const onEditButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.SETTINGS)
  }

  const handleChange = (event, newValue) => {
    setGasValue(newValue);
  };

  ///////////////////////
  // Renders
  ///////////////////////

  const OutlineButton: FC<IOutlineButtonProps> = ({ label, onClick }) => {

    return (
      <div onClick={onClick} className={styles.outlineButton}>
        <span>{label}</span>
      </div>
    )
  }

  const CircleIconButton: FC<ICircleIconButtonProps> = ({ 
    iconPath, 
    iconSize = 16,
    onClick
  }) => {
    return (
      <div onClick={onClick} className={styles.circleIconButton}>
        <img src={'/' + iconPath} width={iconSize} height={iconSize} />
      </div>
    );
  };

  return (
    <div className={styles.gasSettings}>
      {viewState === GAS_SETTINGS_STATE_ENUM.OPTIONS &&
        <div className={styles.options}>
          <OutlineButton
            label={SPEED_UP_STRING}
            onClick={onSpeedUpButtonClick}
          />
          <CircleIconButton
            iconPath={EditIcon}
            onClick={onEditButtonClick}
          />
          <CircleIconButton
            iconPath={CancelIcon}
            onClick={onCancelButtonClick}
          />
        </div>
      }
      {viewState === GAS_SETTINGS_STATE_ENUM.SETTINGS &&
        <div className={styles.settings}>
          <div className={styles.box}>
            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <span>Gas Price</span>
                </div>
                <div className={styles.headerRight}>
                  <div>
                    <input pattern='[0-9]{0,3}' maxLength={4} value={gasValue} defaultValue={gasValue} />
                    <span>
                      GWEI
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <PurpleSlider 
                  onChange={handleChange}
                  valueLabelDisplay="off" 
                  aria-label="pretto slider" 
                  defaultValue={gasValue} 
                />
              </div>
            </div>
          </div>
        </div>
      }
      {viewState === GAS_SETTINGS_STATE_ENUM.UPDATED &&
        <div>
          <span>Transaction Updated</span>
        </div>
      }
      {viewState === GAS_SETTINGS_STATE_ENUM.CANCEL &&
        <div>
          <span>Cancel Transaction</span>
        </div>
      }

    </div>
  );

}

export default GasSettings;