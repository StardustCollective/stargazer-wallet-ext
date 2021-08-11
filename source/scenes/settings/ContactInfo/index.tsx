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
import { useController, useCopyClipboard } from 'hooks/index';
import Tooltip from 'components/Tooltip';
import { RootState } from 'state/store';
import IContactBookState from 'state/contacts/types';
import { ellipsis } from 'scenes/home/helpers';

import styles from './index.scss';

interface IContactInfoView {
  route: any;
  navigation: any;
}

const ContactInfo: FC<IContactInfoView> = ({ route, navigation }) => {
  const controller = useController();
  const [codeOpened, setCodeOpened] = useState(false);
  const [isCopied, copyText] = useCopyClipboard();
  const contacts: IContactBookState = useSelector(
    (state: RootState) => state.contacts
  );
  const linkTo = useLinkTo();
  const selected = route.params.selected;

  const handleDelete = () => {
    controller.contacts.deleteContact(selected);
    navigation.goBack();
  };

  const handleEdit = () => {
    linkTo(`/setting/contacts/modify?selected=${selected}&type=edit`);
  }

  return (
    <div className={styles.wrapper}>
      {contacts[selected] && (
        <div className={clsx(styles.qrcode, { [styles.hide]: !codeOpened })}>
          <QRCode
            value={contacts[selected].address}
            bgColor="#fff"
            fgColor="#000"
            className={styles.code}
            size={180}
          />
          {contacts[selected].address}
        </div>
      )}
      <div className={clsx(styles.item, styles.main)}>
        <div className={styles.name}>
          <span>Contact Name</span>
          {contacts[selected]?.name}
        </div>
        <Avatar address={contacts[selected]?.address || ''} />
      </div>
      <div className={styles.item}>
        <span>Address</span>
        <div className={styles.address}>
          {ellipsis(contacts[selected]?.address || '')}
          <div className={styles.controls}>
            <Tooltip
              title={isCopied ? 'Copied' : 'Copy Address'}
              placement="bottom"
              arrow
            >
              <IconButton
                className={styles.iconBtn}
                onClick={() => copyText(contacts[selected]?.address || '')}
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              className={styles.iconBtn}
              onClick={() => setCodeOpened(!codeOpened)}
            >
              <img src={`/${QRCodeIcon}`} alt="qrcode" />
            </IconButton>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <span>Memo</span>
        {contacts[selected]?.memo || ''}
      </div>
      <div className={styles.actions}>
        <Button type="button" variant={styles.delete} onClick={handleDelete}>
          Delete
        </Button>
        <Button
          type="button"
          variant={styles.edit}
          onClick={handleEdit}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default ContactInfo;
