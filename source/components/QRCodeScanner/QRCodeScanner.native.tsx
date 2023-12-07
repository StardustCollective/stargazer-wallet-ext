import React, { FC } from 'react';
import { View, TouchableOpacity, Modal, Platform } from 'react-native';
import TextV3 from 'components/TextV3';

import { default as RNQRCodeScanner } from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Icon from 'components/Icon';
import EnableCamera from 'components/EnableCamera';
import styles from './styles';
import IQRCodeScanner from './types';

const QRCodeScanner: FC<IQRCodeScanner> = ({ visble, onRead, onClosePress }) => {
  const onGoToSettingsPressed = () => {
    // The modal needs to be refreshed for the camera permission changes
    // to take effect. So we close the modal forcing the user to re-open
    // the QR scanner.
    if (Platform.OS === 'android') {
      onClosePress();
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visble}>
      <RNQRCodeScanner
        onRead={onRead}
        flashMode={RNCamera.Constants.FlashMode.off}
        cameraProps={{
          notAuthorizedView: <EnableCamera onPress={onGoToSettingsPressed} />,
        }}
        notAuthorizedView={<EnableCamera onPress={onGoToSettingsPressed} />}
        topContent={
          <View style={styles.qrCameraTopContent}>
            <View style={styles.qrCodeHeader}>
              <View style={styles.qrSectionLeft}></View>
              <View>
                <TextV3.Header>Scan QR Code</TextV3.Header>
              </View>
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
        bottomContent={<View style={styles.qrCameraBottomContent}></View>}
      />
    </Modal>
  );
};

export default QRCodeScanner;
