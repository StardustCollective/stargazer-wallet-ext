import React from 'react';
import Select from 'components/Select';
import DAGIcon from 'assets/images/svg/dag.svg';
import UserIcon from 'assets/images/svg/user.svg';
import ExportIcon from 'assets/images/svg/export.svg';
import LinkIcon from 'assets/images/svg/link.svg';
import ConnectedIcon from 'assets/images/svg/connected.svg';
import RemoveIcon from 'assets/images/svg/trash.svg';

import styles from './AccountView.scss';

const AccountView = () => {
  return (
    <div className={styles.account}>
      <ul>
        <li className={styles.network}>
          <img src={DAGIcon} alt="DAG" />
          <span>
            DAG Network
            <Select
              value="mainnet"
              onChange={(ev) => {
                console.log(ev);
              }}
              options={[{ mainnet: 'Mainnet' }, { testnet: 'Testnet 1' }]}
            />
          </span>
        </li>
        <li>
          <img src={UserIcon} alt="user" />
          Account Details
        </li>
        <li>
          <img src={ExportIcon} alt="export" />
          Export private key
        </li>
        <li>
          <img src={LinkIcon} alt="view" />
          View on explorer
        </li>
        <li>
          <img src={ConnectedIcon} alt="connected" />
          Connected sites
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
