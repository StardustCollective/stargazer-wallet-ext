import React, { FC } from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import LockIcon from 'assets/images/svg/lock-icon.svg';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { ETHEREUM_LOGO, CONSTELLATION_LOGO } from 'constants/index';
import IRemoveWalletSettings from './types';
import styles from './RemoveWalletHeader.scss';

const ICON_SIZE = 64;

const RemoveWalletHeader: FC<IRemoveWalletSettings> = ({ wallet, title, subtitle }) => {
  const isMCW = wallet?.type === KeyringWalletType.MultiChainWallet;
  const isHardware = [
    KeyringWalletType.BitfiAccountWallet,
    KeyringWalletType.LedgerAccountWallet,
  ].includes(wallet?.type);
  const isETH =
    wallet?.type === KeyringWalletType.SingleAccountWallet &&
    wallet?.supportedAssets?.includes(KeyringAssetType.ETH);

  const ICON = isMCW
    ? StargazerIcon
    : isHardware
    ? LockIcon
    : isETH
    ? ETHEREUM_LOGO
    : CONSTELLATION_LOGO;

  return (
    <div className={styles.contentContainer}>
      <div className={styles.walletContainer}>
        {typeof ICON === 'string' && ICON.startsWith('http') ? (
          <div className={styles.iconContainer}>
            <img src={ICON} width={ICON_SIZE} height={ICON_SIZE} alt="Wallet logo" />
          </div>
        ) : (
          <img src={`/${ICON}`} width={64} alt="Wallet logo" />
        )}
        <TextV3.BodyStrong extraStyles={styles.walletLabel} color={COLORS_ENUMS.BLACK}>
          {wallet?.label}
        </TextV3.BodyStrong>
      </div>
      <div className={styles.titleContainer}>
        <TextV3.Header
          extraStyles={styles.title}
          color={COLORS_ENUMS.BLACK}
          align={TEXT_ALIGN_ENUM.CENTER}
        >
          {title}
        </TextV3.Header>
      </div>
      <div className={styles.subtitleContainer}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.SECONDARY_TEXT}
          align={TEXT_ALIGN_ENUM.CENTER}
        >
          {subtitle}
        </TextV3.CaptionStrong>
      </div>
    </div>
  );
};

export default RemoveWalletHeader;
