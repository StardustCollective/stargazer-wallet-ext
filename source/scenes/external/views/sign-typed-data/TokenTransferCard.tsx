import { BigNumber } from 'ethers';
import React from 'react';

import TextV3 from 'components/TextV3';

import useTokenInfo from 'hooks/external/useTokenInfo';

import ApprovalWarning from 'scenes/external/components/ApprovalWarning';
import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';

import { formatApprovalAmount, formatDeadline } from 'utils/approvalAmount';

import styles from './styles.scss';

export interface ITokenTransferCardProps {
  token: string;
  from: string;
  to: string;
  value: BigNumber;
  validAfter: BigNumber;
  validBefore: BigNumber;
}

// EIP-3009 TransferWithAuthorization / ReceiveWithAuthorization.
const TokenTransferCard = ({ token, from, to, value, validAfter, validBefore }: ITokenTransferCardProps) => {
  const { tokenInfo, loading, error } = useTokenInfo({ contractAddress: token.toLowerCase() });
  // useTokenInfo leaves `loading` set when every lookup fails, so an error ends loading here.
  const isLoading = loading && !error;
  const { display } = formatApprovalAmount(value, tokenInfo?.decimals, tokenInfo?.symbol);
  const amount = tokenInfo ? display : `${display} of ${token}`;
  const validFrom = validAfter.lte(Math.floor(Date.now() / 1000)) ? 'now' : formatDeadline(validAfter);

  return (
    <>
      <Card>
        <TextV3.CaptionStrong extraStyles={styles.cardTitle}>Token transfer</TextV3.CaptionStrong>
        {tokenInfo || isLoading ? (
          <CardRow.Token label="Token:" loading={isLoading} value={tokenInfo} />
        ) : (
          <CardRow.Address full label="Token:" value={token} />
        )}
        <CardRow.Address full label="From:" value={from} />
        <CardRow.Address full label="To:" value={to} />
        <CardRow label="Amount:" loading={isLoading} value={display} />
        <CardRow label="Valid:" value={`${validFrom} to ${formatDeadline(validBefore)}`} />
      </Card>
      <ApprovalWarning severity="danger">{`This signature moves ${amount} from your account to ${to}.`}</ApprovalWarning>
    </>
  );
};

export default TokenTransferCard;
