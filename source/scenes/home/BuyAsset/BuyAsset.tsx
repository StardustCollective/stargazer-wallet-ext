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
    return <img src={provider.logo} height={40} width={40} alt={`${provider.id}-icon`} />;
  });

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
          <TextV3.HeaderDisplay dynamic color={COLORS_ENUMS.BLACK} extraStyles={styles.amountText}>
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
            <TextV3.Body color={COLORS_ENUMS.GRAY_100}>{message}</TextV3.Body>
          )}
        </div>
      </div>
      <div className={styles.providerContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>Third Party Provider</TextV3.CaptionStrong>
        <div className={styles.providerCard}>
          <ProviderIcon />
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.providerText}>
            {provider.label}
          </TextV3.BodyStrong>
        </div>
      </div>
      <div className={styles.numpadContainer}>
        {padList.map((item) => (
          <div onClick={() => handleItemClick(item)} key={item} className={styles.numPadItem}>
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
    </div>
  );
};

export default BuyAsset;
