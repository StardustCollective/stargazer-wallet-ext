import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import UserIcon from '@material-ui/icons/AccountCircleRounded';
import LogOutIcon from '@material-ui/icons/ExitToApp';
import ContactsIcon from '@material-ui/icons/Group';

import Icon from 'components/Icon';
import { useController, useSettingsView } from 'hooks/index';
import { RootState } from 'state/store';
import IWalletState, { IAccountState } from 'state/wallet/types';
import {
  ACCOUNT_VIEW,
  CONTACTS_VIEW,
  GENERAL_VIEW,
  NEW_ACCOUNT_VIEW,
} from '../routes';

import styles from './index.scss';

interface IMainView {
  onChange: (index: number) => void;
}

const MainView: FC<IMainView> = ({ onChange }) => {
  const showView = useSettingsView();
  const history = useHistory();
  const controller = useController();
  const { accounts, activeIndex }: IWalletState = useSelector(
    (state: RootState) => state.wallet
  );

  const handleSelectAccount = (index: number) => {
    onChange(index);
    showView(ACCOUNT_VIEW);
  };

  const handleLogout = () => {
    controller.wallet.logOut();
    history.push('./app.html');
  };

  return (
    <div className={styles.main}>
      <ul className={styles.accounts}>
        {Object.values(accounts).map((account: IAccountState) => (
          <li
            onClick={() => handleSelectAccount(account.index)}
            key={account.index}
          >
            <div className={styles.account}>
              <span className={styles.accInfo}>
                <Icon Component={UserIcon} />
                <div>{account.label}</div>
                {account!.index === activeIndex && <small> (active)</small>}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <section
        className={styles.new}
        onClick={() => showView(NEW_ACCOUNT_VIEW)}
      >
        <Icon Component={AddIcon} />
        Create account
      </section>
      <section
        className={styles.general}
        onClick={() => showView(CONTACTS_VIEW)}
      >
        <Icon Component={ContactsIcon} />
        Contacts
      </section>
      <section
        className={styles.general}
        onClick={() => showView(GENERAL_VIEW)}
      >
        <Icon Component={SettingsIcon} />
        General settings
      </section>
      <section className={styles.general} onClick={handleLogout}>
        <Icon Component={LogOutIcon} />
        Log out
      </section>
    </div>
  );
};

export default MainView;
