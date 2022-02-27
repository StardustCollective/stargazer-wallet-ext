import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextInput from 'components/TextInput';
import PurpleSlider from 'components/PurpleSlider';
import { Input } from 'react-native-elements';

import { useForm } from 'react-hook-form';

import { COLORS_ENUMS } from 'assets/styles/colors';

// import Slider from '@material-ui/core/Slider';
// import Contacts from 'scenes/home/Contacts';
// import Button from 'components/Button';
// import TextInput from 'components/TextInput';
// import VerifiedIcon from 'assets/images/svg/check-green.svg';
// import ErrorIcon from 'assets/images/svg/error.svg';
import { AssetType } from 'state/vault/types';
import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';



import styles from './styles';

const Send = ({
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
  gasSpeedLabel
}) => {

  let [value, setValue] = useState(1);

  const InputRightButton = ({
    label,
    onPress,
  }) => (
    <TouchableOpacity onPress={onPress}>
      <TextV3.Caption color={COLORS_ENUMS.PRIMARY}>
        {label}
      </TextV3.Caption>
    </TouchableOpacity>
  );

  return (
    <View style={styles.layout}>
      <View style={styles.content}>
        <View>
          {/* Contacts Goes here */}
        </View>
        <View style={styles.balance}>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            Balance:
            <TextV3.Body color={COLORS_ENUMS.BLACK}> {formatStringDecimal(formatNumber(Number(balances[activeAsset.id]), 16, 20), 4)} </TextV3.Body>
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>
              {assetInfo.symbol}
            </TextV3.Caption>
          </TextV3.Caption>
        </View>
        <View style={styles.form}>
          <TextInput
            name="address"
            placeholder={`Enter a valid ${assetInfo.symbol} address`}
            label={'RECIPIENT ADDRESS'}
            control={control}
            inputContainerStyle={styles.input}
            onChange={(text) => { handleAddressChange({ target: { value: text } }) }}
            rightIconContainerStyle={styles.inputRightIcon}
            rightIcon={(
              <InputRightButton label='CONTACTS' onPress={() => { }} />
            )}
          />
          <TextInput
            name="amount"
            placeholder={"Enter amount to send"}
            label={`${assetInfo.symbol} AMOUNT`}
            control={control}
            defaultValue={amount === '0' ? '' : amount.toString()}
            inputContainerStyle={styles.input}
            onChange={(text) => handleAmountChange(text)}
            rightIconContainerStyle={styles.inputRightIcon}
            rightIcon={(
              <InputRightButton label='MAX' onPress={handleSetMax} />
            )}
          />
          {activeAsset.type === AssetType.Constellation && (
            <TextInput
              defaultValue={fee.toString()}
              name="fee"
              placeholder={"Enter transaction fee"}
              label={'TRANSACTION FEE'}
              control={control}
              onChange={(text) => { handleFeeChange({ target: { value: text } }) }}
              rightIconContainerStyle={styles.inputRightIcon}
              rightIcon={(
                <InputRightButton label='RECOMMENDED' onPress={handleGetDAGTxFee} />
              )}
            />
          )}
        </View>
        <View style={styles.estimate}>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
            ≈ {getFiatAmount(Number(amount) + Number(fee), 6)}
          </TextV3.Caption>
        </View>
        {!!Object.values(errors).length && (
          <View style={styles.error}>
            <TextV3.Caption color={COLORS_ENUMS.RED}>
              {Object.values(errors)[0].message}
            </TextV3.Caption>
          </View>
        )}
        {activeAsset.type === AssetType.Constellation && (
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            {`With current network conditions we recommend a fee of ${recommend} DAG.`}
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
                    onChange={(event) => handleGasPriceChange(null, Number(event.nativeEvent.text))}
                    inputContainerStyle={styles.gasSettingInputContainer}
                    rightIcon={(
                      <InputRightButton label={gasSpeedLabel} onPress={handleGetDAGTxFee} />
                    )}
                  />
                </View>
              </View>
              <View style={styles.gasSettingsSlider}>
                {/* <PurpleSlider
                onChange={handleGasPriceChange}
                // min={gasPrices[0]}
                // max={gasPrices[2]}
                // value={gasPrice}
                // style={{ width: 120 }}
                // trackStyle={{ width: 100 }}
                step={1}
              /> */}
              </View>
            </View>
            <View style={styles.gasSettingsEstimate}>
              <TextV3.Caption color={COLORS_ENUMS.BLACK}>
                {`${gasPrice} GWei, ${gasFee} ETH (≈ ${getFiatAmount(
                  gasFee,
                  2,
                  'ethereum'
                )})`}
              </TextV3.Caption>
            </View>
          </>
        )}
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            <ButtonV3
              type={BUTTON_TYPES_ENUM.ACCENT_ONE_OUTLINE}
              size={BUTTON_SIZES_ENUM.LARGE}
              title={'Cancel'}
              onPress={handleClose}
              extraStyles={styles.button}
            />
            <ButtonV3
              disabled={isDisabled}
              type={BUTTON_TYPES_ENUM.PRIMARY}
              size={BUTTON_SIZES_ENUM.LARGE}
              title={'Submit'}
              onPress={handleSubmit(data => { onSubmit(data) })}
            />
          </View>
        </View>
      </View>
    </View>
  );

}

export default Send;