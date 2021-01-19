import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import QRCode from 'qrcode.react';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopy';
import Header from 'containers/common/Header';
import { useCopyClipboard } from 'hooks/index';
import { RootState } from 'state/store';

import styles from './Receive.scss';

const WalletReceive = () => {
  const [isCopied, copyText] = useCopyClipboard();
  const { accounts, activeIndex } = useSelector(
    (state: RootState) => state.wallet
  );

  return (
    <div className={styles.wrapper}>
      <Header backLink="/home" />
      <section className={styles.subheading}>Receive DAG</section>
      <section className={styles.content}>
        <div className={styles.address}>
          <QRCode
            value={accounts[activeIndex]!.address}
            bgColor="#fff"
            fgColor="#000"
            className={styles.qrcode}
            size={180}
          />
          {accounts[activeIndex]!.address}
        </div>
        <IconButton
          className={clsx(styles.iconBtn, { [styles.active]: isCopied })}
          onClick={() => copyText(accounts[activeIndex]!.address)}
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
