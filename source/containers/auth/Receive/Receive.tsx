import React from 'react';
import clsx from 'clsx';
import QRCode from 'qrcode.react';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopy';
import Header from 'containers/common/Header';
import { useController, useCopyClipboard } from 'hooks/index';

import styles from './Receive.scss';

const WalletReceive = () => {
  const controller = useController();
  const [isCopied, copyText] = useCopyClipboard();
  const account = controller.wallet.account.currentAccount();

  return (
    <div className={styles.wrapper}>
      <Header backLink="/home" />
      <section className={styles.subheading}>Receive DAG</section>
      <section className={styles.content}>
        <div className={styles.address}>
          <QRCode
            value={account!.address}
            bgColor="#fff"
            fgColor="#000"
            className={styles.qrcode}
            size={180}
          />
          {account!.address}
        </div>
        <IconButton
          className={clsx(styles.iconBtn, { [styles.active]: isCopied })}
          onClick={() => copyText(account!.address)}
        >
          <CopyIcon className={styles.icon} />
        </IconButton>
        <span className={clsx({ [styles.active]: isCopied })}>
          {isCopied ? 'Copied Address' : 'Copy'}
        </span>
      </section>
    </div>
  );
};

export default WalletReceive;
