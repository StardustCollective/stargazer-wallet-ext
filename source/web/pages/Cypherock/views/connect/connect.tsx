import React from 'react';
import clsx from 'clsx';
import CypherockLogo from 'assets/images/svg/cypherock-device.svg';
import UsbIcon from 'assets/images/svg/usb.svg';
import DevicesIcon from 'assets/images/svg/devices.svg';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import styles from './styles.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

// Numbers
const CYPHEROCK_LOGO_WIDTH = 145;
const CYPHEROCK_LOGO_HEIGHT = 72;

const ConnectView = () => {
  return (
    <div className={styles.container}>
      <img
        src={`/${CypherockLogo}`}
        alt="Cypherock device"
        height={CYPHEROCK_LOGO_HEIGHT}
        width={CYPHEROCK_LOGO_WIDTH}
      />
      <div className={styles.titleContainer}>
        <TextV3.Header extraStyles={styles.title} align={TEXT_ALIGN_ENUM.CENTER}>
          Connect to your{' '}
          <TextV3.Header extraStyles={clsx(styles.title, styles.bold)}>
            Cypherock
          </TextV3.Header>{' '}
          device
        </TextV3.Header>
      </div>
      <div className={styles.instructionsContainer}>
        <div className={styles.instructionItem}>
          <div className={styles.instructionItemIcon}>
            <img src={`/${UsbIcon}`} alt="USB icon" height={16} width={16} />
          </div>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.instructionText}
          >
            Plug in your Cypherock X1 device and make sure it’s on the main menu.
          </TextV3.CaptionRegular>
        </div>
        <div className={styles.instructionItem}>
          <div className={styles.instructionItemIcon}>
            <img src={`/${DevicesIcon}`} alt="Devices icon" />
          </div>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.instructionText}
          >
            Click the{' '}
            <TextV3.CaptionRegular
              color={COLORS_ENUMS.BLACK}
              extraStyles={clsx(styles.instructionText, styles.instructionTextBold)}
            >
              Connect Cypherock
            </TextV3.CaptionRegular>{' '}
            button and approve the connection to start syncing.
          </TextV3.CaptionRegular>
        </div>
      </div>
    </div>
  );
};

export default ConnectView;
