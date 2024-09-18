///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect } from 'react';

///////////////////////////
// Components
///////////////////////////

import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowIcon from 'assets/images/svg/arrow-left.svg';
import Sheet from 'components/Sheet';
import Menu from 'components/Menu';
import ArrowUpIcon from 'assets/images/svg/arrow-rounded-up.svg';
import ArrowDownIcon from 'assets/images/svg/arrow-rounded-down.svg';
import { useAlert } from 'react-alert';

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

import styles from './BuyAsset.scss';

const BuyAsset: FC<IBuyAsset> = ({
  amount,
  message,
  buttonDisabled,
  buttonLoading,
  provider,
  response,
  error,
  isProviderSelectorOpen,
  isErrorMessage,
  providersItems,
  setIsProviderSelectorOpen,
  setError,
  handleItemClick,
  handleConfirm,
}) => {
  const padList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      setError('');
    }
  }, [error]);

  const ProviderIcon = React.memo(() => {
    return <img src={provider.logo} height={29} width={29} alt={`${provider.id}-icon`} />;
  });

  const ProviderArrow = React.memo(() => {
    const ArrowIcon = isProviderSelectorOpen ? ArrowUpIcon : ArrowDownIcon;
    return <img src={`/${ArrowIcon}`} alt="arrow-icon" />;
  });

  const messageColor = isErrorMessage ? COLORS_ENUMS.RED : COLORS_ENUMS.GRAY_100;
  const amountColor = isErrorMessage ? COLORS_ENUMS.RED : COLORS_ENUMS.BLACK;

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      <div className={styles.amountContainer}>
        <div className={styles.amountValue}>
          <TextV3.Body dynamic color={COLORS_ENUMS.BLACK}>
            $
          </TextV3.Body>
          <TextV3.HeaderDisplay
            dynamic
            color={amountColor}
            extraStyles={styles.amountText}
          >
            {amount}
          </TextV3.HeaderDisplay>
          <TextV3.Body dynamic color={COLORS_ENUMS.BLACK}>
            USD
          </TextV3.Body>
        </div>
        <div className={styles.amountMessage}>
          {response.loading ? (
            <CircularProgress size={18} className={styles.loader} />
          ) : (
            <TextV3.Body color={messageColor}>{message}</TextV3.Body>
          )}
        </div>
      </div>
      <div className={styles.providerContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
          Third Party Provider
        </TextV3.CaptionStrong>
        <div
          onClick={() => setIsProviderSelectorOpen(true)}
          className={styles.providerCard}
        >
          <div className={styles.providerCardInfo}>
            <ProviderIcon />
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.BLACK}
              extraStyles={styles.providerText}
            >
              {provider.label}
            </TextV3.CaptionStrong>
          </div>
          <ProviderArrow />
        </div>
      </div>
      <div className={styles.numpadContainer}>
        {padList.map((item) => (
          <div
            onClick={() => handleItemClick(item)}
            key={item}
            className={styles.numPadItem}
          >
            {item === 'del' ? (
              <img src={`/${ArrowIcon}`} alt="arrow-icon" />
            ) : (
              <TextV3.Header color={COLORS_ENUMS.BLACK}>{item}</TextV3.Header>
            )}
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <ButtonV3
          label="Confirm"
          disabled={buttonDisabled}
          loading={buttonLoading}
          size={BUTTON_SIZES_ENUM.LARGE}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          extraStyle={styles.confirmButton}
          onClick={handleConfirm}
        />
      </div>
      <Sheet
        title={{
          label: 'Choose a provider',
          align: 'left',
        }}
        isVisible={isProviderSelectorOpen}
        onClosePress={() => setIsProviderSelectorOpen(false)}
      >
        <Menu items={providersItems} />
      </Sheet>
    </div>
  );
};

export default BuyAsset;
