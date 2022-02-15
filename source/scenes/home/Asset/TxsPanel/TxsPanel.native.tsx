import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Transaction } from 'state/vault/types';

import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';

import ITxPanelSettings from './types';

const TxsPanel: FC<ITxPanelSettings> = ({ transactions, renderTxItem, transactionDescription }) => {
  console.log('NATIVE TXPNAEL');
  transactions = [
    // {
    //   hash: '3423423sdfsfsdfsd',
    //   balance: '0x056bc75e2d63100000',
    //   address: '0x50cec516aA1a9434692E63233500b6976525eBD8',
    //   amount: '21312321x3341',
    //   receiver: '0x50cec516aA1a9434692E63233500b6976525eBD8',
    //   sender: '0x50cec516aA1a9434692E63233500b6976525eBD8',
    //   fee: '00x1231231',
    //   isDummy: true,
    //   timeAgo: '231232',
    //   status: '',
    //   timestamp: '',
    //   lastTransactionRef: {
    //     prevHash: '234242342432',
    //     ordinal: '234234242342342',
    //   },
    //   snapshotHash: '2423423423423',
    //   checkpointBlock: '23424234234',
    // },
  ];
  console.log('transcription description', transactionDescription);

  return (
    <View style={styles.activity}>
      {transactions.length ? (
        <View>
          {transactions.map((tx: Transaction, idx: number) => {
            return renderTxItem(tx, idx);
          })}
        </View>
      ) : (
        <View style={styles.noTx}>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>{transactionDescription}</TextV3.Caption>
        </View>
      )}
    </View>
  );
};

export default TxsPanel;
