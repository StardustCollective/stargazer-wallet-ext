import React, { FC, MouseEvent, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForever';
import { RootState } from 'state/store';
import { useController } from 'hooks/index';
import styles from './index.scss';
import defaultHeader from 'navigation/headers/default';
import { useLinkTo } from '@react-navigation/native'
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

interface IWalletsView {
  onChange: (id: string) => void;
  navigation: any;
}

const ConnectedSites: FC<IWalletsView> = ({ navigation }) => {
  const controller = useController();
  const linkTo = useLinkTo();
  const connectedSites = useSelector(
    (state: RootState) => state.dapp
  );

  useLayoutEffect(() => {
    navigation.setOptions(defaultHeader({ navigation }));
  }, []);

  const onDeleteSiteClicked = (origin: string) => {
    controller.dapp.fromUseDisconnectDApp(origin);
  }

  return (
    <div className={styles.wallets}>
      <TextV3.CaptionStrong
        color={COLORS_ENUMS.BLACK}
      >
        Sites
      </TextV3.CaptionStrong>
      <div className={styles.group}>
        {Object.values(connectedSites).map((site: any) => (
          <section
            className={styles.wallet}
            key={site.origin}
          >
            <img width={25} src={site.logo} className={styles.icon} />
            <TextV3.Body
              color={COLORS_ENUMS.BLACK}
            >
              {site.origin}
            </TextV3.Body>
            <div className={styles.iconContainer}>
              <IconButton
                className={styles.details}
                onClick={() => onDeleteSiteClicked(site.origin)}
              >
                <DeleteForever />
              </IconButton>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ConnectedSites;
