import React, { FC, useState } from 'react';
import clsx from 'clsx';
import Container, { CONTAINER_COLOR } from 'components/Container';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import BitfiIcon from 'assets/images/svg/bitfi.svg';
import CypherockIcon from 'assets/images/svg/cypherock.svg';
import styles from './SelectHardwareWallet.scss';
import { useLinkTo } from '@react-navigation/native';

enum HARDWARE_WALLET {
  bitfi = 'bitfi',
  cypherock = 'cypherock',
}

const SelectHardwareWallet: FC = () => {
  const linkTo = useLinkTo();

  const [selectedWallet, setSelectedWallet] = useState<HARDWARE_WALLET | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleSelectWallet = (wallet: HARDWARE_WALLET) => {
    setSelectedWallet(wallet);
    setDisabled(false);
  };

  const handleNext = () => {
    if (selectedWallet) {
      window.open(`/${selectedWallet}.html`, '_newtab');
    }
  };

  const handleCancel = () => {
    linkTo('/settings/wallets/add');
  };

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} safeArea={false}>
      <div className={styles.container}>
        <div className={styles.wallets}>
          <div
            className={clsx(styles.box, {
              [styles.selected]: selectedWallet === HARDWARE_WALLET.bitfi,
            })}
            onClick={() => handleSelectWallet(HARDWARE_WALLET.bitfi)}
          >
            <img src={`/${BitfiIcon}`} height={100} width={100} alt="bitfi logo" />
          </div>
          <div
            className={clsx(styles.box, {
              [styles.selected]: selectedWallet === HARDWARE_WALLET.cypherock,
            })}
            onClick={() => handleSelectWallet(HARDWARE_WALLET.cypherock)}
          >
            <img src={`/${CypherockIcon}`} height={80} width={80} alt="cypherock logo" />
          </div>
        </div>
        <div className={styles.buttons}>
          <ButtonV3
            label="Cancel"
            type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
            size={BUTTON_SIZES_ENUM.MEDIUM}
            onClick={handleCancel}
            extraStyle={styles.cancelButton}
          />
          <ButtonV3
            label="Next"
            type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.MEDIUM}
            onClick={handleNext}
            disabled={disabled}
            extraStyle={styles.nextButton}
          />
        </div>
      </div>
    </Container>
  );
};

export default SelectHardwareWallet;
