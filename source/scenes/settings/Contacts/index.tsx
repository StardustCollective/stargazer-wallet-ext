import React, { FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '@devneser/gradient-avatar';

import Button from 'components/Button';
import { useSettingsView } from 'hooks/index';
import { RootState } from 'state/store';
import IContactBookState, { IContactState } from 'state/contacts/types';
import { useLinkTo } from '@react-navigation/native';
import addHeader from 'navigation/headers/add';

import styles from './index.scss';

interface IContactsView {
  onSelect: (id: string) => void;
  navigation: any;
}

const Contacts: FC<IContactsView> = ({ onSelect, navigation }) => {
  const contacts: IContactBookState = useSelector(
    (state: RootState) => state.contacts
  );
  const linkTo = useLinkTo();
  // const { wallet, asset }: IVaultState = useSelector(
  //   (state: RootState) => state.vault
  // );
  // const controller = useController();
  const showView = useSettingsView();
  // const history = useHistory();

  const handleSelect = (id: string) => {
    onSelect(id);
    // showView(CONTACT_VIEW);
  };

  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/setting/contacts/modify?type=add');
    }
    navigation.setOptions(addHeader({ navigation, onRightIconClick }));
  }, []);

  // const handleSelectedContact = (ev: any, address: string) => {
  //   ev.stopPropagation();
  //   if (controller.wallet.account.isValidDAGAddress(address)) {
  //     controller.wallet.account.updateAccountActiveAsset(
  //       activeAccountId,
  //       AssetType.Constellation
  //     );
  //   } else if (controller.wallet.account.isValidERC20Address(address)) {
  //     controller.wallet.account.updateAccountActiveAsset(
  //       activeAccountId,
  //       AssetType.Ethereum
  //     );
  //   }
  //   history.push(`/send/${address}`);
  // };

  return (
    <div className={styles.contacts}>
      {Object.keys(contacts).length === 0 &&
        <div className={styles.actions}>
          <span> Please click the "+" to add a contact.</span>
        </div>
      }
      <ul className={styles.list}>
        {Object.values(contacts)
          // .filter(
          //   (contact: IContactState) =>
          //     wallet.supportedAssets ||
          //     (wallet.id &&
          //       contact.address.toLowerCase().startsWith('0x')) ||
          //     (!wallet.id.startsWith(ETH_PREFIX) &&
          //       !contact.address.toLowerCase().startsWith('0x'))
          // )
          .map((contact: IContactState) => (
            <li onClick={() => handleSelect(contact.id)} key={contact.id}>
              <div className={styles.contact}>
                <span className={styles.info}>
                  {/* <Icon Component={UserIcon} /> */}
                  <Avatar address={contact.address} size={20} />
                  <div>
                    {contact.name}
                    <small>{contact.address}</small>
                  </div>
                </span>
                {/*<IconButton*/}
                {/*  className={styles.send}*/}
                {/*  onClick={(ev) => handleSelectedContact(ev, contact.address)}*/}
                {/*>*/}
                {/*  <SendIcon />*/}
                {/*</IconButton>*/}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Contacts;
