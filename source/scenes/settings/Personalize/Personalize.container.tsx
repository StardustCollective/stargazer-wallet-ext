import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Container from 'components/Container';
import Personalize from './Personalize';
import { RootState } from 'state/store';
import { IUserState } from 'state/user/types';
import { getAccountController } from 'utils/controllersUtils';

const PersonalizeContainer: FC = () => {
  const { elpaca }: IUserState = useSelector((state: RootState) => state.user);
  const { hidden } = elpaca;

  const accountController = getAccountController();

  const toggleHideElpacaCard = () => {
    accountController.assetsController.setElpacaHidden(!hidden);
  };

  return (
    <Container safeArea={false}>
      <Personalize hidden={hidden} toggleHideElpacaCard={toggleHideElpacaCard} />
    </Container>
  );
};

export default PersonalizeContainer;
