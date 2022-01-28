import React, { FC, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';

import { useSelector } from 'react-redux';

import { IContactState } from 'state/contacts/types';
import addHeader from 'navigation/headers/add';
// import { COLORS } fomr 'assets/styles/_variables';

import styles from './styles';

import IContactSettings from './types';

const Contacts: FC<IContactSettings> = ({ contacts, handleSelect, addContactLabel }) => {
  if (Object.keys(contacts).length === 0) {
    return (
      <ScrollView stickyHeaderIndices={[1]} style={styles.wrapper}>
        <View style={styles.addContactLabel}>
          <Text>{addContactLabel}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.contacts}>
      <View style={styles.list}>
        {Object.values(contacts).map((contact: IContactState) => (
          <TouchableOpacity onPress={() => handleSelect(contact.id)} key={contact.id}>
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
    </View>
  );
};

export default Contacts;
