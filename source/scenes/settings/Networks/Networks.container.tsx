import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { useLinkTo } from '@react-navigation/native';

import { getWalletController } from 'utils/controllersUtils';

import { RootState } from 'state/store';
import IVaultState, { ActiveNetwork } from 'state/vault/types';
import { AVALANCHE_LOGO, AVALANCHE_NETWORK, CONSTELLATION_LOGO, DAG_NETWORK, ETHEREUM_LOGO, ETH_NETWORK, POLYGON_LOGO, POLYGON_NETWORK } from 'constants/index';

import Container from 'components/Container';
import Networks from './Networks';

const NetworksContainer: FC = () => {
  const walletController = getWalletController();
  const { activeNetwork, customNetworks }: IVaultState = useSelector((state: RootState) => state.vault);
  const linkTo = useLinkTo();

  const handleChangeNetwork = (networkType: string, networkId: string) => {
    if (activeNetwork[networkType as keyof ActiveNetwork] !== networkId) {
      walletController.switchNetwork(networkType, networkId);
    }
  };

  const handleAddNetwork = () => {
    linkTo('/settings/networks/add');
  }

  const generateConstellationChains = () => {
    const constellationChains = customNetworks['constellation'];
    const items = [
      { value: DAG_NETWORK.main.id, label: DAG_NETWORK.main.label },
    ];
    const constellationObject = Object.keys(constellationChains);
    if (constellationObject.length) {
      const customItems = constellationObject.map((item: string) =>  { return { value: constellationChains[item].id, label: constellationChains[item].label }});
      return items.concat(customItems);
    }
    return items;
  }

  const generateEthereumChains = () => {
    const ethChains = customNetworks['ethereum'];
    const items = [
      { value: ETH_NETWORK.mainnet.id as string, label: ETH_NETWORK.mainnet.label  },
      { value: ETH_NETWORK.ropsten.id as string, label: ETH_NETWORK.ropsten.label },
      { value: ETH_NETWORK.rinkeby.id as string, label: ETH_NETWORK.rinkeby.label },
    ];
    const ethObjects = Object.keys(ethChains);
    if (ethObjects.length) {
      const customItems = ethObjects.map((item: string) =>  { return { value: ethChains[item].id, label: ethChains[item].label }});
      return items.concat(customItems);
    }
    return items;
  }

  const networkOptions = [
    {
      icon: CONSTELLATION_LOGO,
      key: 'Constellation',
      title: 'Constellation',
      value: activeNetwork[KeyringNetwork.Constellation],
      onChange: (value: string) => {
        handleChangeNetwork(KeyringNetwork.Constellation, value);
      },
      containerStyle: {
        zIndex: 10000,
      },
      items: generateConstellationChains(),
    },
    {
      icon: ETHEREUM_LOGO,
      key: 'Ethereum',
      title: 'Ethereum',
      value: activeNetwork[KeyringNetwork.Ethereum],
      onChange: (value: string) => {
        handleChangeNetwork(KeyringNetwork.Ethereum, value);
      },
      containerStyle: {
        zIndex: 9000,
      },
      items: generateEthereumChains(),
    },
    // TODO-349: Only Polygon and AVAX
    {
      icon: AVALANCHE_LOGO,
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
    // {
    //   icon: BSC_LOGO,
    //   key: 'BNB Chain',
    //   title: 'BNB Chain',
    //   value: activeNetwork['BSC'],
    //   onChange: (value: string) => {
    //     handleChangeNetwork('BSC', value);
    //   },
    //   containerStyle: {
    //     zIndex: 7000,
    //   },
    //   items: [
    //     { value: BSC_NETWORK.bsc.id, label: BSC_NETWORK.bsc.label  },
    //     { value: BSC_NETWORK['bsc-testnet'].id, label: BSC_NETWORK['bsc-testnet'].label },
    //   ],
    // },
    {
      icon: POLYGON_LOGO,
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
        { value: POLYGON_NETWORK.maticmum.id, label: POLYGON_NETWORK.maticmum.label },
      ],
    },
  ];

  return (
    <Container safeArea={false}>
      <Networks 
        networkOptions={networkOptions} 
        handleAddNetwork={handleAddNetwork}
      />
    </Container>
  );
};

export default NetworksContainer;
