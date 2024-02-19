import React, { FC } from 'react';
import { View } from 'react-native';
import { Image } from 'react-native-elements';

import TextV3 from 'components/TextV3';
import Icon from 'components/Icon';

import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import IConnectedSitesSettings from './types';

const ConnectedSites: FC<IConnectedSitesSettings> = ({
  onDeleteSiteClicked,
  connectedSites,
}) => {
  return (
    <View style={styles.wallets}>
      {Object.values(connectedSites).length > 0 && (
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyle={styles.label}>
          Sites
        </TextV3.CaptionStrong>
      )}
      <View>
        {Object.values(connectedSites).map((site: any) => (
          <View style={styles.groupWallet} key={site.origin}>
            <Image width={25} source={{ uri: site.logo }} containerStyle={styles.icon} />
            <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyle={styles.groupText}>
              {site.origin}
            </TextV3.Body>
            <View style={styles.iconContainer}>
              <Icon
                name="delete-forever"
                iconStyles={styles.details}
                onPress={onDeleteSiteClicked(site.id)}
              />
            </View>
          </View>
        ))}
        {Object.values(connectedSites).length <= 0 && (
          <View style={styles.noSitesConnected}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>
              This account is not connected to any sites.
            </TextV3.Caption>
          </View>
        )}
      </View>
    </View>
  );
};

export default ConnectedSites;
