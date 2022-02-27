import React from 'react';
import { View, } from 'react-native';

import TextV3 from 'components/TextV3';
import CheckIcon from 'components/CheckIcon';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

import { ellipsis } from '../../helpers';

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
  disabled
}) => {

  return (
    <View style={styles.layout}>
      <View style={styles.content}>
        {confirmed ? (
          <View>
            <View style={styles.checkIcon}>
              <CheckIcon />
            </View>
            <TextV3.Body
              type={BUTTON_TYPES_ENUM.PRIMARY}
              size={BUTTON_SIZES_ENUM.LARGE}
            >
              You can follow your transaction under activity on your account screen.
            </TextV3.Body>
            <ButtonV3 type="button">
              Next
            </ButtonV3>
          </View>
        ) : (
          <View>
            <View style={styles.confirm}>
              <View style={styles.header}>
                <TextV3.BodyStrong color={COLORS_ENUMS.DARK_GRAY}>
                  {tempTx?.amount}{' '}
                  {assetInfo.symbol}
                  <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                    {' '}(≈
                    {getSendAmount()})
                  </TextV3.Caption>
                </TextV3.BodyStrong>
              </View>
              <View style={styles.section}>
                <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                  From
                </TextV3.BodyStrong>
                <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                  {activeWallet?.label || ''} ({ellipsis(tempTx!.fromAddress)})
                </TextV3.Caption>
              </View>
              <View style={styles.section}>
                <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                  To
                </TextV3.BodyStrong>
                <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                  {tempTx!.toAddress}
                </TextV3.Caption>
              </View>
              <View style={[styles.section, styles.transcationFee]}>
                <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                  Transaction Fee
                  <TextV3.Caption color={COLORS_ENUMS.DARK_GRAY}>
                    {'    '}{`${tempTx!.fee} ${feeUnit} (≈ ${getFeeAmount()})`}
                  </TextV3.Caption>
                </TextV3.BodyStrong>
              </View>
              <View style={[styles.section, styles.maxTotalSection]}>
                <View style={styles.maxTotalLabel}>
                  <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                    Max Total
                  </TextV3.BodyStrong>
                </View>
                <View style={styles.total}>
                  <TextV3.BodyStrong color={COLORS_ENUMS.DARK_GRAY}>
                    {`$${getTotalAmount()}`}
                  </TextV3.BodyStrong>
                </View>
              </View>
            </View>
            <View style={styles.footer}>
              <View style={styles.footerButtons}>
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.ACCENT_ONE_OUTLINE}
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
          </View>
        )}
      </View>
    </View>
  );

}

export default Confirm;