/// ////////////////////
// Modules
/// ////////////////////

import React, { ChangeEvent, FC } from 'react';
import Slider from '@material-ui/core/Slider';

/// ////////////////////
// Styles
/// ////////////////////

import { withStyles } from '@material-ui/core/styles';

const PSlider = withStyles({
  root: {
    color: '#473194',
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

/// ////////////////////
// Types
/// ////////////////////

type IPurpleSliderProps = {
  defaultValue: number;
  max: number;
  min: number;
  onChange: (_event: ChangeEvent<{}>, value: number | number[]) => void;
  step: number;
  value: number;
};

/// ////////////////////
// Constants
/// ////////////////////

const SLIDER_LABEL_DISPLAY_PROP = 'off';

/// ////////////////////
// Component
/// ////////////////////

const PurpleSlider: FC<IPurpleSliderProps> = ({
  onChange,
  min,
  max,
  value,
  defaultValue,
  step,
}) => {
  return (
    <PSlider
      onClick={(ev) => {
        ev.stopPropagation();
      }}
      onChange={onChange}
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      step={step}
      valueLabelDisplay={SLIDER_LABEL_DISPLAY_PROP}
    />
  );
};

export default PurpleSlider;
