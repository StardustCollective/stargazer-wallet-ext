import React, { FC } from 'react';
import Container, { CONTAINER_COLOR } from 'components/Container';

const SelectHardwareWallet: FC = () => {
  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} safeArea={false}>
      <p>Select Hardware Wallet</p>
    </Container>
  );
};

export default SelectHardwareWallet;
