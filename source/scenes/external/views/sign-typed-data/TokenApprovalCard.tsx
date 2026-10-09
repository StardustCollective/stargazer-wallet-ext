import React, { useCallback, useState } from 'react';

import TextV3 from 'components/TextV3';

import ApprovalWarning from 'scenes/external/components/ApprovalWarning';
import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';

import type { TokenGrant } from 'scripts/Provider/evm/utils/typedDataIntent';

import PermitTokenRows from './PermitTokenRows';
import styles from './styles.scss';

export interface ITokenApprovalCardProps {
  grants: TokenGrant[];
  spender: string;
  signatureExpires: string;
  isRevoke: boolean;
}

const TokenApprovalCard = ({ grants, spender, signatureExpires, isRevoke }: ITokenApprovalCardProps) => {
  const [symbols, setSymbols] = useState<Record<string, string>>({});
  const onSymbol = useCallback(
    (token: string, symbol: string) =>
      setSymbols(prev => (prev[token] === symbol ? prev : { ...prev, [token]: symbol })),
    []
  );
  const symbolList = [...new Set(grants.map(grant => symbols[grant.token] ?? grant.token))].join(', ');

  return (
    <>
      <Card>
        <TextV3.CaptionStrong extraStyles={styles.cardTitle}>
          {isRevoke ? 'Revoke approval' : 'Token approval'}
        </TextV3.CaptionStrong>
        {grants.map((grant, index) => (
          // A batch may list the same token twice, and the grants never reorder.
          // eslint-disable-next-line react/no-array-index-key
          <PermitTokenRows key={`${grant.token}-${index}`} grant={grant} onSymbol={onSymbol} />
        ))}
        <CardRow.Address full label="Spender:" value={spender} />
        <CardRow label="Signature expires:" value={signatureExpires} />
      </Card>
      {isRevoke ? (
        <ApprovalWarning severity="caution">{`This signature removes ${spender}'s permission to spend your ${symbolList}.`}</ApprovalWarning>
      ) : (
        <ApprovalWarning severity="danger">{`This signature lets ${spender} spend your ${symbolList} without further confirmation.`}</ApprovalWarning>
      )}
    </>
  );
};

export default TokenApprovalCard;
