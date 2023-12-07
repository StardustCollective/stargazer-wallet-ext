///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import defaultHeader from '../default';
import { Pressable, AddIcon } from 'native-base';

///////////////////////
// Images
///////////////////////

import Clipboard from 'assets/images/svg/clipboard.svg';

///////////////////////////
// Interface
///////////////////////////

interface IAddHeader {
  navigation: any;
  onRightIconClick: () => void;
}

///////////////////////////
// Header
///////////////////////////

const addHeader = ({ navigation, onRightIconClick }: IAddHeader) => {
  return {
    ...defaultHeader({ navigation }),
    headerRight: () => (
      <Pressable onPress={onRightIconClick} mr="5">
        <Clipboard />
      </Pressable>
    ),
  };
};

export default addHeader;
