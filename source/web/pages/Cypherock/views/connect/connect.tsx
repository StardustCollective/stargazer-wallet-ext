import React from 'react';
// import CypherockLogo from 'assets/images/cypherock.png';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import styles from './styles.scss';
import type { IWalletItem } from '@cypherock/sdk-app-manager';
import { COLORS_ENUMS } from 'assets/styles/colors';

// Strings
const CONNECT_TO_CYPHEROCK_DEVICE_STRING = 'Connect to your Cypherock device';
const CONNECT_CYPHEROCK_STRING = 'Connect Cypherock';

// Numbers
// const CYPHEROCK_LOGO_WIDTH = 200;
// const CYPHEROCK_LOGO_HEIGHT = 200;

interface IConnectProps {
  onConnectClick: () => void;
  onSelectWalletClick: () => void;
  wallets: IWalletItem[];
  selectedWallet: IWalletItem;
  address: string;
}

const ConnectView = ({
  onConnectClick,
  onSelectWalletClick,
  wallets,
  selectedWallet,
  address,
}: IConnectProps) => {
  console.log('wallets', wallets);
  console.log('selectedWallet', selectedWallet);
  console.log('address', address);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          {/* <img
            src={CypherockLogo}
            alt="Cypherock Logo"
            height={CYPHEROCK_LOGO_HEIGHT}
            width={CYPHEROCK_LOGO_WIDTH}
          /> */}
        </div>
        <div className={styles.title}>
          <TextV3.Caption>{CONNECT_TO_CYPHEROCK_DEVICE_STRING}</TextV3.Caption>
        </div>
      </div>
      <div className={styles.actions}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
          label={CONNECT_CYPHEROCK_STRING}
          onClick={onConnectClick}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
          label={'Select wallet'}
          onClick={onSelectWalletClick}
        />
      </div>
      <div className={styles.content}>
        {!!wallets?.length && (
          <div className={styles.box}>
            <TextV3.Body color={COLORS_ENUMS.BLACK}>Wallets</TextV3.Body>
            {wallets.map((wallet) => (
              <div key={wallet.name}>
                <TextV3.Body color={COLORS_ENUMS.BLACK}>{wallet.name}</TextV3.Body>
              </div>
            ))}
          </div>
        )}
        {selectedWallet && (
          <div className={styles.box}>
            <TextV3.Body color={COLORS_ENUMS.BLACK}>Selected wallet</TextV3.Body>
            <div key={selectedWallet.name}>
              <TextV3.Body color={COLORS_ENUMS.BLACK}>{selectedWallet.name}</TextV3.Body>
            </div>
          </div>
        )}
        {address && (
          <div className={styles.box}>
            <TextV3.Body color={COLORS_ENUMS.BLACK}>Wallet address</TextV3.Body>
            <div key={address}>
              <TextV3.Body color={COLORS_ENUMS.BLACK}>{address}</TextV3.Body>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectView;
