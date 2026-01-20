import React, { FC, useEffect } from 'react';
import { Modal, Platform, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import EnableCamera from 'components/EnableCamera';
import Icon from 'components/Icon';
import TextV3 from 'components/TextV3';
import styles from './styles';
import IQRCodeScanner from './types';

const QRCodeScanner: FC<IQRCodeScanner> = ({ visble, onRead, onClosePress }) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission && visble) {
      requestPermission();
    }
  }, [visble, hasPermission, requestPermission]);

  const onGoToSettingsPressed = () => {
    // The modal needs to be refreshed for the camera permission changes
    // to take effect. So we close the modal forcing the user to re-open
    // the QR scanner.
    if (Platform.OS === 'android') {
      onClosePress();
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes?.length && codes[0]?.value) {
        onRead({ data: codes[0].value });
      }
    },
  });

  if (!visble) return null;

  return (
    <Modal animationType="slide" transparent={false} visible={visble} onRequestClose={onClosePress}>
      <View style={styles.qrCameraTopContent}>
        <View style={styles.qrCodeHeader}>
          <View style={styles.qrSectionLeft} />
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
      {visble && hasPermission &&
      <View style={styles.cameraContainer}>
        <Camera isActive={visble} codeScanner={codeScanner} device={device} style={styles.camera} />
      </View>  
      }
      {visble && !hasPermission && <EnableCamera onPress={onGoToSettingsPressed} />}
      <View style={styles.qrCameraBottomContent} /> 
    </Modal>
  )
};

export default QRCodeScanner;
