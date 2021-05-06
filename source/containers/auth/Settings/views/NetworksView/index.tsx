import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';

import Select from 'components/Select';
import { RootState } from 'state/store';
import IVaultState, { AssetType } from 'state/vault/types';
import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';
import { useController } from 'hooks/index';

import styles from './index.scss';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';

const NetworksView = () => {
  const controller = useController();
  const { activeNetwork }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );

  const handleChangeNetwork = (
    networkType: KeyringNetwork,
    networkId: string
  ) => {
    controller.wallet.switchNetwork(networkType, networkId);
  };

  return (
    <div className={styles.wrapper}>
      <label>Constellation Network</label>
      <Select
        value={activeNetwork[KeyringNetwork.Constellation]}
        fullWidth
        onChange={(
          ev: ChangeEvent<{
            name?: string | undefined;
            value: unknown;
          }>
        ) => {
          handleChangeNetwork(
            KeyringNetwork.Constellation,
            ev.target.value as string
          );
        }}
        options={[
          { [DAG_NETWORK.main.id]: DAG_NETWORK.main.label },
          { [DAG_NETWORK.ceres.id]: DAG_NETWORK.ceres.label },
        ]}
      />
      <label>Ethereum Network</label>
      <Select
        value={activeNetwork[KeyringNetwork.Ethereum]}
        fullWidth
        onChange={(
          ev: ChangeEvent<{
            name?: string | undefined;
            value: unknown;
          }>
        ) => {
          handleChangeNetwork(
            KeyringNetwork.Ethereum,
            ev.target.value as string
          );
        }}
        options={[
          { [ETH_NETWORK.mainnet.id]: ETH_NETWORK.mainnet.label },
          { [ETH_NETWORK.testnet.id]: ETH_NETWORK.testnet.label },
        ]}
      />
    </div>
  );
};

export default NetworksView;
