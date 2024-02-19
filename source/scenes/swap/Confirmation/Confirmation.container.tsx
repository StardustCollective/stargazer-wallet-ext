import React, { FC } from 'react';

///////////////////////////
// Imports
///////////////////////////

import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Utils
///////////////////////////

import NavUtils from 'navigation/util';

///////////////////////////
// Types
///////////////////////////

import { IConfirmationContainer } from './types';
import { CONTAINER_COLOR } from 'components/Container/enum';

///////////////////////////
// Components
///////////////////////////

import Confirmation from './Confirmation';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const ConfirmationContainer: FC<IConfirmationContainer> = ({ navigation }) => {
  const linkTo = useLinkTo();

  const onViewSwapHistoryPressed = () => {
    linkTo('/swapHistory');
  };

  const onDonePressed = () => {
    NavUtils.popToTop(navigation);
  };

  return (
    <Container color={CONTAINER_COLOR.GRAY_LIGHT_300}>
      <Confirmation
        onViewSwapHistoryPressed={onViewSwapHistoryPressed}
        onDonePressed={onDonePressed}
      />
    </Container>
  );
};

export default ConfirmationContainer;
