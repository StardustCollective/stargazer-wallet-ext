///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import ArrowIcon from 'assets/images/svg/arrow-left.svg';
import { usePlatformAlert } from 'utils/alertUtil';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////////
// Types
///////////////////////////

import { IBuyAsset } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

const ACTIVITY_INDICATOR_SIZE = 'small';

const BuyAsset: FC<IBuyAsset> = ({
  amount,
  message,
  error,
  setError,
  buttonDisabled,
  buttonLoading,
  provider,
  response,
  handleItemClick,
  handleConfirm,
}) => {
  const showAlert = usePlatformAlert();
  const padList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

  useEffect(() => {
    if (error) {
      showAlert(error, 'danger');
      setError('');
    }
  }, [error]);

  const ProviderIcon = React.memo(() => {
    return <Image source={{ uri: provider.logo }} style={styles.providerIcon} />
  });

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <View style={styles.amountValue}>
          <TextV3.Body dynamic color={COLORS_ENUMS.BLACK}>
            $
          </TextV3.Body>
          <TextV3.HeaderDisplay dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.amountText}>
            {amount}
          </TextV3.HeaderDisplay>
          <TextV3.Body dynamic color={COLORS_ENUMS.BLACK}>
            USD
          </TextV3.Body>
        </View>
        <View style={styles.amountMessage}>
          {response.loading ? (
            <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE} />
          ) : (
            <TextV3.Body color={COLORS_ENUMS.GRAY_100}>{message}</TextV3.Body>
          )}
        </View>
      </View>
      <View style={styles.providerContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.providerTitle}>
          Third Party Provider
        </TextV3.CaptionStrong>
        <TouchableOpacity style={styles.providerCard} disabled>
          <ProviderIcon />
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.providerText}>
            {provider.label}
          </TextV3.BodyStrong>
        </TouchableOpacity>
      </View>
      <View style={styles.numpadContainer}>
        {padList.map((item) => (
          <TouchableOpacity onPress={() => handleItemClick(item)} key={item} style={styles.numPadItem}>
            {item === 'del' ? (
              <ArrowIcon height={24} width={24} />
            ) : (
              <TextV3.Header color={COLORS_ENUMS.BLACK}>{item}</TextV3.Header>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <View style={buttonDisabled ? styles.disabled : {}}>
          <ButtonV3
            title="Confirm"
            disabled={buttonDisabled}
            loading={buttonLoading}
            size={BUTTON_SIZES_ENUM.LARGE}
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            extraStyles={styles.confirmButton}
            extraTitleStyles={styles.confirmButtonText}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </View>
  );
};

export default BuyAsset;
