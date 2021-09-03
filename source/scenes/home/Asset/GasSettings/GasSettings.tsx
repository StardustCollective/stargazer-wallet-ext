///////////////////////
// Modules
///////////////////////

import React, { FC, useState, ChangeEvent } from 'react';
import { withStyles } from '@material-ui/core/styles';

///////////////////////
// Images
///////////////////////

import EditIcon from 'assets/images/svg/edit.svg';
import CancelIcon from 'assets/images/svg/cancel.svg';
import Slider from '@material-ui/core/Slider';
import darkGreenCheck from 'assets/images/svg/dark-green-check.svg'

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

// Strings
const GWEI_STRING = 'GWEI';
const CANCEL_BUTTON_STRING = 'Cancel';
const SPEED_UP_BUTTON_STRING = 'Speed Up';
const FEE_STRING = 'Fee ~= $';
const SPEED_STRING = 'Speed:';
const TRANSACTION_UPDATED_STRING = 'Transaction updated';
const KEEP_STRING = 'Keep';
const CANCEL_TRANSACTION_STRING = 'Cancel Transaction';
const CANCEL_TRANSACTION_PROMPT_STRING = `Transaction will still process, 
but its value will be set at zero “0”.`
// Props
const SLIDER_STEP_PROP = 1;
const SLIDER_LABEL_DISPLAY_PROP = 'off';

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
    setViewState(GAS_SETTINGS_STATE_ENUM.CANCEL);
  }

  const onEditButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.SETTINGS);
  }

  const onSettingCancelButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.OPTIONS);
  }

  const onSpeedUpConfirmButtonClicked = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.UPDATED);
  }

  const onKeepButtonClicked = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.OPTIONS);
  }

  const onCancelTransactionButtonClicked = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.NONE);
  }

  const handleChange = (_event: ChangeEvent<{}>, value: number | number[]) => {
    setGasValue(value as number);
    setFee(value as number * 1.22);
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
                      {GWEI_STRING}
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
                    step={SLIDER_STEP_PROP}
                    valueLabelDisplay={SLIDER_LABEL_DISPLAY_PROP}
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
                    onClick={onSpeedUpConfirmButtonClicked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {viewState === GAS_SETTINGS_STATE_ENUM.UPDATED &&
        <div className={styles.updated}>
          <div className={styles.box}>
            <img src={'/'+darkGreenCheck} />
            <span>{TRANSACTION_UPDATED_STRING}</span>
          </div>
        </div>
      }
      {viewState === GAS_SETTINGS_STATE_ENUM.CANCEL &&
        <div className={styles.cancel}>
          <div className={styles.box}>
            <div className={styles.content}>
              <div className={styles.header}>
                <span>{CANCEL_TRANSACTION_STRING}?</span>
              </div>
              <div className={styles.body}>
                <span>
                  {CANCEL_TRANSACTION_PROMPT_STRING}
                </span>
              </div>
              <div className={styles.footer}>
                <div>
                  <OutlineButton
                    label={KEEP_STRING}  
                    type={BUTTON_TYPE_ENUM.OUTLINE}
                    onClick={onKeepButtonClicked}
                  />
                </div>
                <div>
                  <OutlineButton
                    label={CANCEL_TRANSACTION_STRING}
                    onClick={onCancelTransactionButtonClicked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  );

}

export default GasSettings;