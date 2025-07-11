import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { COLORS_ENUMS } from 'assets/styles/colors';

import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextInput from 'components/TextInput';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import styles from './index.scss';

type ICardLayoutV3Props = {
  logo: string | JSX.Element;
  title: string;
  subtitle?: string;
  negativeButtonLabel?: string;
  positiveButtonLabel?: string;
  isPositiveButtonDisabled?: boolean;
  isPositiveButtonLoading?: boolean;
  containerStyles?: string;
  fee?: {
    show: boolean;
    defaultValue: string;
    value: string;
    symbol: string;
    disabled: boolean;
    recommended: string;
    loading?: boolean;
    setFee: (fee: string) => void;
  };
  children: React.ReactChild | React.ReactChild[];
  onNegativeButtonClick: () => void;
  onPositiveButtonClick: () => void;
};

const FEE_MUST_NUMBER = 'Fee must be a valid number';
const FEE_REQUIRED = 'Fee is required';
const FEE_TOO_BIG = 'Fee value exceeds the maximum';
const FEE_GREATER_THAN_ZERO = 'Fee value must be greater or equal than 0';
const MIN_FEE = 0;
const MAX_FEE = 999999;

const CardLayoutV3: FC<ICardLayoutV3Props> = ({
  logo,
  title,
  subtitle,
  negativeButtonLabel = 'Reject',
  positiveButtonLabel = 'Approve',
  isPositiveButtonDisabled = false,
  isPositiveButtonLoading = false,
  fee,
  children,
  containerStyles,
  onNegativeButtonClick,
  onPositiveButtonClick,
}) => {
  const { register, errors, setValue, triggerValidation } = useForm({
    defaultValues: {
      fee: fee?.defaultValue,
    },
    validationSchema: yup.object().shape({
      fee: yup
        .string()
        .test('number', FEE_MUST_NUMBER, val => {
          if (val) {
            return /^\d+(\.\d+)?$/.test(val);
          }
          return true;
        })
        .test('min', FEE_GREATER_THAN_ZERO, val => {
          if (val) {
            return Number(val) >= MIN_FEE;
          }
          return true;
        })
        .test('max', FEE_TOO_BIG, val => {
          if (val) {
            return Number(val) <= MAX_FEE;
          }
          return true;
        })
        .required(FEE_REQUIRED),
    }),
  });

  isPositiveButtonDisabled = isPositiveButtonDisabled || (!fee?.disabled && !!errors?.fee);

  const handleFeeChange = (value: string) => {
    setValue('fee', value);
    fee?.setFee(value);
    triggerValidation('fee');
  };

  return (
    <div className={clsx(styles.container, containerStyles)}>
      <div className={styles.header}>
        {!!logo && <div className={styles.logoContainer}>{typeof logo === 'string' ? <img src={logo} className={styles.logo} alt="logo" /> : logo}</div>}
        <div className={styles.titleContainer}>
          <TextV3.LabelSemiStrong extraStyles={styles.title}>{title}</TextV3.LabelSemiStrong>
          {!!subtitle && <TextV3.Caption extraStyles={styles.subtitle}>{subtitle}</TextV3.Caption>}
        </div>
      </div>

      <div className={styles.content}>{children}</div>

      <div className={styles.actions}>
        {!!fee?.show && (
          <div className={styles.feeSection}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.feeTitle}>
              Transaction fee
            </TextV3.CaptionStrong>
            {fee?.loading ? (
              <Skeleton variant="rect" width="100%" height={50} style={{ borderRadius: 6 }} />
            ) : (
              <TextInput
                type="number"
                fullWidth
                inputRef={register}
                name="fee"
                value={fee?.value}
                error={!!errors?.fee}
                onChange={ev => handleFeeChange(ev.target.value)}
                disabled={fee?.disabled}
                endAdornment={
                  <TextV3.Caption extraStyles={styles.recommendedLabel} align={TEXT_ALIGN_ENUM.RIGHT} color={COLORS_ENUMS.PRIMARY_LIGHTER_1}>
                    {fee?.symbol}
                  </TextV3.Caption>
                }
              />
            )}
            {!!errors?.fee?.message && <TextV3.Caption color={COLORS_ENUMS.RED}>{errors?.fee?.message}</TextV3.Caption>}
            {fee?.loading ? (
              <Skeleton variant="rect" width={160} height={20} style={{ borderRadius: 4 }} />
            ) : (
              <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.feeRecommended}>
                Recommended fee: {` `}
                <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.feeValue}>
                  {fee?.recommended} {fee?.symbol}
                </TextV3.Caption>
              </TextV3.Caption>
            )}
          </div>
        )}

        <div className={styles.buttonsContainer}>
          <ButtonV3 type={BUTTON_TYPES_ENUM.TERTIARY_SOLID} size={BUTTON_SIZES_ENUM.MEDIUM} extraStyle={styles.button} label={negativeButtonLabel} onClick={onNegativeButtonClick} />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.MEDIUM}
            label={positiveButtonLabel}
            onClick={onPositiveButtonClick}
            loading={isPositiveButtonLoading}
            disabled={isPositiveButtonDisabled || isPositiveButtonLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CardLayoutV3;
