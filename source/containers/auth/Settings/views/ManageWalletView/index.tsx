import React from 'react';
import clsx from 'clsx';

import SeedIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import Button from 'components/Button';
import TextInput from 'components/TextInput';

import styles from './index.scss';

const ManageWalletView = () => {
  return (
    <div className={styles.wrapper}>
      <label>Name</label>
      <TextInput name="name" visiblePassword fullWidth variant={styles.input} />
      <label>Backup Options</label>
      <section className={styles.menu}>
        <Icon Component={SeedIcon} />
        <span>Show Recovery Phrase</span>
        <ArrowIcon />
      </section>
      <span>
        If you lose access to this wallet, your funds will be lost, unless you
        back up!
      </span>
      <section className={styles.menu}>
        <Icon Component={DeleteIcon} />
        <span>Delete Wallet</span>
        <ArrowIcon />
      </section>
      <section className={styles.actions}>
        <Button type="button" variant={clsx(styles.button, styles.cancel)}>
          Cancel
        </Button>
        <Button type="submit" variant={clsx(styles.button, styles.save)}>
          Save
        </Button>
      </section>
    </div>
  );
};

export default ManageWalletView;
