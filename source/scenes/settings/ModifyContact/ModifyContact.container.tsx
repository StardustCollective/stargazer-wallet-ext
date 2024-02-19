import React, { useEffect, FC, useCallback, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { RootState } from 'state/store';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

import { getAccountController, getContactsController } from 'utils/controllersUtils';

import Container from 'components/Container';

import IContactBookState from 'state/contacts/types';
import IVaultState, { AssetType } from 'state/vault/types';

import { removeEthereumPrefix } from 'utils/addressUtil';
import ModifyContact from './ModifyContact';

import { IModifyContactView } from './types';

const ModifyContactContainer: FC<IModifyContactView> = ({ route, navigation }) => {
  const accountController = getAccountController();
  const { type } = route.params;
  const { selected } = route.params;

  const contactsController = getContactsController();
  const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  const contacts: IContactBookState = useSelector((state: RootState) => state.contacts);

  const { setValue, handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      address: yup.string().required(),
      memo: yup.string(),
    }),
  });

  const [address, setAddress] = useState('');

  useEffect(() => {
    if (selected && contacts[selected].address) {
      const { address: contactAddress } = contacts[selected];
      setAddress(contactAddress);
      setValue('address', contactAddress);
    }
  }, []);

  const isValidAddress = useMemo(() => {
    if (address) {
      if (activeWallet.type === KeyringWalletType.MultiChainWallet) {
        return (
          accountController.isValidDAGAddress(address) ||
          accountController.isValidERC20Address(address)
        );
      }
      const asset = activeWallet.assets[0];
      if (asset.type === AssetType.Constellation) {
        return accountController.isValidDAGAddress(address);
      }
      return accountController.isValidERC20Address(address);
    }
    return false;
  }, [address]);

  const hideStatusIcon = !isValidAddress;

  const handleAddressChange = useCallback((ev: any) => {
    if (ev.nativeEvent?.text) {
      const addressValue = ev.nativeEvent.text.trim();
      const filteredAddress = removeEthereumPrefix(addressValue);
      setAddress(filteredAddress);
      setValue('address', filteredAddress);
    } else if (ev.target) {
      const addressValue = ev.target.value.trim();
      const filteredAddress = removeEthereumPrefix(addressValue);
      setAddress(filteredAddress);
    }
  }, []);

  const onSubmit = (data: any) => {
    if (!isValidAddress) {
      showMessage({
        message: 'Error: Invalid recipient address',
        type: 'danger',
      });
      return;
    }
    contactsController.modifyContact(
      type,
      data.name,
      data.address.trim(),
      data.memo,
      selected
    );
    navigation.goBack();
  };

  const onClickCancel = () => {
    navigation.goBack();
  };

  const disabled = !address || !isValidAddress;

  return (
    <Container safeArea={false}>
      <ModifyContact
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        handleAddressChange={handleAddressChange}
        selected={selected}
        hideStatusIcon={hideStatusIcon}
        contacts={contacts}
        register={register}
        onClickCancel={onClickCancel}
        disabled={disabled}
        isValidAddress={isValidAddress}
        address={address}
      />
    </Container>
  );
};

export default ModifyContactContainer;
