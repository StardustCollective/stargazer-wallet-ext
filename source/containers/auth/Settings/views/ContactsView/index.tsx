import React from 'react';
import UserIcon from '@material-ui/icons/AccountCircleRounded';

import Button from 'components/Button';
import Icon from 'components/Icon';
import { useSettingsView } from 'hooks/index';
import { ADD_CONTACT_VIEW, EDIT_CONTACT_VIEW } from '../routes';
import styles from './index.scss';

const ContactsView = () => {
  const showView = useSettingsView();

  return (
    <div className={styles.contacts}>
      <Button
        type="button"
        variant={styles.add}
        onClick={() => showView(ADD_CONTACT_VIEW)}
      >
        Add contact
      </Button>
      <ul className={styles.list}>
        <li onClick={() => showView(EDIT_CONTACT_VIEW)}>
          <div className={styles.contact}>
            <span className={styles.info}>
              <Icon Component={UserIcon} />
              <div>
                Account 1<small>DAG18LR...72F7</small>
              </div>
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContactsView;
