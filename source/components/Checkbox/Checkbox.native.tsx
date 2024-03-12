import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import Checked from 'assets/images/svg/checkbox-checked.svg';
import Unchecked from 'assets/images/svg/checkbox-unchecked.svg';
import { ICheckbox } from './types';

const Checkbox: FC<ICheckbox> = ({ active, size = 24, onPress }) => {
  return (
    <TouchableOpacity style={{ height: size, width: size }} onPress={onPress}>
      {active ? (
        <Checked height={size} width={size} />
      ) : (
        <Unchecked height={size} width={size} />
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
