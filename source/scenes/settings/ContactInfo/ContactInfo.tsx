import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import CopyIcon from '@material-ui/icons/FileCopy';
import QRCode from 'qrcode.react';
import Avatar from '@devneser/gradient-avatar';
import { useLinkTo } from '@react-navigation/native';

import Button from 'components/Button';
import QRCodeIcon from 'assets/images/svg/qrcode.svg';
import Tooltip from 'components/Tooltip';
import IContactBookState from 'state/contacts/types';
import { ellipsis } from 'scenes/home/helpers';

import styles from './index.scss';

import IContactInfoSettings from './types';

const ContactInfo: FC<IContactInfoSettings> = ({
  codeOpened,
  setCodeOpened,
  isCopied,
  copyText,
  contacts,
  selectedContactId,
  handleDelete,
  handleEdit,
}) => {
  return (
    <div className={styles.wrapper}>
      {contacts[selectedContactId] && (
        <div className={clsx(styles.qrcode, { [styles.hide]: !codeOpened })}>
          <QRCode
            value={contacts[selectedContactId].address}
            bgColor="#fff"
            fgColor="#000"
            className={styles.code}
            size={180}
          />
          {contacts[selectedContactId].address}
        </div>
      )}
      <div className={clsx(styles.item, styles.main)}>
        <div className={styles.name}>
          <span>Contact Name</span>
          {contacts[selectedContactId]?.name}
        </div>
        <Avatar address={contacts[selectedContactId]?.address || ''} />
      </div>
      <div className={styles.item}>
        <span>Address</span>
        <div className={styles.address}>
          {ellipsis(contacts[selectedContactId]?.address || '')}
          <div className={styles.controls}>
            <Tooltip title={isCopied ? 'Copied' : 'Copy Address'} placement="bottom" arrow>
              <IconButton
                className={styles.iconButton}
                onClick={() => copyText(contacts[selectedContactId]?.address || '')}
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <IconButton className={styles.iconButton} onClick={() => setCodeOpened(!codeOpened)}>
              <img src={`/${QRCodeIcon}`} alt="qrcode" />
            </IconButton>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <span>Memo</span>
        {contacts[selectedContactId]?.memo || ''}
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
