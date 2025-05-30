import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import Tooltip from 'components/Tooltip';
import CopyIcon from 'assets/images/svg/copy.svg';
import type { IAssetInfoState } from 'state/assets/types';
import { useCopyClipboard } from 'hooks/index';
import { ellipsis } from 'scenes/home/helpers';
import styles from './CardRow.scss';

type ICardRowProps = {
  label: string;
  value: string;
};

type ICardRow = Omit<ICardRowProps, 'value'> & {
  value: string | JSX.Element;
};

type ICardRowToken = Omit<ICardRowProps, 'value'> & {
  value: IAssetInfoState;
};

const CardRow: FC<ICardRow> & {
  Token: FC<ICardRowToken>;
  Address: FC<ICardRowProps>;
  Object: FC<ICardRowProps>;
} = ({ label, value }) => {
  const renderValue = () => {
    if (typeof value === 'string') {
      return (
        <TextV3.CaptionRegular extraStyles={styles.value}>{value}</TextV3.CaptionRegular>
      );
    }

    return value;
  };

  return (
    <div className={styles.row}>
      <TextV3.CaptionStrong extraStyles={styles.label}>{label}</TextV3.CaptionStrong>
      {renderValue()}
    </div>
  );
};

const CardRowToken: FC<ICardRowToken> = ({ label, value }) => {
  const renderTokenValue = () => {
    return (
      <div className={styles.tokenValueContainer}>
        <img src={value?.logo} alt="Token logo" className={styles.tokenLogo} />
        <TextV3.CaptionRegular extraStyles={styles.value}>
          {value?.symbol}
        </TextV3.CaptionRegular>
      </div>
    );
  };

  return (
    <div className={styles.row}>
      <TextV3.CaptionStrong extraStyles={styles.label}>{label}</TextV3.CaptionStrong>
      {renderTokenValue()}
    </div>
  );
};

const CardRowAddress: FC<ICardRowProps> = ({ label, value }) => {
  const [isCopied, copyText] = useCopyClipboard(1000);

  const renderAddressValue = () => {
    const displayTooltip = isCopied ? 'Copied!' : 'Copy address';

    return (
      <Tooltip title={displayTooltip} placement="bottom" arrow>
        <div className={styles.copyAddressContainer} onClick={() => copyText(value)}>
          <TextV3.CaptionStrong extraStyles={styles.copyAddress}>
            {ellipsis(value)}
          </TextV3.CaptionStrong>
          <img src={`/${CopyIcon}`} alt="Copy" />
        </div>
      </Tooltip>
    );
  };

  return (
    <div className={styles.row}>
      <TextV3.CaptionStrong extraStyles={styles.label}>{label}</TextV3.CaptionStrong>
      {renderAddressValue()}
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
