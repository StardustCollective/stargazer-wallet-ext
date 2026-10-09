import React, { useEffect } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3 from 'components/TextV3';

import useTokenInfo from 'hooks/external/useTokenInfo';

import CardRow from 'scenes/external/components/CardRow/CardRow';

import type { TokenGrant } from 'scripts/Provider/evm/utils/typedDataIntent';

import { formatApprovalAmount, formatDeadline } from 'utils/approvalAmount';

interface IPermitTokenRowsProps {
  grant: TokenGrant;
  // Reports the name the warning uses for this token: its symbol, or its address when the lookup fails.
  onSymbol: (token: string, symbol: string) => void;
}

// One component per grant keeps the number of useTokenInfo calls fixed per component.
const PermitTokenRows = ({ grant, onSymbol }: IPermitTokenRowsProps) => {
  const { tokenInfo, loading, error } = useTokenInfo({ contractAddress: grant.token.toLowerCase() });
  // useTokenInfo leaves `loading` set when every lookup fails, so an error ends loading here.
  const isLoading = loading && !error;
  const { display, isUnlimited } = formatApprovalAmount(grant.amount, tokenInfo?.decimals, tokenInfo?.symbol);

  useEffect(() => {
    if (!isLoading) onSymbol(grant.token, tokenInfo?.symbol ?? grant.token);
  }, [isLoading, tokenInfo, grant.token]);

  return (
    <>
      {tokenInfo || isLoading ? (
        <CardRow.Token label="Token:" loading={isLoading} value={tokenInfo} />
      ) : (
        <CardRow.Address full label="Token:" value={grant.token} />
      )}
      <CardRow
        label="Amount:"
        loading={isLoading}
        value={isUnlimited ? <TextV3.CaptionStrong color={COLORS_ENUMS.RED}>{display}</TextV3.CaptionStrong> : display}
      />
      {!!grant.expiration && <CardRow label="Expires:" value={formatDeadline(grant.expiration)} />}
    </>
  );
};

export default PermitTokenRows;
