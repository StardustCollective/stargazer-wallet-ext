import React, { FC } from 'react';
import clsx from 'clsx';
import Portal from '@reach/portal';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import MainView from './views/MainView';

import styles from './Settings.scss';

interface ISettings {
  open: boolean;
  onClose?: () => void;
}

const Settings: FC<ISettings> = ({ open }) => {
  return (
    <Portal>
      <div className={clsx(styles.mask, { [styles.open]: open })}>
        <div className={styles.modal}>
          <section className={styles.heading}>
            <IconButton className={styles.navBtn}>
              <ArrowBackIcon className={styles.icon} />
            </IconButton>
            Settings
            <IconButton className={styles.navBtn}>
              <CloseIcon className={styles.icon} />
            </IconButton>
          </section>
          <section className={styles.content}>
            <MainView />
          </section>
        </div>
      </div>
    </Portal>
  );
};

export default Settings;
