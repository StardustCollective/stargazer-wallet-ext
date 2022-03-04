import React, { FC } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';

import * as Progress from 'react-native-progress';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import QRCode from 'react-native-qrcode-svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS } from 'assets/styles/_variables';
import styles from './styles.ts';
import Container from 'components/Container';
import Icon from 'components/Icon';

import TxsPanel from '../TxsPanel';
import IAssetSettings from './types';

const QR_CODE_SIZE = 240;

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  balanceText,
  fiatAmount,
  transactions,
  onSendClick,
  assets,
  showQrCode,
  setShowQrCode,
}) => {
  const activeAssetStyle = StyleSheet.flatten([styles.mask, activeAsset && activeWallet ? styles.loaderHide : {}]);

  if (activeWallet && activeAsset) {
    return (
      <>
        <View style={styles.wrapper}>
          <View style={styles.center}>
            <View style={styles.balance}>
              <TextV3.HeaderDisplay color={COLORS_ENUMS.WHITE} dynamic extraStyles={styles.balanceText}>
                {balanceText}{' '}
              </TextV3.HeaderDisplay>
              <TextV3.Body color={COLORS_ENUMS.WHITE}>{assets[activeAsset.id].symbol}</TextV3.Body>
            </View>
            <View style={styles.fiatBalance}>
              <TextV3.Body>≈ {fiatAmount}</TextV3.Body>
            </View>
            <View style={styles.actions}>
              <ButtonV3
                title="Send"
                size={BUTTON_SIZES_ENUM.LARGE}
                type={BUTTON_TYPES_ENUM.ACCENT_ONE_SOLID}
                onPress={onSendClick}
              />
            </View>
          </View>
          <TxsPanel address={activeAsset.address} transactions={transactions} />
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={showQrCode}
        >
          <Container>
            <View style={styles.qrCodeCloseButton}>
              <TouchableOpacity onPress={() => setShowQrCode(false)}>
                <Icon name="close" />
              </TouchableOpacity>
            </View>
            <View style={styles.qrCode}>
              <View style={styles.qrCodeCard}>
                <QRCode value={activeAsset.address} backgroundColor={COLORS.white} color={COLORS.black} size={QR_CODE_SIZE} />
                <Text style={styles.qrCodeAddressText}>
                  {activeAsset.address.substring(0, 10)}...{activeAsset.address.substring(activeAsset.address.length - 10, activeAsset.address.length)}
                </Text>
              </View>
            </View>
          </Container>
        </Modal>
      </>
    );
  }

  return (
    <View style={activeAssetStyle}>
      <Progress.Circle size={40} indeterminate color="white" />
    </View>
  );
};

export default AssetDetail;
