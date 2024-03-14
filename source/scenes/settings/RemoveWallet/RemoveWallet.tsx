import React, { FC } from 'react';
import clsx from 'clsx';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import IRemoveWalletSettings from './types';
import styles from './RemoveWallet.scss';
import RemoveWalletHeader from './RemoveWalletHeader';
import {
  CANCEL,
  REMOVE,
  SUBTITLE_KEY,
  SUBTITLE_PHRASE,
  TITLE_KEY,
  TITLE_PHRASE,
} from './constants';

const RemoveWallet: FC<IRemoveWalletSettings> = ({
  wallet,
  loading,
  handleCancel,
  handleRemoveWallet,
}) => {
  const hasRecoveryPhrase = wallet?.type === KeyringWalletType.MultiChainWallet;
  const headerTitle = hasRecoveryPhrase ? TITLE_PHRASE : TITLE_KEY;
  const headerSubtitle = hasRecoveryPhrase ? SUBTITLE_PHRASE : SUBTITLE_KEY;
  return (
    <div className={styles.container}>
      <RemoveWalletHeader wallet={wallet} title={headerTitle} subtitle={headerSubtitle} />
      <div className={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.GRAY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={CANCEL}
          extraStyle={styles.button}
          onClick={handleCancel}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          loading={loading}
          label={REMOVE}
          extraStyle={clsx(styles.button, styles.removeButton)}
          onClick={handleRemoveWallet}
        />
      </div>
    </div>
  );
};

export default RemoveWallet;
