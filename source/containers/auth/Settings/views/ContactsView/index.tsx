import React from 'react';
import UserIcon from '@material-ui/icons/AccountCircleRounded';

import Button from 'components/Button';
import styles from './index.scss';
import Icon from 'components/Icon';

const ContactsView = () => {
  return (
    <div className={styles.contacts}>
      <Button type="button" variant={styles.add}>
        Add contact
      </Button>
      <ul className={styles.list}>
        <li>
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
