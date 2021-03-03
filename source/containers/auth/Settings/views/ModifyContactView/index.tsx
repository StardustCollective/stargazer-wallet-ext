import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { useController, useSettingsView } from 'hooks/index';
import IContactBookState from 'state/contacts/types';

import styles from './index.scss';
import { RootState } from 'state/store';
import { CONTACTS_VIEW } from '../routes';
interface IModifyContactView {
  type: 'add' | 'edit';
  selected?: string;
}

const ModifyContactView: FC<IModifyContactView> = ({ type, selected }) => {
  const controller = useController();
  const showView = useSettingsView();
  const history = useHistory();
  const contacts: IContactBookState = useSelector(
    (state: RootState) => state.contacts
  );
  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      address: yup.string().required(),
      memo: yup.string(),
    }),
  });

  const onSubmit = (data: any) => {
    console.log(data.address.trim());
    if (!controller.wallet.account.isValidDAGAddress(data.address.trim()))
      return;
    controller.contacts.modifyContact(
      type,
      data.name,
      data.address.trim(),
      data.memo,
      selected
    );
    showView(CONTACTS_VIEW);
  };

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
      <TextInput
        name="address"
        fullWidth
        variant={styles.input}
        defaultValue={selected && contacts[selected].address}
        inputRef={register}
      />
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
        <Button
          type="button"
          variant={styles.cancel}
          onClick={() => history.goBack()}
        >
          Cancel
        </Button>
        <Button type="submit" variant={styles.save}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default ModifyContactView;
