import React, { FC } from 'react';
import { View, TouchableHighlight } from 'react-native';

import Card from 'components/Card';
import TextV3 from 'components/TextV3';

import { COLORS } from 'assets/styles/_variables';

import WalletIcon from 'assets/images/svg/wallet.svg';
import ContactsIcon from 'assets/images/svg/contacts.svg';
import NetworksIcon from 'assets/images/svg/networks.svg';
import InfoIcon from 'assets/images/svg/info.svg';
import ExitIcon from 'assets/images/svg/exit.svg';

import styles from './styles';

import IMainSettings, { IRenderSettingsItemProps } from './types';

const RenderSettingsItem = ({ label, IconImageOrComponent, onClick }: IRenderSettingsItemProps) => {
  return (
    <Card id={`settings-${label.toLowerCase()}`} onClick={onClick} style={styles.card}>
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

const Main: FC<IMainSettings> = ({
  handleLogout,
  onWalletLinkClick,
  onNetworkLinkClicked,
  onAboutLinkClicked,
  onContactsLinkClicked,
  version,
}) => {
  const RenderSettingsItem = React.memo(({ label, IconImageOrComponent, onClick }: IRenderSettingsItemProps) => {
    return (
      <Card id={`settings-${label.toLowerCase()}`} onClick={onClick} style={styles.card}>
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
  });

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
  ];

  return (
    <View style={styles.main}>
      <View style={styles.box}>
        <View style={styles.content}>
          {SETTINGS_MAP.map((sectionProps) => {
            return <RenderSettingsItem {...sectionProps} />; // eslint-disable-line
          })}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.footer_section}>
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
    </View>
  );
};

export default Main;
