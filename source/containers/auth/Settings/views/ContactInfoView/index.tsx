import React, { useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopy';
import QRCode from 'qrcode.react';

import Button from 'components/Button';
import QRCodeIcon from 'assets/images/svg/qrcode.svg';
import { useSettingsView } from 'hooks/index';
import { EDIT_CONTACT_VIEW } from '../routes';
import Tooltip from 'components/Tooltip';
import { RootState } from 'state/store';

import styles from './index.scss';

const ContactInfoView = () => {
  const showView = useSettingsView();
  const [codeOpened, setCodeOpened] = useState(false);
  const { accounts, activeIndex } = useSelector(
    (state: RootState) => state.wallet
  );

  return (
    <div className={styles.wrapper}>
      <div className={clsx(styles.qrcode, { [styles.hide]: !codeOpened })}>
        <QRCode
          value={accounts[activeIndex]!.address}
          bgColor="#fff"
          fgColor="#000"
          className={styles.code}
          size={180}
        />
        {accounts[activeIndex]!.address}
      </div>
      <div className={styles.item}>
        <span>Contact Name</span>
        Account 1
      </div>
      <div className={styles.item}>
        <span>Address</span>
        <div className={styles.address}>
          DAG18LR...72F7
          <div className={styles.controls}>
            <Tooltip title="Copy Address" placement="bottom" arrow>
              <IconButton className={styles.iconBtn}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              className={styles.iconBtn}
              onClick={() => setCodeOpened(!codeOpened)}
            >
              <img src={QRCodeIcon} alt="qrcode" />
            </IconButton>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <span>Memo</span>
        My BFF
      </div>
      <div className={styles.actions}>
        <Button type="button" variant={styles.delete}>
          Delete
        </Button>
        <Button
          type="button"
          variant={styles.edit}
          onClick={() => showView(EDIT_CONTACT_VIEW)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default ContactInfoView;
