import React, { FC } from 'react';
import { View, ScrollView, Linking } from 'react-native';

import { Transaction } from 'state/vault/types';

import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import ITxPanelSettings from './types';

const TxsPanel: FC<ITxPanelSettings> = ({ transactions, renderTxItem, transactionDescription }) => {
  return (
    <View style={styles.activity}>
      <ScrollView style={styles.activityScrollView}>
        {transactions.length ? (
          transactions.map((tx: Transaction, idx: number) => {
            return renderTxItem(tx, idx);
          })
        ) : (
          <View style={styles.noTx}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>{transactionDescription}</TextV3.Caption>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TxsPanel;
