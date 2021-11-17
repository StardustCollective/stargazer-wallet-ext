///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import defaultHeader from '../default';
import { 
  Pressable,
  AddIcon
} from "native-base"

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

const addHeader = ({
  navigation,
  onRightIconClick,
}: IAddHeader) => {

  return {
    ...defaultHeader({ navigation }),
    headerRight: () => (
      <Pressable
        onPress={onRightIconClick}
      >
        <AddIcon
          size="6"
          mr="3"
          color="white" 
          testId={'header-addButton'} 
        />
      </Pressable>
    ),
  }
};

export default addHeader;