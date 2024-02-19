import React, { FC } from 'react';
import { Linking } from 'react-native';

///////////////////////////
// Imports
///////////////////////////

import { useSelector } from 'react-redux';

///////////////////////////
// Types
///////////////////////////

import { IExolixTransaction } from 'state/swap/types';
import { RootState } from 'state/store';
import { ISwapTokensContainer } from './types';
import { CONTAINER_COLOR } from 'components/Container/enum';

///////////////////////////
// Components
///////////////////////////

import TransactionDetails from './TransactionDetails';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

import { EXOLIX_EMAIL } from './constants';

///////////////////////////
// Container
///////////////////////////

const TransactionDetailsContainer: FC<ISwapTokensContainer> = () => {
  const { selectedTransaction }: { selectedTransaction: IExolixTransaction } =
    useSelector((state: RootState) => state.swap);

  const onSupportLinkPress = () => {
    Linking.openURL(`mailto:${EXOLIX_EMAIL}`);
  };

  return (
    <Container color={CONTAINER_COLOR.GRAY_LIGHT_300}>
      <TransactionDetails
        transaction={selectedTransaction}
        onSupportLinkPress={onSupportLinkPress}
      />
    </Container>
  );
};

export default TransactionDetailsContainer;
