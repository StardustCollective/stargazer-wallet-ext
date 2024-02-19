import React, { FC } from 'react';

import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForever';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './ConnectedSites.scss';
import IConnectedSitesSettings from './types';

const ConnectedSites: FC<IConnectedSitesSettings> = ({
  onDeleteSiteClicked,
  connectedSites,
}) => {
  return (
    <div className={styles.wallets}>
      {Object.values(connectedSites).length > 0 && (
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>Sites</TextV3.CaptionStrong>
      )}
      <div className={styles.group}>
        {Object.values(connectedSites).map((site: any) => (
          <section className={styles.wallet} key={site.origin}>
            <img width={25} src={site.logo} className={styles.icon} />
            <TextV3.Body color={COLORS_ENUMS.BLACK}>{site.origin}</TextV3.Body>
            <div className={styles.iconContainer}>
              <IconButton
                className={styles.details}
                onClick={() => onDeleteSiteClicked(site.id)}
              >
                <DeleteForever />
              </IconButton>
            </div>
          </section>
        ))}
        {Object.values(connectedSites).length <= 0 && (
          <div className={styles.noSitesConnected}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>
              This account is not connected to any sites.
            </TextV3.Caption>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectedSites;
