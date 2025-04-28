import React from 'react';
// import CypherockLogo from 'assets/images/cypherock.png';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import styles from './styles.scss';

// Strings
const CONNECT_TO_CYPHEROCK_DEVICE_STRING = 'Connect to your Cypherock device';
const CONNECT_CYPHEROCK_STRING = 'Connect Cypherock';

// Numbers
// const CYPHEROCK_LOGO_WIDTH = 200;
// const CYPHEROCK_LOGO_HEIGHT = 200;

interface IConnectProps {
  onConnectClick: () => void;
  onSelectWalletClick: () => void;
}

const ConnectView = ({ onConnectClick, onSelectWalletClick }: IConnectProps) => {
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
      <div className={styles.content}>
        <div className={styles.box}></div>
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
    </div>
  );
};

export default ConnectView;
