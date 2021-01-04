import React, { FC } from 'react';
import clsx from 'clsx';
import Portal from '@reach/portal';
import { useTransition, animated } from 'react-spring';
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
  const transitions = useTransition(location, (locat) => locat.hash, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 300 },
  });

  const renderView = (view: string) => {
    switch (view) {
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
          {transitions.map(({ item, props, key }) => (
            <animated.div
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
            </animated.div>
          ))}
        </div>
      </div>
    </Portal>
  );
};

export default Settings;
