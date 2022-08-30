import React, { FC } from 'react';
import { View, StyleSheet, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';

import * as Progress from 'react-native-progress';
import TextV3 from 'components/TextV3';
import QRCode from 'react-native-qrcode-svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS } from 'assets/styles/_variables';
import Container from 'components/Container';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import CopyIcon from 'assets/images/svg/copy.svg';

import { getNetworkLabel, getNetworkLogo, getNetworkFromChainId } from 'scripts/Background/controllers/EVMChainController/utils';
import { CONSTELLATION_LOGO } from 'constants/index';

import TxsPanel from '../TxsPanel';
import IAssetSettings from './types';
import AssetButtons from '../AssetButtons';
import styles from './styles';
import { AssetSymbol } from 'state/vault/types';

const QR_CODE_SIZE = 240;

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  activeNetwork,
  balanceText,
  fiatAmount,
  transactions,
  onSendClick,
  assets,
  showQrCode,
  setShowQrCode,
  isAddressCopied,
  copyAddress,
}) => {
  const activeAssetStyle = StyleSheet.flatten([styles.mask, activeAsset && activeWallet ? styles.loaderHide : {}]);
  const asset = assets[activeAsset?.id];
  let network = asset?.network;
  // TODO-349: Only Polygon ['ETH', 'AVAX', 'BNB', 'MATIC']
  if ([AssetSymbol.ETH, AssetSymbol.MATIC].includes(asset?.symbol)) {
    const currentNetwork = getNetworkFromChainId(network);
    network = activeNetwork[currentNetwork as keyof typeof activeNetwork];
  }
  const networkLabel = getNetworkLabel(network, asset?.symbol);
  const networkLogo = asset?.symbol === 'DAG' ? CONSTELLATION_LOGO : getNetworkLogo(asset?.network);

  if (activeWallet && activeAsset) {
    return (
      <>
        <ScrollView style={styles.wrapper} contentContainerStyle={styles.assetContentContainer}>
          <View style={styles.center}>
            <View style={styles.balance}>
              <TextV3.HeaderDisplay color={COLORS_ENUMS.WHITE} dynamic extraStyles={styles.balanceText}>
                {balanceText}
              </TextV3.HeaderDisplay>
              <TextV3.Body color={COLORS_ENUMS.WHITE} extraStyles={styles.symbolText}>{assets[activeAsset.id].symbol}</TextV3.Body>
            </View>
            <View style={styles.fiatBalance}>
              <TextV3.Body extraStyles={styles.fiatText}>≈ {fiatAmount}</TextV3.Body>
            </View>
            <View style={styles.actions}>
              <AssetButtons setShowQrCode={setShowQrCode} onSendClick={onSendClick} assetId={activeAsset?.id} />
            </View>
          </View>
          <TxsPanel address={activeAsset.address} transactions={transactions} />
        </ScrollView>
        <Modal animationType="slide" transparent={false} visible={showQrCode}>
          <Container>
            <View style={styles.qrCodeCloseButton}>
              <TouchableOpacity onPress={() => setShowQrCode(false)}>
                <Icon name="close" />
              </TouchableOpacity>
            </View>
            <View style={styles.qrCode}>
              <Tooltip
                visible={isAddressCopied}
                width={80}
                body="Copied"
                arrow
                onOpen={() => copyAddress(activeAsset?.address)}
                skipAndroidStatusBar
              >
                <View style={styles.qrCodeCard}>
                  <View style={styles.network}>
                    <View style={styles.logoContainer}>
                      <Image source={{ uri: networkLogo }} style={styles.logo} />
                    </View>
                    <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                      {networkLabel}
                    </TextV3.BodyStrong>
                  </View>
                  <QRCode
                    value={activeAsset.address}
                    backgroundColor={COLORS.white}
                    color={COLORS.black}
                    size={QR_CODE_SIZE}
                  />
                  <View style={styles.addressContainer}>
                    <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.qrCodeAddressText}>
                      {activeAsset.address.substring(0, 10)}...{activeAsset.address.substring(activeAsset.address.length - 10, activeAsset.address.length)}
                    </TextV3.Caption>
                    <CopyIcon height={20} width={20} />
                  </View>
                </View>
              </Tooltip>
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
