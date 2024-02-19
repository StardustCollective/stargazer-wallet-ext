import React, { FC } from 'react';
import MUISlider, { SliderProps } from '@material-ui/core/Slider';

import styles from './Slider.scss';

interface ISlider extends Partial<SliderProps> {
  variant?: string;
}

const Slider: FC<ISlider> = ({ variant, ...otherProps }) => {
  return (
    <MUISlider className={variant} classes={{ thumb: styles.thumb }} {...otherProps} />
  );
};

export default Slider;
