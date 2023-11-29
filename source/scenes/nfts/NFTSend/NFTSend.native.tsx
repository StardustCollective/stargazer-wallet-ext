import React, { FC, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import TextV3 from 'components/TextV3';
import ButtonV3 from 'components/ButtonV3';
import { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import CheckGreen from 'assets/images/svg/check-green.svg';
import SubstractIcon from 'assets/images/svg/subtract.svg';
import AddIcon from 'assets/images/svg/add.svg';
import TextInput from 'components/TextInput';
import GasSlider from 'components/GasSlider';
import QRCodeButton from 'components/QRCodeButton';
import QRCodeScanner from 'components/QRCodeScanner';
import { formatNumber } from 'scenes/home/helpers';
import { NFTSendProps } from './types';
import styles from './styles';
import {
  QUANTITY,
  CONTINUE,
  RECIPIENT_ADDRESS,
  RECIPIENT_ADDRESS_PLACEHOLDER,
} from './constants';

const NFTSend: FC<NFTSendProps> = ({
  logo,
  amount,
  selectedNFT,
  isERC721,
  control,
  address,
  quantity,
  gas,
  mainAsset,
  errors,
  buttonDisabled,
  isValidAddress,
  handleQRscan,
  onButtonPress,
  onGasPriceChange,
  handleAddressChange,
  handleQuantityChange,
}) => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const showGasSlider = gas.prices.length > 0 && !buttonDisabled;
  const numberQuantity = Number(quantity);

  const RenderQuantityLabel = () => {
    return (
      <View style={styles.quantityLabelContainer}>
        <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.quantityTitle}>
          {QUANTITY}
        </TextV3.Caption>
        <TextV3.Caption color={COLORS_ENUMS.SECONDARY_TEXT}>
          x{formatNumber(amount, 0, 0)}
        </TextV3.Caption>
      </View>
    );
  };
  const RenderQuantityButtons = () => {
    const onSubstract = () => {
      if (numberQuantity > 0) {
        const newValue = numberQuantity - 1;
        handleQuantityChange(newValue.toString());
      }
    };
    const onAdd = () => {
      const newValue = numberQuantity + 1;
      handleQuantityChange(newValue.toString());
    };

    return (
      <View style={styles.quantityButtonsContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={onSubstract}>
          <SubstractIcon />
        </TouchableOpacity>
        <View style={styles.quantityButtonDivider} />
        <TouchableOpacity style={styles.quantityButton} onPress={onAdd}>
          <AddIcon />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: logo }} style={styles.image} />
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
          {selectedNFT?.name}
        </TextV3.CaptionStrong>
      </View>
      {!isERC721 && (
        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="number-pad"
            name="quantity"
            value={quantity}
            label={<RenderQuantityLabel />}
            control={control}
            onChange={(amount) => {
              handleQuantityChange(amount);
            }}
            error={!!errors?.quantity}
            returnKeyType="done"
            rightIcon={<RenderQuantityButtons />}
          />
          <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
            {!!errors?.quantity ? errors?.quantity?.message : ' '}
          </TextV3.Caption>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          name="address"
          value={address}
          placeholder={RECIPIENT_ADDRESS_PLACEHOLDER}
          label={RECIPIENT_ADDRESS}
          control={control}
          onChange={(text) => {
            handleAddressChange(text);
          }}
          error={!!errors?.address}
          returnKeyType="done"
          leftIconContainerStyle={styles.checkGreenContainer}
          leftIcon={isValidAddress && <CheckGreen height={16} width={16} />}
          rightIcon={
            <QRCodeButton
              onPress={() => {
                setCameraOpen(true);
              }}
              size={20}
              style={styles.qrCodeButton}
            />
          }
        />
        <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
          {!!errors?.address ? errors?.address?.message : ' '}
        </TextV3.Caption>
      </View>
      {showGasSlider && (
        <GasSlider gas={gas} asset={mainAsset} onGasPriceChange={onGasPriceChange} />
      )}
      <View style={styles.buttonContainer}>
        <ButtonV3
          title={CONTINUE}
          disabled={buttonDisabled || !showGasSlider}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          onPress={onButtonPress}
        />
      </View>
      <QRCodeScanner
        visble={cameraOpen}
        onRead={(event) => {
          handleQRscan(event.data);
          setCameraOpen(false);
        }}
        onClosePress={() => {
          setCameraOpen(false);
        }}
      />
    </ScrollView>
  );
};

export default NFTSend;
