import React, { FC } from 'react';
import { View, ScrollView } from 'react-native';
import { Transaction } from 'state/vault/types';
import LoadingTxItem from '../LoadingTxItem';
import StargazerCard from 'assets/images/svg/stargazer-card.svg';
import TextV3 from 'components/TextV3';
import styles from './styles';
import ITxPanelSettings from './types';

const TxsPanel: FC<ITxPanelSettings> = ({
  transactions,
  renderTxItem,
  transactionDescription,
  loading,
}) => {
  const showLoadingList = loading;
  const showTransactions = !showLoadingList && !!transactions?.length;
  const showEmptyList = !showLoadingList && !transactions?.length;

  return (
    <ScrollView
      style={styles.activity}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <View style={styles.activityScrollView}>
        {showTransactions &&
          transactions.map((tx: Transaction, idx: number) => {
            return renderTxItem(tx, idx);
          })}
        {showEmptyList && (
          <View style={styles.noDataContainer}>
            <StargazerCard height={72} />
            <TextV3.BodyStrong extraStyles={styles.noFoundText}>
              {transactionDescription}
            </TextV3.BodyStrong>
          </View>
        )}
        {showLoadingList && (
          <>
            <LoadingTxItem />
            <LoadingTxItem />
            <LoadingTxItem />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default TxsPanel;
