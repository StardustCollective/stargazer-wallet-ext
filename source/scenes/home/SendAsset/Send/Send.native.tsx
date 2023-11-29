///////////////////////////
// Modules
///////////////////////////

import React, { useState, FC } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';
import { Input } from 'react-native-elements';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import InputClickable from 'components/InputClickable';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextInput from 'components/TextInput';
import PurpleSlider from 'components/PurpleSlider';
import QRCodeScanner from 'components/QRCodeScanner';
import QRCodeButton from 'components/QRCodeButton';

///////////////////////////
// Types
///////////////////////////

import { AssetType } from 'state/vault/types';
import { IWalletSend } from './types';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////////
// Scene
///////////////////////////

import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';
import Contact from 'scenes/home/Contacts';

///////////////////////////
// Constants
///////////////////////////

const EXTRA_SCROLL_HEIGHT = scale(25);
const QR_CODE_BUTTON_SIZE = 25;

const Send: FC<IWalletSend> = ({
  control,
  modalOpened,
  setModalOpen,
  handleSelectContact,
  handleSubmit,
  handleAddressChange,
  handleAmountChange,
  handleSetMax,
  handleFeeChange,
  handleGetDAGTxFee,
  handleGasPriceChange,
  handleClose,
  onSubmit,
  isExternalRequest,
  isDisabled,
  isValidAddress,
  balances,
  activeAsset,
  nativeToken,
  assetInfo,
  address,
  register,
  amount,
  getFiatAmount,
  errors,
  fee,
  recommend,
  gasPrices,
  gasPrice,
  gasFee,
  gasSpeedLabel,
  decimalPointOnAmount,
  decimalPointOnFee,
  networkTypeOptions,
  basePriceId,
}) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  const InputRightButton = ({ label, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <TextV3.Caption color={COLORS_ENUMS.PRIMARY}>{label}</TextV3.Caption>
    </TouchableOpacity>
  );

  const RenderRecipientRightButton = () => {
    return (
      <View style={styles.recipientButtons}>
        <InputRightButton label="CONTACTS" onPress={() => setModalOpen(true)} />
        <QRCodeButton
          onPress={() => {
            setCameraOpen(true);
          }}
          style={styles.qrCodeButton}
        />
      </View>
    );
  };

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.layout}
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}
    >
      <View style={styles.content}>
        <View>{/* Contacts Goes here */}</View>
        <View style={styles.balance}>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            Balance:
            <TextV3.Body color={COLORS_ENUMS.BLACK}>
              {' '}
              {formatStringDecimal(
                formatNumber(Number(balances[activeAsset.id]), 16, 20),
                4
              )}{' '}
            </TextV3.Body>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>{assetInfo.symbol}</TextV3.Caption>
          </TextV3.Caption>
        </View>
        <InputClickable options={networkTypeOptions} />
        <TextInput
          name="address"
          defaultValue={address}
          placeholder={`Enter a valid ${assetInfo.symbol} address`}
          label="RECIPIENT ADDRESS"
          control={control}
          inputContainerStyle={styles.input}
          onChange={(text) => {
            handleAddressChange({ target: { value: text } });
          }}
          rightIconContainerStyle={styles.inputRightIcon}
          returnKeyType="done"
          rightIcon={<RenderRecipientRightButton />}
        />
        <TextInput
          name="amount"
          placeholder="Enter amount to send"
          label={`${assetInfo.symbol} AMOUNT`}
          control={control}
          defaultValue={Number(amount) === 0 ? '' : amount.toString()}
          inputContainerStyle={styles.input}
          onChange={(text) => handleAmountChange(text)}
          rightIconContainerStyle={styles.inputRightIcon}
          keyboardType={decimalPointOnAmount ? 'number-pad' : 'decimal-pad'}
          returnKeyType="done"
          rightIcon={<InputRightButton label="MAX" onPress={handleSetMax} />}
        />
        {activeAsset.type === AssetType.Constellation && (
          <TextInput
            defaultValue={fee.toString()}
            name="fee"
            placeholder="Enter transaction fee"
            label="TRANSACTION FEE"
            control={control}
            inputContainerStyle={{ marginBottom: 0 }}
            onChange={(text) => {
              handleFeeChange({ target: { value: text } });
            }}
            rightIconContainerStyle={styles.inputRightIcon}
            keyboardType={decimalPointOnFee ? 'number-pad' : 'decimal-pad'}
            returnKeyType="done"
            rightIcon={
              <InputRightButton label="RECOMMENDED" onPress={handleGetDAGTxFee} />
            }
          />
        )}
        {!!Object.values(errors).length && (
          <View style={styles.error}>
            <TextV3.Caption color={COLORS_ENUMS.RED}>
              {Object.values(errors)[0].message}
            </TextV3.Caption>
          </View>
        )}
        {!!assetInfo?.priceId && (
          <View style={styles.estimate}>
            <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
              ≈ {getFiatAmount(Number(amount) + Number(fee), 6)}
            </TextV3.Caption>
          </View>
        )}
        {activeAsset.type === AssetType.Constellation && (
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            With current network conditions we recommend a fee of {recommend}{' '}
            {nativeToken}.
          </TextV3.Caption>
        )}
        {activeAsset.type !== AssetType.Constellation && !!gasPrices.length && (
          <>
            <View style={styles.gasSettings}>
              <View style={styles.gasSettingsLabel}>
                <View style={styles.gasSettingLabelLeft}>
                  <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                    GAS PRICE (IN GWEI)
                  </TextV3.Caption>
                </View>
                <View style={styles.gasSettingLabelRight}>
                  <Input
                    defaultValue={gasPrice.toString()}
                    keyboardType="number-pad"
                    onChange={(event) =>
                      handleGasPriceChange(null, Number(event.nativeEvent.text))
                    }
                    inputStyle={styles.gasSettingInputText}
                    inputContainerStyle={styles.gasSettingInputContainer}
                    rightIcon={
                      <InputRightButton
                        label={gasSpeedLabel}
                        onPress={handleGetDAGTxFee}
                      />
                    }
                  />
                </View>
              </View>
              <View style={styles.gasSettingsSlider}>
                <PurpleSlider
                  onChange={handleGasPriceChange}
                  min={gasPrices[0]}
                  max={gasPrices[2]}
                  value={gasPrice}
                  step={1}
                />
              </View>
            </View>
            <View style={styles.gasSettingsEstimate}>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                {`${gasPrice} GWei, ${gasFee} ${nativeToken} (≈ ${getFiatAmount(
                  gasFee,
                  2,
                  basePriceId
                )})`}
              </TextV3.Caption>
            </View>
          </>
        )}
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            <ButtonV3
              type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
              size={BUTTON_SIZES_ENUM.LARGE}
              title="Cancel"
              onPress={handleClose}
              extraStyles={styles.button}
            />
            <ButtonV3
              disabled={isDisabled}
              type={BUTTON_TYPES_ENUM.PRIMARY}
              size={BUTTON_SIZES_ENUM.LARGE}
              title="Submit"
              onPress={handleSubmit((data) => {
                onSubmit(data);
              })}
            />
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalOpened}
        onRequestClose={() => {
          setModalOpen(false);
        }}
      >
        <Contact onChange={handleSelectContact} onClose={() => setModalOpen(false)} />
      </Modal>
      <QRCodeScanner
        visble={cameraOpen}
        onRead={(event) => {
          handleSelectContact(event.data);
          setCameraOpen(false);
        }}
        onClosePress={() => {
          setCameraOpen(false);
        }}
      />
    </KeyboardAwareScrollView>
  );
};

export default Send;
