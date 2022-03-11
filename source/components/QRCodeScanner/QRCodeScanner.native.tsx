import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import TextV3 from 'components/TextV3';

import { default as RNQRCodeScanner }  from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Icon from 'components/Icon';
import styles from './styles';

const QRCodeScanner = ({
  visble,
  onRead,
  onClosePress,
}) => {

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visble}
    >
      <RNQRCodeScanner
        onRead={onRead}
        flashMode={RNCamera.Constants.FlashMode.off}
        topContent={
          <View style={styles.qrCameraTopContent}>
            <View style={styles.qrCodeHeader}>
              <View style={styles.qrSectionLeft}></View>
              <View><TextV3.Header>Scan QR Code</TextV3.Header></View>
              <View style={styles.qrSectionRight}>
                <View style={styles.qrCodeIcon}>
                  <TouchableOpacity onPress={onClosePress}>
                    <Icon name="close" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        }
        bottomContent={
          <View style={styles.qrCameraBottomContent}></View>
        }
      />
    </Modal>
  )

}

export default QRCodeScanner;