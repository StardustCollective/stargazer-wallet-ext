import React, { FC } from 'react';
import clsx from 'clsx';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import StargazerIcon from 'assets/images/svg/stargazer-rounded.svg';
import LockIcon from 'assets/images/svg/lock-icon.svg';
import IRemoveWalletSettings from './types';
import styles from './RemoveWallet.scss';
import { KeyringAssetType, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { ETHEREUM_LOGO, CONSTELLATION_LOGO } from 'constants/index';

const ICON_SIZE = 40;
const TITLE = 'Are you sure that you want to remove this wallet?';
const SUBTITLE =
  'You will not be able to restore this wallet without your recovery phrase or private key in the future. Please, make sure you have them saved in a safe place.';

const RemoveWallet: FC<IRemoveWalletSettings> = ({
  wallet,
  handleCancel,
  handleRemoveWallet,
}) => {
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
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.walletContainer}>
          {typeof ICON === 'string' && ICON.startsWith('http') ? (
            <div className={styles.iconContainer}>
              <img src={ICON} width={ICON_SIZE} height={ICON_SIZE} />
            </div>
          ) : (
            <img src={`/${ICON}`} width={64} />
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
            {TITLE}
          </TextV3.Header>
        </div>
        <div className={styles.subtitleContainer}>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.SECONDARY_TEXT}
            align={TEXT_ALIGN_ENUM.CENTER}
          >
            {SUBTITLE}
          </TextV3.CaptionRegular>
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label="Cancel"
          extraStyle={styles.button}
          onClick={handleCancel}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label="Remove"
          extraStyle={clsx(styles.button, styles.removeButton)}
          onClick={handleRemoveWallet}
        />
      </div>
    </div>
  );
};

export default RemoveWallet;
