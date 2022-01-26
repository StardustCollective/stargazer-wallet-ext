///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { Text } from 'react-native';
///////////////////////
// Components
///////////////////////

import Container from 'scenes/common/Container';

///////////////////////
// Scene
///////////////////////

import Networks from './Networks';

///////////////////////
// Hooks
///////////////////////
// import { useController } from 'hooks/index';

import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';

///////////////////////
// CONSTANTS
///////////////////////
import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';

///////////////////////
// Component
///////////////////////
const NetworksContainer: FC = () => {
  ///////////////////////
  // STATE
  ///////////////////////
  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);

  ///////////////////////
  // HOOKS
  ///////////////////////
  // const controller = useController();
  const handleChangeNetwork = (networkType: KeyringNetwork, networkId: string) => {
    console.log( 'HANDLE SWITCH NETWORKS');
    console.log('WHAT IS NE VALUES:', KeyringNetwork, `networkId=${networkId}`);
    // controller.wallet.switchNetwork(networkType, networkId);
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
    <Container>
      <Networks networkOptions={networkOptions}/> 
    </Container>
  );
};

export default NetworksContainer;
