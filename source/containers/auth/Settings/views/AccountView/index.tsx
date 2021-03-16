import React, { FC } from 'react';
import Icon from 'components/Icon';
import ExportIcon from '@material-ui/icons/ImportExport';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSettingsView } from 'hooks/index';

import { PRIV_KEY_VIEW, REMOVE_ACCOUNT_VIEW } from '../routes';

import styles from './index.scss';

const AccountView: FC = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.account}>
      <ul>
        <li onClick={() => showView(PRIV_KEY_VIEW)}>
          <Icon Component={ExportIcon} />
          Export private key
        </li>
        <li onClick={() => showView(REMOVE_ACCOUNT_VIEW)}>
          <Icon Component={DeleteIcon} />
          Remove account
        </li>
      </ul>
    </div>
  );
};

export default AccountView;
