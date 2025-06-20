import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';

import CopyIcon from 'assets/images/svg/copy.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import Tooltip from 'components/Tooltip';

import { useCopyClipboard } from 'hooks/index';

import { ellipsis } from 'scenes/home/helpers';

import styles from './CardRow.scss';

type ICardRowProps = {
  label: string;
  value: string;
  error?: string;
  loading?: boolean;
};

type ICardRow = Omit<ICardRowProps, 'value'> & {
  value: string | JSX.Element;
};

type ICardRowToken = Omit<ICardRowProps, 'value'> & {
  value: {
    logo?: string;
    symbol: string;
  };
};

const renderLoading = () => {
  return <Skeleton variant="rect" animation="wave" height={20} width={50} style={{ borderRadius: 4 }} />;
};

const CardRow: FC<ICardRow> & {
  Token: FC<ICardRowToken>;
  Address: FC<ICardRowProps>;
  Object: FC<ICardRowProps>;
} = ({ label, value, error, loading = false }) => {
  const renderValue = () => {
    if (typeof value === 'string') {
      return (
        <div className={styles.valueContainer}>
          <TextV3.CaptionRegular extraStyles={styles.value} align={TEXT_ALIGN_ENUM.RIGHT}>
            {value}
          </TextV3.CaptionRegular>
          {!!error && (
            <TextV3.CaptionRegular color={COLORS_ENUMS.RED} align={TEXT_ALIGN_ENUM.RIGHT}>
              {error}
            </TextV3.CaptionRegular>
          )}
        </div>
      );
    }

    return value;
  };

  return (
    <div className={styles.row}>
      <TextV3.CaptionStrong extraStyles={styles.label}>{label}</TextV3.CaptionStrong>
      {loading ? renderLoading() : renderValue()}
    </div>
  );
};

const CardRowToken: FC<ICardRowToken> = ({ label, value, loading = false }) => {
  const renderTokenValue = () => {
    return (
      <div className={styles.tokenValueContainer}>
        {!!value?.logo && <img src={value?.logo} alt="Token logo" className={styles.tokenLogo} />}
        <TextV3.CaptionRegular extraStyles={styles.value}>{value?.symbol}</TextV3.CaptionRegular>
      </div>
    );
  };

  return (
    <div className={styles.row}>
      <TextV3.CaptionStrong extraStyles={styles.label}>{label}</TextV3.CaptionStrong>
      {loading ? renderLoading() : renderTokenValue()}
    </div>
  );
};

const CardRowAddress: FC<ICardRowProps> = ({ label, value, loading = false }) => {
  const [isCopied, copyText] = useCopyClipboard(1000);

  const renderAddressValue = () => {
    const displayTooltip = isCopied ? 'Copied!' : 'Copy address';

    return (
      <Tooltip title={displayTooltip} placement="bottom" arrow>
        <div className={styles.copyAddressContainer} onClick={() => copyText(value)}>
          <TextV3.CaptionStrong extraStyles={styles.copyAddress}>{ellipsis(value)}</TextV3.CaptionStrong>
          <img src={`/${CopyIcon}`} alt="Copy" />
        </div>
      </Tooltip>
    );
  };

  return (
    <div className={styles.row}>
      <TextV3.CaptionStrong extraStyles={styles.label}>{label}</TextV3.CaptionStrong>
      {loading ? renderLoading() : renderAddressValue()}
    </div>
  );
};

const CardRowObject: FC<ICardRowProps> = ({ label, value }) => {
  const [isCopied, copyText] = useCopyClipboard(1000);
  const displayTooltip = isCopied ? 'Copied!' : 'Copy data';

  return (
    <div className={styles.column}>
      <div className={styles.row}>
        <TextV3.CaptionStrong extraStyles={styles.label}>{label}</TextV3.CaptionStrong>
        <Tooltip title={displayTooltip} placement="bottom" arrow>
          <div onClick={() => copyText(value)} className={styles.copyIcon}>
            <img src={`/${CopyIcon}`} alt="Copy" />
          </div>
        </Tooltip>
      </div>
      <TextV3.CaptionRegular extraStyles={styles.message}>{value}</TextV3.CaptionRegular>
    </div>
  );
};

CardRow.Token = CardRowToken;
CardRow.Address = CardRowAddress;
CardRow.Object = CardRowObject;

export default CardRow;
