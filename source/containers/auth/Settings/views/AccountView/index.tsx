import React from 'react';
import Select from 'components/Select';
import NetworkIcon from '@material-ui/icons/Timeline';
import ExportIcon from '@material-ui/icons/ImportExport';
import LinkIcon from '@material-ui/icons/CallMissedOutgoing';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSettingsView } from 'hooks/index';

import styles from './index.scss';
import { PRIV_KEY_VIEW } from '../routes';
import Icon from 'components/Icon';

const AccountView = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.account}>
      <ul>
        <li className={styles.network}>
          <Icon Component={NetworkIcon} />
          <span>
            DAG Network
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
        <li>
          <Icon Component={LinkIcon} />
          View on explorer
        </li>
        <li>
          <Icon Component={DeleteIcon} />
          Remove Account
        </li>
      </ul>
    </div>
  );
};

export default AccountView;
