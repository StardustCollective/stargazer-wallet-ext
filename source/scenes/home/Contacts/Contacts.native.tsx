import React, { FC } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { Avatar } from 'react-native-elements';
import Icon from 'components/Icon';
import styles from './styles';

import IWalletContacts from './types';

const Contacts: FC<IWalletContacts> = ({
  open,
  onClose,
  onChange,
  contacts,
  isValidContact,
}) => {
  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerWhiteSpace} />
        <View style={styles.headerLabel}>
          <TextV3.BodyStrong color={COLORS_ENUMS.DARK_GRAY}>Contacts</TextV3.BodyStrong>
        </View>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={styles.contacts}
        contentContainerStyle={styles.contactsContentContainer}
      >
        <View style={styles.list}>
          {Object.values(contacts).map((contact: IContactState) => (
            <TouchableOpacity onPress={() => onChange(contact.address)} key={contact.id}>
              <View style={styles.item}>
                <View style={styles.contact}>
                  <View style={styles.info}>
                    <Avatar
                      size="medium"
                      rounded
                      containerStyle={{ backgroundColor: '#521e8a' }}
                      icon={{ name: 'user', type: 'font-awesome' }}
                    />
                    <View style={styles.contactTextContainer}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.small} ellipsizeMode="tail" numberOfLines={1}>
                        {contact.address}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Contacts;
