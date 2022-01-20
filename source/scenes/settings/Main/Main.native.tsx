///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image as ReactNativeImage,
} from 'react-native';

///////////////////////
// Components
///////////////////////
import Card from 'components/Card';
import TextV3 from 'components/TextV3';

///////////////////////
// Types
///////////////////////

import IMainSettings, { IRenderSettingsItemProps } from './types';

///////////////////////
// Styles
///////////////////////
import styles from './styles';

///////////////////////
// Enums
///////////////////////
import { COLORS } from 'assets/styles/_variables';

///////////////////////
// Components
///////////////////////
import WalletIcon from 'assets/images/svg/wallet.svg';
import ContactsIcon from 'assets/images/svg/contacts.svg';
import NetworksIcon from 'assets/images/svg/networks.svg';
import InfoIcon from 'assets/images/svg/info.svg';
import ExitIcon from 'assets/images/svg/exit.svg';
import LinkedApps from 'assets/images/svg/linkedApps.svg';

const Main: FC<IMainSettings> = ({
  handleLogout,
  onWalletLinkClick,
  onNetworkLinkClicked,
  onAboutLinkClicked,
  onContactsLinkClicked,
  onConnectedSitesClicked,
  version,
}) => {
  const RenderSettingsItem = ({
    label,
    IconImageOrComponent,
    imageStyles = {},
    onClick,
  }: IRenderSettingsItemProps) => {
    return (
      <Card
        id={'settings-' + label.toLowerCase()}
        onClick={onClick}
        style={styles.card}
      >
        <View style={styles.settingsItemIconWrapper}>
          <View style={styles.iconCircle}>
            <IconImageOrComponent />
          </View>
        </View>
        <View style={styles.settingsItemLabelWrapper}>
          <TextV3.BodyStrong color={COLORS.black}>{label}</TextV3.BodyStrong>
        </View>
      </Card>
    );
  };

  const SETTINGS_MAP = [
    {
      label: 'Wallets',
      key: 'Wallets',
      IconImageOrComponent: WalletIcon,
      onClick: onWalletLinkClick,
    },
    {
      label: 'Contacts',
      key: 'Contacts',
      IconImageOrComponent: ContactsIcon,
      onClick: onContactsLinkClicked,
    },
    {
      label: 'Networks',
      key: 'Networks',
      IconImageOrComponent: NetworksIcon,
      onClick: onNetworkLinkClicked,
    },
    {
      label: 'Connected Sites',
      key: 'Connected Sites',
      IconImageOrComponent: LinkedApps,
      onClick: onConnectedSitesClicked,
      imageStyles: styles.linkedIconImage,
    },
  ];

  return (
    <View style={styles.main}>
      <View style={styles.box}>
        <View style={styles.content}>
          {SETTINGS_MAP.map((section_props) => {
            return <RenderSettingsItem {...section_props}/>;
          })}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableHighlight onPress={onAboutLinkClicked}>
          <View style={styles.footer__left}>
            <InfoIcon style={styles.footer__left_img} />
            <TextV3.Caption>Stargazer Wallet {version}</TextV3.Caption>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={handleLogout}>
          <View style={styles.footer__right}>
            <TextV3.Caption>Logout</TextV3.Caption>
            <ExitIcon style={styles.footer__right_img} />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Main;
