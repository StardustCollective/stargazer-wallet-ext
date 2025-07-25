import React, { FC } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import Card from 'components/Card';
import TextV3 from 'components/TextV3';
import NavigationItem from 'components/NavigationItem';

import { COLORS_ENUMS } from 'assets/styles/colors';

import WalletIcon from 'assets/images/svg/wallet.svg';
import ContactsIcon from 'assets/images/svg/contacts.svg';
import NetworksIcon from 'assets/images/svg/networks.svg';
import SecurityIcon from 'assets/images/svg/security.svg';
import SettingsIcon from 'assets/images/svg/settings-adjust.svg';
import InfoIcon from 'assets/images/svg/info.svg';
import ExitIcon from 'assets/images/svg/exit.svg';
import ArrowRightIcon from 'assets/images/svg/arrow-rounded-right.svg';

import { RootState } from 'state/store';

import styles from './styles';

import IMainSettings, { IRenderSettingsItemProps } from './types';

const Main: FC<IMainSettings> = ({
  handleLogout,
  onWalletLinkClick,
  onNetworkLinkClicked,
  onAboutLinkClicked,
  onContactsLinkClicked,
  onSecurityLinkClicked,
  onPersonalizeLinkClicked,
  version,
}) => {
  const { available } = useSelector((state: RootState) => state.biometrics);

  const RenderSettingsItem = React.memo(
    ({ label, IconImageOrComponent, onClick, disabled }: IRenderSettingsItemProps) => {
      const disabledStyle = disabled ? styles.disabled : {};
      return (
        <Card
          id={`settings-${label.toLowerCase()}`}
          onClick={onClick}
          disabled={disabled}
          disabledStyle={disabledStyle}
          style={styles.card}
        >
          <View style={styles.settingsItemIconWrapper}>
            <View style={styles.iconCircle}>
              <IconImageOrComponent />
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.settingsItemLabelWrapper}>
              <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
                {label}
              </TextV3.BodyStrong>
            </View>
            <View style={styles.arrowRightContainer}>
              <ArrowRightIcon width={24} />
            </View>
          </View>
        </Card>
      );
    }
  );

  const SETTINGS_MAP = [
    {
      id: 'settings-wallets',
      label: 'Wallets',
      key: 'Wallets',
      IconImageOrComponent: WalletIcon,
      onClick: onWalletLinkClick,
    },
    {
      id: 'settings-networks',
      label: 'Networks',
      key: 'Networks',
      IconImageOrComponent: NetworksIcon,
      onClick: onNetworkLinkClicked,
    },
    {
      id: 'settings-contacts',
      label: 'Contacts',
      key: 'Contacts',
      IconImageOrComponent: ContactsIcon,
      onClick: onContactsLinkClicked,
    },
    {
      id: 'settings-security',
      label: 'Security',
      key: 'Security',
      IconImageOrComponent: SecurityIcon,
      onClick: onSecurityLinkClicked,
      disabled: !available,
    },
    {
      id: 'settings-personalize',
      label: 'Personalize',
      key: 'Personalize',
      IconImageOrComponent: SettingsIcon,
      onClick: onPersonalizeLinkClicked,
    },
  ];

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <View style={styles.box}>
        <View style={styles.content}>
          {SETTINGS_MAP.map((sectionProps) => {
            return <NavigationItem {...sectionProps} />;
          })}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.footer_section}>
          <TouchableOpacity onPress={onAboutLinkClicked}>
            <View style={styles.footer__left}>
              <InfoIcon style={styles.footer__left_img} />
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                Stargazer Wallet {version}
              </TextV3.Caption>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <View style={styles.footer__right}>
              <TextV3.Caption color={COLORS_ENUMS.PRIMARY}>Logout</TextV3.Caption>
              <ExitIcon style={styles.footer__right_img} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Main;
