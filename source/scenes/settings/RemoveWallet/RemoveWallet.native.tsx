import React, { FC } from 'react';
import { View, Image, ScrollView } from 'react-native';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import IRemoveWalletSettings from './types';
import styles from './styles';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { ETHEREUM_LOGO, CONSTELLATION_LOGO } from 'constants/index';

const ICON_SIZE = 64;
const TITLE = 'Are you sure that you want to remove this wallet?';
const SUBTITLE =
  'You will not be able to restore this wallet without your recovery phrase or private key in the future. Please, make sure you have them saved in a safe place.';

const RemoveWallet: FC<IRemoveWalletSettings> = ({
  wallet,
  handleCancel,
  handleRemoveWallet,
}) => {
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
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
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
          <TextV3.Header
            extraStyles={styles.title}
            color={COLORS_ENUMS.BLACK}
            align={TEXT_ALIGN_ENUM.CENTER}
          >
            {TITLE}
          </TextV3.Header>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.SECONDARY_TEXT}
            align={TEXT_ALIGN_ENUM.CENTER}
          >
            {SUBTITLE}
          </TextV3.CaptionRegular>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title="Cancel"
          extraStyles={styles.button}
          onPress={handleCancel}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE}
          title="Remove"
          extraStyles={[styles.button, styles.removeButton]}
          onPress={handleRemoveWallet}
        />
      </View>
    </ScrollView>
  );
};

export default RemoveWallet;
