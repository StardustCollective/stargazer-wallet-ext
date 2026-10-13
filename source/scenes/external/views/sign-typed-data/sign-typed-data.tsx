import { ethers } from 'ethers';
import React, { useMemo } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import ApprovalWarning from 'scenes/external/components/ApprovalWarning';
import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import RawDataToggle from 'scenes/external/components/RawDataToggle';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { WalletParam } from 'scripts/Background/messaging';
import type { MessagePayload } from 'scripts/Provider/evm';
import { classifyTypedData, type TypedDataIntent } from 'scripts/Provider/evm/utils/typedDataIntent';

import { formatDeadline } from 'utils/approvalAmount';

import styles from './styles.scss';
import TokenApprovalCard, { type ITokenApprovalCardProps } from './TokenApprovalCard';
import TokenTransferCard from './TokenTransferCard';

export interface ISignTypedDataProps {
  title: string;
  wallet: WalletParam;
  typedData: MessagePayload;
  footer?: string;
  onSign: () => Promise<void>;
  onReject: () => void;
}

// The four approval intents, normalised to what the Token approval card shows.
const toApproval = (intent: TypedDataIntent): ITokenApprovalCardProps | null => {
  switch (intent.kind) {
    case 'erc2612-permit':
      return {
        grants: [intent.grant],
        spender: intent.spender,
        signatureExpires: formatDeadline(intent.deadline),
        isRevoke: intent.grant.amount.isZero(),
      };
    case 'dai-permit':
      return {
        grants: [{ token: intent.token, amount: intent.allowed ? ethers.constants.MaxUint256 : ethers.constants.Zero }],
        spender: intent.spender,
        signatureExpires: formatDeadline(intent.expiry, { zeroMeansNever: true }),
        isRevoke: !intent.allowed,
      };
    case 'permit2-allowance':
      return {
        grants: intent.grants,
        spender: intent.spender,
        signatureExpires: formatDeadline(intent.sigDeadline),
        isRevoke: false,
      };
    case 'permit2-transfer':
      return {
        grants: intent.grants,
        spender: intent.spender,
        signatureExpires: formatDeadline(intent.deadline),
        isRevoke: false,
      };
    default:
      return null;
  }
};

const WARNING_ONLY: Partial<Record<TypedDataIntent['kind'], string>> = {
  'marketplace-order': 'Marketplace order: if fulfilled, this signature can transfer your NFTs or tokens.',
  'delegated-transaction': 'This signature authorizes a transaction on your behalf.',
  'unknown-approval':
    'This looks like a token approval or authorization, but this wallet cannot decode it. It may grant spending or transfer rights.',
};

const SignTypedDataView = ({ title, wallet, typedData, footer, onSign, onReject }: ISignTypedDataProps) => {
  const { dapp, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);

  const intent = useMemo(() => classifyTypedData(typedData), [typedData]);
  const approval = toApproval(intent);
  const warningOnly = WARNING_ONLY[intent.kind];

  const domainString = typedData?.domain?.name || 'Unknown';
  const contractAddress = typedData?.domain?.verifyingContract || '';

  let parsedMessage = '';
  try {
    if (typedData?.message && typeof typedData.message === 'object') {
      // Pretty-print JSON object
      parsedMessage = JSON.stringify(typedData.message, null, 4);
    } else {
      parsedMessage = String(typedData?.message || '');
    }
  } catch (err) {
    parsedMessage = String(typedData?.message || '');
  }

  const isDisabled = accountChanged || networkChanged;

  return (
    <CardLayoutV3
      logo={dapp.logo}
      title={title}
      subtitle={dapp.origin}
      onNegativeButtonClick={onReject}
      negativeButtonLabel="Reject"
      onPositiveButtonClick={onSign}
      positiveButtonLabel="Sign"
      isPositiveButtonDisabled={isDisabled}
    >
      <div className={styles.container}>
        <TextV3.CaptionStrong
          align={TEXT_ALIGN_ENUM.CENTER}
          extraStyles={styles.typeLabel}
        >{`Type: ${intent.primaryType}`}</TextV3.CaptionStrong>
        <Card>
          <CardRow label="Wallet name:" value={activeWallet?.label} error={accountChanged && 'Account changed'} />
        </Card>
        <Card>
          <CardRow label="Domain:" value={domainString} />
          <CardRow label="Network:" value={networkLabel} error={networkChanged && 'Network changed'} />
          {!!contractAddress && <CardRow.Address label="Contract:" value={contractAddress} />}
        </Card>
        {!!approval && <TokenApprovalCard {...approval} />}
        {intent.kind === 'erc3009-transfer' && (
          <TokenTransferCard
            token={intent.token}
            from={intent.from}
            to={intent.to}
            value={intent.value}
            validAfter={intent.validAfter}
            validBefore={intent.validBefore}
          />
        )}
        {!!warningOnly && <ApprovalWarning severity="danger">{warningOnly}</ApprovalWarning>}
        <Card>
          {intent.kind === 'generic' ? (
            <CardRow.Object label="Message:" value={parsedMessage} />
          ) : (
            <RawDataToggle label="Message:" value={parsedMessage} />
          )}
        </Card>
        {!!footer && (
          <TextV3.CaptionRegular color={COLORS_ENUMS.RED} align={TEXT_ALIGN_ENUM.CENTER}>
            {footer}
          </TextV3.CaptionRegular>
        )}
      </div>
    </CardLayoutV3>
  );
};

export default SignTypedDataView;
