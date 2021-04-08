import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';

import Select from 'components/Select';
import { RootState } from 'state/store';
import IWalletState, { AssetType } from 'state/wallet/types';
import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';
import { useController } from 'hooks/index';

import styles from './index.scss';

const NetworksView = () => {
  const controller = useController();
  const { activeNetwork }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  const handleChangeNetwork = (network: string, asset: string) => {
    controller.wallet.switchNetwork(asset, network);
  };

  return (
    <div className={styles.wrapper}>
      <label>Constellation Network</label>
      <Select
        value={activeNetwork[AssetType.Constellation] || DAG_NETWORK.main.id}
        fullWidth
        onChange={(
          ev: ChangeEvent<{
            name?: string | undefined;
            value: unknown;
          }>
        ) => {
          handleChangeNetwork(
            ev.target.value as string,
            AssetType.Constellation
          );
        }}
        options={[
          { [DAG_NETWORK.main.id]: DAG_NETWORK.main.label },
          { [DAG_NETWORK.ceres.id]: DAG_NETWORK.ceres.label },
        ]}
      />
      <label>Ethereum Network</label>
      <Select
        value={activeNetwork[AssetType.Ethereum] || ETH_NETWORK.mainnet.id}
        fullWidth
        onChange={(
          ev: ChangeEvent<{
            name?: string | undefined;
            value: unknown;
          }>
        ) => {
          handleChangeNetwork(ev.target.value as string, AssetType.Ethereum);
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
