import React from 'react';
import Select from 'components/Select';
import DAGIcon from 'assets/images/svg/dag.svg';
import ExportIcon from 'assets/images/svg/export.svg';
import LinkIcon from 'assets/images/svg/link.svg';
import ConnectedIcon from 'assets/images/svg/connected.svg';
import RemoveIcon from 'assets/images/svg/trash.svg';
import { useSettingsView } from 'hooks/index';

import styles from './index.scss';
import { PRIV_KEY_VIEW } from '../routes';

const AccountView = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.account}>
      <ul>
        <li className={styles.network}>
          <img src={DAGIcon} alt="DAG" />
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
          <img src={ExportIcon} alt="export" />
          Export private key
        </li>
        <li>
          <img src={LinkIcon} alt="view" />
          View on explorer
        </li>
        <li>
          <img src={RemoveIcon} alt="remove" />
          Remove Account
        </li>
      </ul>
    </div>
  );
};

export default AccountView;
