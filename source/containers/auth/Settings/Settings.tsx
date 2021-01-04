import React, { FC } from 'react';
import clsx from 'clsx';
import Portal from '@reach/portal';
import { useLocation, useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import MainView, { AccountView, DetailsView, GeneralView } from './views';
import { ACCOUNT_VIEW, DETAILS_VIEW, GENERAL_VIEW } from './views/consts';

import styles from './Settings.scss';

interface ISettings {
  open: boolean;
  onClose?: () => void;
}

const Settings: FC<ISettings> = ({ open, onClose }) => {
  const location = useLocation();
  const history = useHistory();

  const renderView = () => {
    switch (location.hash) {
      case ACCOUNT_VIEW:
        return <AccountView />;
      case DETAILS_VIEW:
        return <DetailsView />;
      case GENERAL_VIEW:
        return <GeneralView />;
      default:
        return <MainView />;
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
            Settings
            <IconButton className={styles.navBtn} onClick={onClose}>
              <CloseIcon className={styles.icon} />
            </IconButton>
          </section>
          <section className={styles.content}>{renderView()}</section>
        </div>
      </div>
    </Portal>
  );
};

export default Settings;
