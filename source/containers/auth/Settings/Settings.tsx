import React, { FC, useState } from 'react';
import clsx from 'clsx';
import Portal from '@reach/portal';
import { useTransition, animated } from 'react-spring';
import { useLocation, useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import * as Views from './views';
import * as routes from './views/routes';

import styles from './Settings.scss';

interface ISettings {
  open: boolean;
  onClose?: () => void;
}

const Settings: FC<ISettings> = ({ open, onClose }) => {
  const location = useLocation();
  const history = useHistory();
  const transitions = useTransition(location, (locat) => locat.hash, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
  });

  const renderTitle = (view: string) => {
    switch (view) {
      case routes.ACCOUNT_VIEW:
        return 'Account';
      case routes.GENERAL_VIEW:
        return 'General settings';
      case routes.PHRASE_VIEW:
        return 'Wallet seed phrase';
      case routes.DELETE_WALLET_VIEW:
        return 'Delete wallet';
      case routes.REMOVE_ACCOUNT_VIEW:
        return 'Remove account';
      case routes.PRIV_KEY_VIEW:
        return 'Export private key';
      default:
        return 'Settings';
    }
  };

  const renderView = (view: string) => {
    switch (view) {
      case routes.ACCOUNT_VIEW:
        return <Views.AccountView />;
      case routes.GENERAL_VIEW:
        return <Views.GeneralView />;
      case routes.PHRASE_VIEW:
        return <Views.PhraseView />;
      case routes.DELETE_WALLET_VIEW:
        return <Views.DeleteWalletView />;
      case routes.REMOVE_ACCOUNT_VIEW:
        return <Views.RemoveAccountView />;
      case routes.PRIV_KEY_VIEW:
        return <Views.PrivateKeyView />;
      default:
        return <Views.MainView />;
    }
  };

  const handleBackNav = () => {
    history.goBack();
  };

  return (
    <Portal>
      <div className={clsx(styles.mask, { [styles.open]: open })}>
        <div className={styles.modal}>
          <section className={styles.heading}>
            <IconButton
              className={styles.navBtn}
              onClick={handleBackNav}
              disabled={!location.hash}
            >
              {location.hash && <ArrowBackIcon className={styles.icon} />}
            </IconButton>
            {renderTitle(location.hash)}
            <IconButton className={styles.navBtn} onClick={onClose}>
              <CloseIcon className={styles.icon} />
            </IconButton>
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
