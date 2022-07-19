import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

import { getWalletController } from 'utils/controllersUtils';

import { RootState } from 'state/store';
import IVaultState from 'state/vault/types';
import { AVALANCHE_NETWORK, BSC_NETWORK, DAG_NETWORK, ETH_NETWORK, POLYGON_NETWORK } from 'constants/index';

import Container from 'components/Container';
import Networks from './Networks';

const NetworksContainer: FC = () => {
  const walletController = getWalletController();
  const { activeNetwork }: IVaultState = useSelector((state: RootState) => state.vault);

  const handleChangeNetwork = (networkType: string, networkId: string) => {
    walletController.switchNetwork(networkType, networkId);
  };

  const networkOptions = [
    {
      icon: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/constellation-logo.png',
      key: 'Constellation',
      title: 'Constellation',
      value: activeNetwork[KeyringNetwork.Constellation],
      onChange: (value: string) => {
        handleChangeNetwork(KeyringNetwork.Constellation, value);
      },
      containerStyle: {
        zIndex: 10000,
      },
      items: [
        { value: DAG_NETWORK.main.id, label: DAG_NETWORK.main.label }, 
        { value: DAG_NETWORK.ceres.id, label: DAG_NETWORK.ceres.label }
      ],
    },
    {
      icon: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/ethereum-logo.png',
      key: 'Ethereum',
      title: 'Ethereum',
      value: activeNetwork[KeyringNetwork.Ethereum],
      onChange: (value: string) => {
        handleChangeNetwork(KeyringNetwork.Ethereum, value);
      },
      containerStyle: {
        zIndex: 9000,
      },
      items: [
        { value: ETH_NETWORK.mainnet.id, label: ETH_NETWORK.mainnet.label  },
        { value: ETH_NETWORK.ropsten.id, label: ETH_NETWORK.ropsten.label },
        { value: ETH_NETWORK.rinkeby.id, label: ETH_NETWORK.rinkeby.label },
      ],
    },
    {
      icon: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/avalanche-logo.png',
      key: 'Avalanche',
      title: 'Avalanche',
      value: activeNetwork['Avalanche'],
      onChange: (value: string) => {
        handleChangeNetwork('Avalanche', value);
      },
      containerStyle: {
        zIndex: 8000,
      },
      items: [
        { value: AVALANCHE_NETWORK['avalanche-mainnet'].id, label: AVALANCHE_NETWORK['avalanche-mainnet'].label  },
        { value: AVALANCHE_NETWORK['avalanche-testnet'].id, label: AVALANCHE_NETWORK['avalanche-testnet'].label },
      ],
    },
    {
      icon: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/bsc-logo.png',
      key: 'BNB Chain',
      title: 'BNB Chain',
      value: activeNetwork['BSC'],
      onChange: (value: string) => {
        handleChangeNetwork('BSC', value);
      },
      containerStyle: {
        zIndex: 7000,
      },
      items: [
        { value: BSC_NETWORK.bsc.id, label: BSC_NETWORK.bsc.label  },
        { value: BSC_NETWORK['bsc-testnet'].id, label: BSC_NETWORK['bsc-testnet'].label },
      ],
    },
    {
      icon: 'https://stargazer-assets.s3.us-east-2.amazonaws.com/logos/polygon-logo.png',
      key: 'Polygon',
      title: 'Polygon',
      value: activeNetwork['Polygon'],
      onChange: (value: string) => {
        handleChangeNetwork('Polygon', value);
      },
      containerStyle: {
        zIndex: 6000,
      },
      items: [
        { value: POLYGON_NETWORK.matic.id, label: POLYGON_NETWORK.matic.label  },
        { value: POLYGON_NETWORK['matic-testnet'].id, label: POLYGON_NETWORK['matic-testnet'].label },
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
