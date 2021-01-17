import React from 'react';
import ListIcon from '@material-ui/icons/ListAltRounded';
import InfoIcon from '@material-ui/icons/InfoRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from 'components/Icon';
import { useSettingsView } from 'hooks/index';

import styles from './index.scss';
import { DELETE_WALLET_VIEW, PHRASE_VIEW } from '../routes';

const GeneralView = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.general}>
      <ul>
        <li onClick={() => showView(PHRASE_VIEW)}>
          <Icon Component={ListIcon} />
          Wallet seed phrase
        </li>
        <li>
          <Icon Component={InfoIcon} />
          About
        </li>
        <li onClick={() => showView(DELETE_WALLET_VIEW)}>
          <Icon Component={DeleteIcon} />
          Delete Wallet
        </li>
      </ul>
    </div>
  );
};

export default GeneralView;
