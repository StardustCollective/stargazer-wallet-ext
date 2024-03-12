import React, { FC } from 'react';
import { View, Image } from 'react-native';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { ETHEREUM_LOGO, CONSTELLATION_LOGO } from 'constants/index';
import styles from './styles';
import IRemoveWalletHeader from './types';

const ICON_SIZE = 64;

const RemoveWalletHeader: FC<IRemoveWalletHeader> = ({ wallet, title, subtitle }) => {
  const isMCW = wallet?.type === KeyringWalletType.MultiChainWallet;
  const isETH =
    wallet?.type === KeyringWalletType.SingleAccountWallet &&
    wallet?.supportedAssets?.includes(KeyringAssetType.ETH);

  const ICON = isMCW ? (
    <StargazerIcon width={ICON_SIZE} height={ICON_SIZE} />
  ) : isETH ? (
    ETHEREUM_LOGO
  ) : (
    CONSTELLATION_LOGO
  );

  return (
    <View style={styles.contentContainer}>
      <View style={styles.walletContainer}>
        {typeof ICON === 'string' && ICON.startsWith('http') ? (
          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={{ uri: ICON }} />
          </View>
        ) : (
          <View style={styles.iconComponent}>{ICON}</View>
        )}
        <TextV3.BodyStrong extraStyles={styles.walletLabel} color={COLORS_ENUMS.BLACK}>
          {wallet?.label}
        </TextV3.BodyStrong>
      </View>
      <View>
        <TextV3.Header extraStyles={styles.title} align={TEXT_ALIGN_ENUM.CENTER}>
          {title}
        </TextV3.Header>
        <TextV3.BodyStrong
          color={COLORS_ENUMS.SECONDARY_TEXT}
          extraStyles={styles.subtitle}
          align={TEXT_ALIGN_ENUM.CENTER}
        >
          {subtitle}
        </TextV3.BodyStrong>
      </View>
    </View>
  );
};

export default RemoveWalletHeader;
