import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { getWalletController } from 'utils/controllersUtils';

import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';

import Container from 'components/Container';
import Networks from './Networks';

const NetworksContainer: FC = () => {
  const walletController = getWalletController();
  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);

  const handleChangeNetwork = (networkType: KeyringNetwork, networkId: string) => {
    walletController.switchNetwork(networkType, networkId);
  };

  const networkOptions = [
    {
      key: 'Constelllation Network',
      label: 'Constelllation Network',
      value: activeNetwork[KeyringNetwork.Constellation],
      onChange: (value: string) => {
        handleChangeNetwork(KeyringNetwork.Constellation, value);
      },
      containerStyle: {
        zIndex: 3000,
      },
      wrapperProps: {
        zIndex: 3000,
        zIndexInverse: 1000,
      },
      options: [{ [DAG_NETWORK.main.id]: DAG_NETWORK.main.label }, { [DAG_NETWORK.ceres.id]: DAG_NETWORK.ceres.label }],
    },
    {
      key: 'Ethereum Network',
      label: 'Ethereum Network',
      value: activeNetwork[KeyringNetwork.Ethereum],
      onChange: (value: string) => {
        handleChangeNetwork(KeyringNetwork.Ethereum, value);
      },
      containerStyle: {
        zIndex: 2000,
      },
      selectProps: {
        zIndex: 2000,
        zIndexInverse: 2000,
      },
      options: [
        { [ETH_NETWORK.mainnet.id]: ETH_NETWORK.mainnet.label },
        { [ETH_NETWORK.testnet.id]: ETH_NETWORK.testnet.label },
      ],
    },
  ];

  return (
    <Container safeArea={false}>
      <Networks networkOptions={networkOptions} />
    </Container>
  );
};

export default NetworksContainer;
