///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import Portal from '@reach/portal';
import QRCode from 'react-qr-code';
import TextV3 from 'components/TextV3';
import Tooltip from 'components/Tooltip';
import closeIcon from 'assets/images/svg/close.svg';
import copyIcon from 'assets/images/svg/copy.svg';

///////////////////////////
// Types
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import { IQRCodeModal } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './QRCodeModal.scss';

const QRCodeModal: FC<IQRCodeModal> = ({ open, address, onClose, copyAddress, textTooltip }) => {
  ///////////////////////////
  // Render
  ///////////////////////////
  const formattedAddress = `${address.substring(0, 10)}...${address.substring(address.length - 10, address.length)}`;
  return (
    <Portal>
      <div className={clsx(styles.mask, { [styles.open]: open })}>
        <div className={styles.modal}>
          <div className={styles.iconContainer}>
            <div className={styles.icon} onClick={onClose}>
              <img src={`/${closeIcon}`} color="white" height={12} width={12} alt="close" />
            </div>
          </div>
          <div className={styles.contentContainer}>
            <div onClick={() => copyAddress(address)}>
              <Tooltip title={textTooltip} placement="bottom" arrow>
                <div className={styles.qrCodeCard}>
                  <QRCode value={address} />
                  <div className={styles.addressContainer}>
                    <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.qrCodeAddressText}>
                      {formattedAddress}
                    </TextV3.Caption>
                    <img src={`/${copyIcon}`} alt="copy" />
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default QRCodeModal;
