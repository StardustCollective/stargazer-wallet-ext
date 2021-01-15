import React from 'react';
import ListIcon from 'assets/images/svg/list.svg';
import InfoIcon from 'assets/images/svg/info.svg';
import DeleteIcon from 'assets/images/svg/trash.svg';
import { useSettingsView } from 'hooks/index';

import styles from './index.scss';
import { DELETE_WALLET_VIEW, PHRASE_VIEW } from '../routes';

const GeneralView = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.general}>
      <ul>
        <li onClick={() => showView(PHRASE_VIEW)}>
          <img src={ListIcon} alt="user" />
          Wallet seed phrase
        </li>
        <li>
          <img src={InfoIcon} alt="info" />
          About
        </li>
        <li onClick={() => showView(DELETE_WALLET_VIEW)}>
          <img src={DeleteIcon} alt="delete" />
          Delete Wallet
        </li>
      </ul>
    </div>
  );
};

export default GeneralView;
