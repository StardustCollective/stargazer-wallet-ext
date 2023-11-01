import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import ButtonV3 from 'components/ButtonV3';
import { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import CheckGreen from 'assets/images/svg/check-green.svg';
import SubstractIcon from 'assets/images/svg/subtract.svg';
import AddIcon from 'assets/images/svg/add.svg';
import TextInput from 'components/TextInput';
import PurpleSlider from 'components/PurpleSlider';
import { formatNumber } from 'scenes/home/helpers';
import { NFTSendProps } from './types';
import styles from './NFTSend.scss';
import {
  QUANTITY,
  CONTINUE,
  GAS_IN_GWEI,
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
  register,
  onButtonPress,
  onGasPriceChange,
  handleAddressChange,
  handleQuantityChange,
  getFiatAmount,
}) => {
  const showGasSlider = gas.prices.length > 0 && !buttonDisabled;
  const numberQuantity = Number(quantity);

  const RenderQuantityLabel = () => {
    return (
      <div className={styles.quantityLabelContainer}>
        <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.quantityTitle}>
          {QUANTITY}
        </TextV3.Caption>
        <TextV3.Caption color={COLORS_ENUMS.SECONDARY_TEXT}>
          x{formatNumber(amount, 0, 0)}
        </TextV3.Caption>
      </div>
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
      <div className={styles.quantityButtonsContainer}>
        <div className={styles.quantityButton} onClick={onSubstract}>
          <img src={`/${SubstractIcon}`} />
        </div>
        <div className={styles.quantityButtonDivider} />
        <div className={styles.quantityButton} onClick={onAdd}>
          <img src={`/${AddIcon}`} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={logo} className={styles.image} />
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.title}>
          {selectedNFT.name}
        </TextV3.CaptionStrong>
      </div>
      {!isERC721 && (
        <div className={styles.inputContainer}>
          <TextInput
            name="quantity"
            inputRef={register}
            value={quantity}
            label={<RenderQuantityLabel />}
            control={control}
            onChange={(amount) => {
              handleQuantityChange(amount.target.value);
            }}
            error={!!errors?.quantity}
            endAdornment={<RenderQuantityButtons />}
          />
          <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
            {!!errors?.quantity ? errors?.quantity?.message : ' '}
          </TextV3.Caption>
        </div>
      )}
      <div className={styles.inputContainer}>
        <TextInput
          name="address"
          inputRef={register}
          value={address}
          placeholder={RECIPIENT_ADDRESS_PLACEHOLDER}
          label={RECIPIENT_ADDRESS}
          control={control}
          onChange={(text) => {
            handleAddressChange(text.target.value);
          }}
          error={!!errors?.address}
          startAdornment={
            isValidAddress && (
              <img
                src={`/${CheckGreen}`}
                className={styles.checkIcon}
                height={16}
                width={16}
              />
            )
          }
        />
        <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
          {!!errors?.address ? errors?.address?.message : ' '}
        </TextV3.Caption>
      </div>
      <div className={styles.sliderContainer}>
        {showGasSlider && (
          <>
            <div className={styles.gasPriceContainer}>
              <div className={styles.gasPriceHeader}>
                <div className={styles.gasPriceHeaderLeft}>
                  <TextV3.LabelSemiStrong color={COLORS_ENUMS.BLACK}>
                    {GAS_IN_GWEI}
                  </TextV3.LabelSemiStrong>
                </div>
                <div className={styles.gasPriceHeaderRight}>
                  <div className={styles.gasSpeedBox}>
                    <div className={styles.gasSpeedBoxLeft}>
                      <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>
                        {gas.price.toString()}
                      </TextV3.CaptionRegular>
                    </div>
                    <div className={styles.gasSpeedBoxRight}>
                      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                        {gas.speedLabel}
                      </TextV3.CaptionStrong>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.gasPriceFooter}>
                <div>
                  <PurpleSlider
                    onChange={onGasPriceChange}
                    min={gas.prices[0]}
                    max={gas.prices[2]}
                    value={gas.price}
                    defaultValue={gas.price}
                    step={1}
                  />
                </div>
              </div>
            </div>
            <div className={styles.gasEstimateLabel}>
              <TextV3.CaptionRegular color={COLORS_ENUMS.DARK_GRAY_200}>
                {`${gas.price} GWEI, ${gas.fee} ${mainAsset.symbol} (≈ ${getFiatAmount(
                  gas.fee,
                  2,
                  gas.basePriceId
                )})`}
              </TextV3.CaptionRegular>
            </div>
          </>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <ButtonV3
          label={CONTINUE}
          disabled={buttonDisabled || !showGasSlider}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          onClick={onButtonPress}
        />
      </div>
    </div>
  );
};

export default NFTSend;
