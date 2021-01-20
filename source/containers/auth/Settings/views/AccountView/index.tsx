import React, { FC } from 'react';
import Select from 'components/Select';
import Icon from 'components/Icon';
import NetworkIcon from '@material-ui/icons/Timeline';
import ExportIcon from '@material-ui/icons/ImportExport';
import LinkIcon from '@material-ui/icons/CallMissedOutgoing';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSettingsView } from 'hooks/index';

import { PRIV_KEY_VIEW, REMOVE_ACCOUNT_VIEW } from '../routes';
import { DAG_EXPLORER_SEARCH } from 'constants/index';

import styles from './index.scss';

interface IAccountView {
  address: string;
}

const AccountView: FC<IAccountView> = ({ address }) => {
  const showView = useSettingsView();

  const handleOpenExplorer = () => {
    window.open(`${DAG_EXPLORER_SEARCH}${address}`, '_blank');
  };

  return (
    <div className={styles.account}>
      <ul>
        <li className={styles.network}>
          <Icon Component={NetworkIcon} variant={styles.icon} />
          <span>
            Network
            <Select
              value="mainnet"
              fullWidth
              onChange={(ev) => {
                console.log(ev);
              }}
              options={[{ mainnet: 'Mainnet' }, { testnet: 'Testnet 1' }]}
            />
          </span>
        </li>
        <li onClick={() => showView(PRIV_KEY_VIEW)}>
          <Icon Component={ExportIcon} />
          Export private key
        </li>
        <li onClick={handleOpenExplorer}>
          <Icon Component={LinkIcon} />
          View on explorer
        </li>
        <li onClick={() => showView(REMOVE_ACCOUNT_VIEW)}>
          <Icon Component={DeleteIcon} />
          Remove Account
        </li>
      </ul>
    </div>
  );
};

export default AccountView;
