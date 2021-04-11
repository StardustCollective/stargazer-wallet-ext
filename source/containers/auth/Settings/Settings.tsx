import React, { FC, useState } from 'react';
import clsx from 'clsx';
import Portal from '@reach/portal';
import { useTransition, animated } from 'react-spring';
import { useLocation, useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/AddCircleRounded';

import * as Views from './views';
import * as routes from './views/routes';

import { useSettingsView } from 'hooks/index';
import styles from './Settings.scss';

interface ISettings {
  open: boolean;
  onClose: () => void;
}

const Settings: FC<ISettings> = ({ open, onClose }) => {
  const location = useLocation();
  const history = useHistory();
  const showView = useSettingsView();
  const transitions = useTransition(location, (locat) => locat.hash, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
  });

  const [showedId, setShowedId] = useState<string>('0');
  const [selectedContact, setSelectedContact] = useState<string>('');

  const renderTitle = (view: string) => {
    switch (view) {
      case routes.WALLETS_VIEW:
      case routes.ADD_WALLET_VIEW:
        return 'Wallets';
      case routes.IMPORT_WALLET_VIEW:
        return 'Import';
      case routes.NETWORKS_VIEW:
        return 'Networks';
      case routes.MANAGE_WALLET_VIEW:
        return 'Manage';
      case routes.GENERAL_VIEW:
        return 'General Settings';
      case routes.PHRASE_VIEW:
        return 'Wallet seed phrase';
      case routes.DELETE_WALLET_VIEW:
        return 'Delete wallet';
      case routes.NEW_ACCOUNT_VIEW:
        return 'Create account';
      case routes.REMOVE_ACCOUNT_VIEW:
        return 'Remove account';
      case routes.PRIV_KEY_VIEW:
        return 'Export private key';
      case routes.ABOUT_VIEW:
        return 'About';
      case routes.CONTACTS_VIEW:
        return 'Contacts';
      case routes.CONTACT_VIEW:
        return 'Contact';
      case routes.ADD_CONTACT_VIEW:
        return 'Add Contact';
      case routes.EDIT_CONTACT_VIEW:
        return 'Edit Contact';
      case routes.IMPORT_ACCOUNT_VIEW:
        return 'Import private key';
      default:
        return 'Settings';
    }
  };

  const renderView = (view: string) => {
    switch (view) {
      case routes.WALLETS_VIEW:
        return <Views.WalletsView onChange={(id) => setShowedId(id)} />;
      case routes.ADD_WALLET_VIEW:
        return <Views.AddWalletView />;
      case routes.IMPORT_WALLET_VIEW:
        return <Views.ImportWalletView />;
      case routes.NETWORKS_VIEW:
        return <Views.NetworksView />;
      case routes.MANAGE_WALLET_VIEW:
        return <Views.ManageWalletView id={showedId} />;
      case routes.GENERAL_VIEW:
        return <Views.GeneralView />;
      case routes.PHRASE_VIEW:
        return <Views.PhraseView />;
      case routes.DELETE_WALLET_VIEW:
        return <Views.DeleteWalletView />;
      case routes.NEW_ACCOUNT_VIEW:
        return <Views.NewAccountView />;
      case routes.REMOVE_ACCOUNT_VIEW:
        return <Views.RemoveAccountView id={showedId} />;
      case routes.PRIV_KEY_VIEW:
        return <Views.PrivateKeyView id={showedId} />;
      case routes.ABOUT_VIEW:
        return <Views.AboutView />;
      case routes.CONTACTS_VIEW:
        return (
          <Views.ContactsView
            onSelect={(id: string) => setSelectedContact(id)}
          />
        );
      case routes.ADD_CONTACT_VIEW:
        return <Views.ModifyContactView type="add" />;
      case routes.EDIT_CONTACT_VIEW:
        return (
          <Views.ModifyContactView type="edit" selected={selectedContact} />
        );
      case routes.CONTACT_VIEW:
        return <Views.ContactView selected={selectedContact} />;
      case routes.IMPORT_ACCOUNT_VIEW:
        return <Views.ImportAccountView />;
      default:
        return <Views.MainView />;
    }
  };

  const handleBackNav = () => {
    if (location.hash) {
      history.goBack();
    } else {
      onClose();
    }
  };

  return (
    <Portal>
      <div className={clsx(styles.mask, { [styles.open]: open })}>
        <div className={styles.modal}>
          <section className={styles.heading}>
            <IconButton className={styles.navBtn} onClick={handleBackNav}>
              <ArrowBackIcon className={styles.icon} />
            </IconButton>
            <span className={clsx(styles.title)}>
              {renderTitle(location.hash)}
            </span>
            {location.hash === routes.WALLETS_VIEW && (
              <IconButton
                className={clsx(styles.navBtn, styles.addBtn)}
                onClick={() => showView(routes.ADD_WALLET_VIEW)}
              >
                <AddIcon className={styles.icon} />
              </IconButton>
            )}
          </section>
          {transitions.map(({ item, props, key }) => (
            <animated.section
              className={styles.content}
              style={{
                ...props,
                position: 'absolute',
                height: '100%',
                width: '100%',
              }}
              key={key}
            >
              {renderView(item.hash)}
            </animated.section>
          ))}
        </div>
      </div>
    </Portal>
  );
};

export default Settings;
