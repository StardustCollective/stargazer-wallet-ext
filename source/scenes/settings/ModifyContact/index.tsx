import React, { useEffect, ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { useController } from 'hooks/index';
import IContactBookState from 'state/contacts/types';
import { RootState } from 'state/store';
import VerifiedIcon from 'assets/images/svg/check-green.svg';
import styles from './index.scss';
import IVaultState, { AssetType } from 'state/vault/types';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

interface IModifyContactView {
  selected?: string;
  navigation: any;
  route: any
}

const ModifyContact: FC<IModifyContactView> = ({ route, navigation }) => {
  const controller = useController();
  const alert = useAlert();
  const type = route.params.type;
  const selected = route.params.selected;
  const { activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
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
  const [address, setAddress] = useState('');

  useEffect(() => {
    if(selected && contacts[selected].address){
      setAddress(contacts[selected].address);
    }
  }, [])

  const isValidAddress = useMemo(() => {
    if (activeWallet.type === KeyringWalletType.MultiChainWallet) {
      return controller.wallet.account.isValidDAGAddress(address) ||
        controller.wallet.account.isValidERC20Address(address);
    }
    else {
      const asset = activeWallet.assets[0];
      if (asset.type === AssetType.Constellation) {
        return controller.wallet.account.isValidDAGAddress(address);
      }
      else {
        return controller.wallet.account.isValidERC20Address(address);
      }
    }
  }, [address]);

  const statusIconClass = clsx(styles.statusIcon, {
    [styles.hide]: !isValidAddress,
  });

  const handleAddressChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAddress(ev.target.value.trim());
    },
    []
  );

  const onSubmit = (data: any) => {
    if (!isValidAddress) {
      alert.removeAll();
      alert.error('Error: Invalid recipient address');
      return;
    }

    controller.contacts.modifyContact(
      type,
      data.name,
      data.address.trim(),
      data.memo,
      selected
    );
    navigation.goBack();
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
      <div className={styles.inputWrap}>
        <img
          src={`/${VerifiedIcon}`}
          alt="checked"
          className={statusIconClass}
        />
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
        <Button
          type="button"
          variant={styles.cancel}
          onClick={() => navigation.goBack()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant={styles.save}
          disabled={!address || !isValidAddress}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default ModifyContact;
