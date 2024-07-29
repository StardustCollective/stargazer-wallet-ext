import React from 'react';
import { View } from 'react-native';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import CheckIcon from 'components/CheckIcon';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import Button from 'components/Button';
import { ellipsis } from '../../helpers';
import { useLinkTo } from '@react-navigation/native';
import { convertBigNumber } from 'utils/number';

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';

const Confirm = ({
  isExternalRequest,
  confirmed,
  tempTx,
  assetInfo,
  getSendAmount,
  activeWallet,
  feeUnit,
  getFeeAmount,
  getTotalAmount,
  handleCancel,
  handleConfirm,
  disabled,
  isL0token,
}) => {
  const linkTo = useLinkTo();

  const onNextPressed = () => {
    linkTo('/asset');
  };

  const amountBN = convertBigNumber(tempTx?.amount);
  const amountPrice = convertBigNumber(getSendAmount());
  const feeBN = convertBigNumber(tempTx?.fee);
  const feePrice = convertBigNumber(getFeeAmount());
  const totalAmount = convertBigNumber(getTotalAmount());

  return (
    <>
      {confirmed ? (
        <>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1 }}>
              <View style={styles.heading}>
                <TextV3.HeaderLargeRegular color={COLORS_ENUMS.DARK_GRAY}>
                  Your transaction is underway
                </TextV3.HeaderLargeRegular>
              </View>
              <View style={styles.sendSuccessContent}>
                <View style={styles.wrapper}>
                  <View style={styles.checkIcon}>
                    <CheckIcon />
                  </View>
                  <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.message}>
                    You can follow your transaction under activity on your account screen.
                  </TextV3.Body>
                </View>
              </View>
            </View>
            <View style={styles.successButtonFooter}>
              <Button type="button" onPress={onNextPressed} title={'Next'} />
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.layout}>
            <View style={styles.content}>
              <View>
                <View style={styles.confirm}>
                  <View style={styles.header}>
                    <TextV3.BodyStrong color={COLORS_ENUMS.DARK_GRAY}>
                      {amountBN} {assetInfo.symbol}
                      {!isL0token && (
                        <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                          {' '}
                          (≈ ${amountPrice} USD)
                        </TextV3.Caption>
                      )}
                    </TextV3.BodyStrong>
                  </View>
                  <View style={styles.section}>
                    <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>From</TextV3.BodyStrong>
                    <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                      {activeWallet?.label || ''} ({ellipsis(tempTx?.fromAddress)})
                    </TextV3.Caption>
                  </View>
                  <View style={styles.section}>
                    <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>To</TextV3.BodyStrong>
                    <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                      {tempTx?.toAddress}
                    </TextV3.Caption>
                  </View>
                  <View style={[styles.section, styles.transcationFee]}>
                    <TextV3.BodyStrong
                      extraStyles={styles.transcationFeeText}
                      color={COLORS_ENUMS.BLACK}
                    >
                      Transaction Fee
                    </TextV3.BodyStrong>
                    <TextV3.Caption
                      extraStyles={styles.transcationFeePrice}
                      align={TEXT_ALIGN_ENUM.RIGHT}
                      color={COLORS_ENUMS.DARK_GRAY}
                    >
                      {`${feeBN} ${feeUnit} ${isL0token ? '' : `\n(≈ $${feePrice} USD)`}`}
                    </TextV3.Caption>
                  </View>
                  <View style={[styles.section, styles.maxTotalSection]}>
                    <View style={styles.maxTotalLabel}>
                      <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                        Max Total
                      </TextV3.BodyStrong>
                    </View>
                    <View>
                      <TextV3.BodyStrong color={COLORS_ENUMS.DARK_GRAY}>
                        {isL0token
                          ? `${totalAmount} ${assetInfo.symbol}`
                          : `$${totalAmount} USD`}
                      </TextV3.BodyStrong>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.footerButtons}>
              <ButtonV3
                type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
                size={BUTTON_SIZES_ENUM.LARGE}
                title={'Cancel'}
                onPress={handleCancel}
                extraStyles={styles.button}
              />
              <ButtonV3
                type={BUTTON_TYPES_ENUM.PRIMARY}
                size={BUTTON_SIZES_ENUM.LARGE}
                title={'Confirm'}
                onPress={handleConfirm}
                disabled={disabled}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default Confirm;
