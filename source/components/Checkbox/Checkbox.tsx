import React, { FC } from 'react';
import Checked from 'assets/images/svg/checkbox-checked.svg';
import Unchecked from 'assets/images/svg/checkbox-unchecked.svg';
import { ICheckbox } from './types';

const Checkbox: FC<ICheckbox> = ({ active, size = 24, onPress }) => {
  return (
    <div onClick={onPress}>
      {active ? (
        <img src={`/${Checked}`} height={size} width={size} alt="Checked" />
      ) : (
        <img src={`/${Unchecked}`} height={size} width={size} alt="Unchecked" />
      )}
    </div>
  );
};

export default Checkbox;
