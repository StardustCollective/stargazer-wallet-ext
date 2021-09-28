import React, { FC, MouseEvent, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Icon from 'components/Icon';
import { RootState } from 'state/store';
import { useController } from 'hooks/index';

import StargazerIcon from 'assets/images/logo-s.svg';
import styles from './index.scss';
import defaultHeader from 'navigation/headers/default';
import { useLinkTo } from '@react-navigation/native'

interface IWalletsView {
  onChange: (id: string) => void;
  navigation: any;
}

const ConnectedSites: FC<IWalletsView> = ({ navigation }) => {
  const controller = useController();
  const linkTo =  useLinkTo();
  const connectedSites = useSelector(
    (state: RootState) => state.dapp
  );

  useLayoutEffect(() => {
    navigation.setOptions(defaultHeader({ navigation }));
  }, []);

  const onDeleteSiteClicked = () => {
    alert('Delete Wallet Clicked');
  }

  return (
    <div className={styles.wallets}>
      <label>
       Sites
      </label>
      <div className={styles.group}>
        {Object.values(connectedSites).map((site: any) => (
            <section
              className={styles.wallet}
              key={site.origin}
            >
              <img width={25} src={site.logo} className={styles.icon} />
              <span>
                {site.origin}
              </span>
              <IconButton
                className={styles.details}
                onClick={onDeleteSiteClicked}
              >
                <DeleteForever />
              </IconButton>
            </section>
          ))}
      </div>
    </div>
  );
};

export default ConnectedSites;
