import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import NetworkIcon from '@material-ui/icons/Timeline';
import ListIcon from '@material-ui/icons/ListAltRounded';
import InfoIcon from '@material-ui/icons/InfoRounded';
import DeleteIcon from '@material-ui/icons/Delete';

import Select from 'components/Select';
import Icon from 'components/Icon';
import { useController, useSettingsView } from 'hooks/index';
import { ABOUT_VIEW, DELETE_WALLET_VIEW, PHRASE_VIEW } from '../routes';
import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';
import { RootState } from 'state/store';

import styles from './index.scss';
import IWalletState, { AssetType } from 'state/wallet/types';

const GeneralView = () => {
  const controller = useController();
  const showView = useSettingsView();
  const { activeNetwork }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  const handleChangeNetwork = (network: string, asset: string) => {
    controller.wallet.switchNetwork(asset, network);
  };

  return (
    <div className={styles.general}>
      <ul>
        <li className={styles.network}>
          <Icon Component={NetworkIcon} variant={styles.icon} />
          <span>
            Networks
            <small>Constellation Network</small>
            <Select
              value={
                activeNetwork[AssetType.Constellation] || DAG_NETWORK.main.id
              }
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
            <small>Ethereum Network</small>
            <Select
              value={
                activeNetwork[AssetType.Ethereum] || ETH_NETWORK.mainnet.id
              }
              fullWidth
              onChange={(
                ev: ChangeEvent<{
                  name?: string | undefined;
                  value: unknown;
                }>
              ) => {
                handleChangeNetwork(
                  ev.target.value as string,
                  AssetType.Ethereum
                );
              }}
              options={[
                { [ETH_NETWORK.mainnet.id]: ETH_NETWORK.mainnet.label },
                { [ETH_NETWORK.testnet.id]: ETH_NETWORK.testnet.label },
              ]}
            />
          </span>
        </li>
        <li onClick={() => showView(PHRASE_VIEW)}>
          <Icon Component={ListIcon} />
          Wallet seed phrase
        </li>
        <li onClick={() => showView(ABOUT_VIEW)}>
          <Icon Component={InfoIcon} />
          About
        </li>
        <li onClick={() => showView(DELETE_WALLET_VIEW)}>
          <Icon Component={DeleteIcon} />
          Delete wallet
        </li>
      </ul>
    </div>
  );
};

export default GeneralView;
