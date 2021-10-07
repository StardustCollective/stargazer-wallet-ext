///////////////////////
// Modules
///////////////////////

import React, { ChangeEvent, FC } from 'react';
import Slider from '@material-ui/core/Slider';

///////////////////////
// Styles
///////////////////////

import { withStyles } from '@material-ui/core/styles';

const PSlider = withStyles({
  root: {
    color: '#2B1D52',
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
// Types
///////////////////////

type IPurpleSliderProps = {
  onChange: (_event: ChangeEvent<{}>, value: number | number[]) => void,
  min: number,
  max: number,
  defaultValue: number,
  step: number,
}

///////////////////////
// Constants
///////////////////////

const SLIDER_LABEL_DISPLAY_PROP = 'off';


///////////////////////
// Component
///////////////////////

const PurpleSlider: FC<IPurpleSliderProps> = ({
  onChange,
  min,
  max,
  defaultValue,
  step,
}) => {

  return (
    <PSlider
    onChange={onChange}
    min={min}
    max={max}
    defaultValue={defaultValue}
    step={step}
    valueLabelDisplay={SLIDER_LABEL_DISPLAY_PROP}
  />
  );

}


export default PurpleSlider;