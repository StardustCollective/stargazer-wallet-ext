import React, { FC } from 'react';
import clsx from 'clsx';
import Slider from '@material-ui/core/Slider';
import Contacts from 'scenes/home/Contacts';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import InputClickable from 'components/InputClickable';
import VerifiedIcon from 'assets/images/svg/check-green.svg';
import ErrorIcon from 'assets/images/svg/error.svg';
import { AssetType } from 'state/vault/types';
import { formatNumber, formatStringDecimal } from 'scenes/home/helpers';
import { IWalletSend } from './types';
import styles from './Send.scss';
import { fixedStringNumber, trimTrailingZeros, smallestPowerOfTen } from 'utils/number';

const WalletSend: FC<IWalletSend> = ({
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
  networkTypeOptions,
  basePriceId,
  digits,
}) => {
  const gasFeeFixed = trimTrailingZeros(gasFee.toFixed(18));
  const steps = smallestPowerOfTen(gasPrices[2]);

  const addressInputClass = clsx(styles.input, styles.address, {
    [styles.verified]: isValidAddress,
  });
  const statusIconClass = clsx(styles.statusIcon, {
    [styles.hide]: !isValidAddress,
  });
  const errorIconClass = clsx(styles.statusIcon, {
    [styles.hide]: isValidAddress,
  });
  const bodyWrapper = clsx(styles.bodywrapper);
  const networkWrapper = clsx(styles.networkContainer);

  return (
    <div className={styles.wrapper}>
      <Contacts
        open={modalOpened}
        onClose={() => setModalOpen(false)}
        onChange={handleSelectContact}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={bodyWrapper}>
        <section className={styles.balance}>
          <div>
            Balance:{' '}
            <span>
              {formatStringDecimal(
                formatNumber(Number(balances[activeAsset.id]), 16, 20),
                4
              )}
            </span>{' '}
            {assetInfo.symbol}
          </div>
        </section>
        <div className={networkWrapper}>
          <InputClickable
            options={networkTypeOptions}
            titleStyles={styles.networkTitle}
          />
        </div>
        <section className={styles.content}>
          <ul className={styles.form}>
            <li>
              <label>Recipient Address</label>
              <img src={`/${VerifiedIcon}`} alt="checked" className={statusIconClass} />
              <img src={`/${ErrorIcon}`} alt="error" className={errorIconClass} />
              <TextInput
                placeholder={`Enter a valid ${assetInfo.symbol} address`}
                fullWidth
                value={address}
                name="address"
                inputRef={register}
                onChange={handleAddressChange}
                variant={addressInputClass}
              />
                <Button
                  type="button"
                  variant={styles.textBtn}
                  onClick={() => setModalOpen(true)}
                >
                  Contacts
                </Button>
            </li>
            <li>
              <label>{`${assetInfo.symbol} Amount`} </label>
              <TextInput
                type="number"
                placeholder="Enter amount to send"
                fullWidth
                inputRef={register}
                name="amount"
                value={amount === '0' ? '' : amount}
                onChange={(ev) => handleAmountChange(ev.target.value)}
                variant={clsx(styles.input, styles.amount)}
            />
                <Button
                  type="button"
                  disabled={!!Object.values(errors).length}
                  variant={styles.textBtn}
                  onClick={handleSetMax}
                >
                  Max
                </Button>
            </li>
            {(activeAsset.type === AssetType.Constellation ||
              activeAsset.type === AssetType.LedgerConstellation) && (
              <li>
                <label>Transaction Fee</label>
                <TextInput
                  type="number"
                  placeholder="Enter transaction fee"
                  fullWidth
                  inputRef={register}
                  name="fee"
                  onChange={handleFeeChange}
                  value={fee}
                  variant={clsx(styles.input, styles.fee)}
                />
                  <Button
                    type="button"
                    variant={styles.textBtn}
                    onClick={handleGetDAGTxFee}
                  >
                    Recommend
                  </Button>
              </li>
            )}
          </ul>
          <div className={styles.status}>
            {!!assetInfo?.priceId && (
              <span className={styles.equalAmount}>
                ≈ {getFiatAmount(Number(amount) + Number(fee), 6)}
              </span>
            )}
            {!!Object.values(errors).length && (
              <span className={styles.error}>
                {Object.values(errors)[0].message as any}
              </span>
            )}
          </div>
          {(activeAsset.type === AssetType.Constellation ||
            activeAsset.type === AssetType.LedgerConstellation) && (
            <div className={styles.description}>
              With current network conditions we recommend a fee of {recommend}{' '}
              {nativeToken}.
            </div>
          )}
        </section>
        {activeAsset.type !== AssetType.Constellation &&
          activeAsset.type !== AssetType.LedgerConstellation && (
            <section
              className={clsx(styles.transactionFee, {
                [styles.hide]: !gasPrices.length,
              })}
            >
              <div className={styles.gasRow}>
                <div className={styles.gasPriceText}>
                  <span>Gas Price</span>
                  <span>(In Gwei)</span>
                </div>
                <Slider
                  classes={{
                    root: clsx(styles.sliderCustom, {
                      [styles.disabled]:
                        gasPrice < gasPrices[0] || gasPrice > gasPrices[2],
                    }),
                    thumb: styles.thumb,
                    mark: styles.mark,
                    track: styles.sliderTrack,
                    rail: styles.sliderRail,
                  }}
                  value={gasPrice}
                  min={gasPrices[0]}
                  max={gasPrices[2]}
                  aria-labelledby="discrete-slider-restrict"
                  step={steps}
                  marks={[
                    { value: gasPrices[0] },
                    { value: gasPrices[1] },
                    { value: gasPrices[2] },
                  ]}
                  onChange={handleGasPriceChange}
                />
                <TextInput
                  type="number"
                  value={gasPrice}
                  variant={styles.gasInput}
                  onChange={(ev) => handleGasPriceChange(null, Number(ev.target.value))}
                />
                <div className={styles.gasLevel}>{gasSpeedLabel}</div>
              </div>
              <div className={styles.status}>
                <span className={styles.equalAmount}>
                  {`${fixedStringNumber(
                    gasPrice,
                    digits
                  )} GWei, ${gasFeeFixed} ${nativeToken} (≈ ${getFiatAmount(
                    gasFee,
                    2,
                    basePriceId
                  )})`}
                </span>
              </div>
            </section>
          )}
        <section className={styles.actionGroup}>
          <div className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.close)}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button type="submit" variant={styles.button} disabled={isDisabled}>
              Send
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default WalletSend;
