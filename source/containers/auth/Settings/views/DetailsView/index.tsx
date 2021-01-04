import React from 'react';
import QRCode from 'qrcode.react';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/CallMissedOutgoing';
import CopyIcon from '@material-ui/icons/FileCopy';
import { useController } from 'hooks/index';
import { ellipsis } from 'containers/auth/helpers';

import styles from './index.scss';

const DetailsView = () => {
  const controller = useController();
  const accountInfo = controller.wallet.account.currentAccount();
  return (
    <div className={styles.wrapper}>
      {accountInfo && (
        <>
          <QRCode
            value={accountInfo.address}
            bgColor="#EDEDED"
            fgColor="#000"
            className={styles.qrcode}
            size={180}
          />
          <div className={styles.actions}>
            <IconButton className={styles.iconBtn}>
              <CopyIcon className={styles.icon} />
            </IconButton>
            <span className={styles.address}>
              {ellipsis(accountInfo.address)}
            </span>
            <IconButton className={styles.iconBtn}>
              <LinkIcon className={styles.icon} />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailsView;
