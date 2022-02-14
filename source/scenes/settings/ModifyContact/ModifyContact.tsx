import React, { FC } from 'react';
import clsx from 'clsx';

import Button from 'components/Button';
import TextInput from 'components/TextInput';
import VerifiedIcon from 'assets/images/svg/check-green.svg';

import styles from './ModifyContact.scss';

import IModifyContactSettings from './types';

const ModifyContact: FC<IModifyContactSettings> = ({
  handleSubmit,
  onSubmit,
  handleAddressChange,
  selected,
  hideStatusIcon,
  contacts,
  register,
  address,
  isValidAddress,
  onClickCancel,
  disabled,
}) => {
  const statusIconClass = clsx(styles.statusIcon, {
    [styles.hide]: hideStatusIcon,
  });

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <span>Contact Name</span>
      <TextInput
        name="name"
        fullWidth
        variant={styles.input}
        defaultValue={selected && contacts[selected].name}
        inputRef={register}
      />
      <span>Address</span>
      <div className={styles.inputWrap}>
        <img src={`/${VerifiedIcon}`} alt="checked" className={statusIconClass} />
        <TextInput
          name="address"
          fullWidth
          value={address}
          variant={clsx(styles.input, { [styles.verfied]: isValidAddress })}
          defaultValue={address}
          onChange={handleAddressChange}
          inputRef={register}
        />
      </div>
      <span>Memo</span>
      <TextInput
        name="memo"
        fullWidth
        multiline
        variant={styles.textarea}
        defaultValue={selected && contacts[selected].memo}
        inputRef={register}
      />
      <div className={styles.actions}>
        <Button type="button" variant={styles.cancel} onClick={onClickCancel}>
          Cancel
        </Button>
        <Button type="submit" variant={styles.save} disabled={disabled}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default ModifyContact;
