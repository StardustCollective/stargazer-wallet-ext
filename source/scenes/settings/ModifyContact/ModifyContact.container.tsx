import React, { useEffect, ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useSelector } from 'react-redux';
import { useController } from 'hooks/index';
import { showMessage } from 'react-native-flash-message';
import { RootState } from 'state/store';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';

import { Text } from 'react-native';
import Container from 'scenes/common/Container';

import IContactBookState from 'state/contacts/types';
import IVaultState, { AssetType } from 'state/vault/types';

import ModifyContact from './ModifyContact';

import { IModifyContactView } from './types';

const ModifyContactContainer: FC<IModifyContactView> = ({ route, navigation }) => {
  // const controller = useController();

  // const { type } = route.params;
  // const { selected } = route.params;
  const selected = 'trini';

  // const { activeWallet }: IVaultState = useSelector((state: RootState) => state.vault);
  // const contacts: IContactBookState = useSelector((state: RootState) => state.contacts);
  // const activeWallet = {
  //   wallets: [
  //     {

  //     }
  //   ]
  // }
  const contacts = {
    trini: {
      id: 'trini',
      name: 'Trini',
      address: '0xa49706472Af0Daa902459917eB56ccB3085DF040',
      memo: 'I am trini what is your contact',
    },
    gussy: {
      id: 'gussy',
      name: 'Gussy',
      address: '0xa49706472Af0Daa902459917eB56ccB3085DF040',
      memo: 'I am guster what is your contact',
    },
  };

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      address: yup.string().required(),
      memo: yup.string(),
    }),
  });

  const [address, setAddress] = useState('');

  useEffect(() => {
    if (selected && contacts[selected].address) {
      setAddress(contacts[selected].address);
    }
  }, []);

  const isValidAddress = useMemo(() => {
    // if (activeWallet.type === KeyringWalletType.MultiChainWallet) {
    // return (
    //   // controller.wallet.account.isValidDAGAddress(address) || controller.wallet.account.isValidERC20Address(address)
    // );
    // }
    // const asset = activeWallet.assets[0];
    // if (asset.type === AssetType.Constellation) {
    //   // return controller.wallet.account.isValidDAGAddress(address);
    // }

    // return controller.wallet.account.isValidERC20Address(address);

    return false; //REMOVE
  }, [address]);

  const hideStatusIcon = !isValidAddress;

  const handleAddressChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | React.BaseSyntheticEvent>) => {
      if (ev.nativeEvent?.text) {
        setAddress(ev.nativeEvent.text.trim());
      } else if (ev.target) {
        setAddress(ev.target.value.trim());
      }
    },
    []
  );

  const onSubmit = (data: any) => {
    if (!isValidAddress) {
      showMessage({
        message: 'Error: Invalid recipient address',
        type: 'danger',
      });
      return;
    }

    // controller.contacts.modifyContact(type, data.name, data.address.trim(), data.memo, selected);
    navigation.goBack();
  };

  const onClickCancel = () => {
    console.log('click cancel');
    // navigation.goBack();
  };

  const disabled = !address || !isValidAddress;

  return (
    <Container>
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
