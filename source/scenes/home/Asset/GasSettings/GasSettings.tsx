///////////////////////
// Modules
///////////////////////

import React, { FC, useState, ChangeEvent } from 'react';
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
    border: '2px solid #fff',
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

const CANCEL_BUTTON_STRING = 'Cancel';
const SPEED_UP_BUTTON_STRING = 'Speed Up';
const FEE_STRING = 'Fee ~= $'
const SPEED_STRING = 'Speed:'

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

enum BUTTON_TYPE_ENUM {
  SOLID = 1,
  OUTLINE,
}

///////////////////////
// Interfaces
///////////////////////

interface IOutlineButtonProps {
  label: string;
  onClick: () => void;
  type?: BUTTON_TYPE_ENUM;
}

interface ICircleIconButtonProps {
  iconPath: string;
  iconSize?: number;
  onClick?: () => void;
}

interface IGasSettingsProps {
  values: {
    min: number;
    max: number;
    current: number;
  }
}

///////////////////////
// Component
///////////////////////

const GasSettings: FC<IGasSettingsProps> = ({ values }) => {

  ///////////////////////
  // Hooks
  ///////////////////////

  const [viewState, setViewState] = useState<GAS_SETTINGS_STATE_ENUM>(GAS_SETTINGS_STATE_ENUM.OPTIONS);
  const [gasValue, setGasValue] = useState<number>(values.current);
  const [fee, setFee] = useState<number>(1.44);
  const [speed, setSpeed] = useState<string>('Slow');

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

  const onSettingCancelButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.OPTIONS)
  }

  const handleChange = (_event: ChangeEvent<{}>, value: number) => {
    setGasValue(value);
    setFee(value*1.22);
    setSpeed(value < 500 ? 'Slow' : 'Fast')
  };

  ///////////////////////
  // Renders
  ///////////////////////

  const OutlineButton: FC<IOutlineButtonProps> = ({ label, type, onClick }) => {

    let cssStyle = styles.solidButton;

    if (type === BUTTON_TYPE_ENUM.OUTLINE) {
      cssStyle = styles.outlineButton;
    }

    return (
      <div onClick={onClick} className={cssStyle}>
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
            label={SPEED_UP_BUTTON_STRING}
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
                    <span>
                      {gasValue}
                    </span>
                    <span>
                      GWEI
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.body}>
                <div className={styles.body__slider}>
                  <PurpleSlider
                    onChange={handleChange}
                    min={values.min}
                    max={values.max}
                    step={1}
                    valueLabelDisplay="off"
                  />
                </div>
                <div className={styles.body__sliderLabels}>
                  <div>
                    <span>{FEE_STRING}{fee}</span>
                  </div>
                  <div>
                    <span>{SPEED_STRING} {speed}</span>
                  </div>
                </div>
              </div>
              <div className={styles.footer}>
                <div className={styles.footer__cancelButton}>
                  <OutlineButton
                    label={CANCEL_BUTTON_STRING}  
                    type={BUTTON_TYPE_ENUM.OUTLINE}
                    onClick={onSettingCancelButtonClick}
                  />
                </div>
                <div className={styles.footer__speedUpButton}>
                  <OutlineButton
                    label={SPEED_UP_BUTTON_STRING}
                    onClick={() => {}}
                  />
                </div>
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