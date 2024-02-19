import React, { FC } from 'react';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopy';

import QRCode from 'qrcode.react';
import Avatar from '@devneser/gradient-avatar';

import Button from 'components/Button';
import Tooltip from 'components/Tooltip';

import { ellipsis } from 'scenes/home/helpers';

import QRCodeIcon from 'assets/images/svg/qrcode.svg';

import styles from './ContactInfo.scss';

import IContactInfoSettings from './types';

const ContactInfo: FC<IContactInfoSettings> = ({
  codeOpened,
  setCodeOpened,
  isCopied,
  copyText,
  handleDelete,
  handleEdit,
  contact,
}) => {
  return (
    <div className={styles.wrapper}>
      {contact && (
        <div className={clsx(styles.qrcode, { [styles.hide]: !codeOpened })}>
          <QRCode
            value={contact?.address}
            bgColor="#fff"
            fgColor="#000"
            className={styles.code}
            size={180}
          />
          {contact?.address}
        </div>
      )}
      <div className={clsx(styles.item, styles.main)}>
        <div className={styles.name}>
          <span>Contact Name</span>
          {contact?.name}
        </div>
        <Avatar address={contact?.address || ''} />
      </div>
      <div className={styles.item}>
        <span>Address</span>
        <div className={styles.address}>
          {ellipsis(contact?.address || '')}
          <div className={styles.controls}>
            <Tooltip
              title={isCopied ? 'Copied' : 'Copy Address'}
              placement="bottom"
              arrow
            >
              <IconButton
                className={styles.iconButton}
                onClick={() => copyText(contact?.address || '')}
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              className={styles.iconButton}
              onClick={() => setCodeOpened(!codeOpened)}
            >
              <img src={`/${QRCodeIcon}`} alt="qrcode" />
            </IconButton>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <span>Memo</span>
        {contact?.memo || ''}
      </div>
      <div className={styles.actions}>
        <Button type="button" variant={styles.delete} onClick={handleDelete}>
          Delete
        </Button>
        <Button type="button" variant={styles.edit} onClick={handleEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
};

export default ContactInfo;
