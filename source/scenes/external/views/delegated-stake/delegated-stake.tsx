import type { DelegatedStake } from '@stardust-collective/dag4-network';
import React from 'react';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { WalletParam } from 'scripts/Background/messaging';

import { formatBigNumberForDisplay, toDag } from 'utils/number';

import styles from './styles.scss';

export type DelegatedStakeProps = DelegatedStake & {
  title: string;
  wallet: WalletParam;
  isLoading?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
};

const DelegatedStakeView = ({ title, wallet, amount, nodeId, tokenLockRef, fee, isLoading, onSign, onReject }: DelegatedStakeProps) => {
  const { current, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);

  const stakeData = {
    amount: formatBigNumberForDisplay(toDag(amount)),
    fee: formatBigNumberForDisplay(toDag(fee ?? 0)),
    nodeId,
    tokenLockRef,
  };

  const message = JSON.stringify(stakeData, null, 4);
  const isDisabled = accountChanged || networkChanged;

  return (
    <CardLayoutV3 title={title} logo={current?.logo} subtitle={current?.origin} isPositiveButtonLoading={isLoading} isPositiveButtonDisabled={isDisabled} onNegativeButtonClick={onReject} onPositiveButtonClick={onSign}>
      <div className={styles.container}>
        <Card>
          <CardRow label="Wallet name:" value={activeWallet?.label} error={accountChanged && 'Account changed'} />
          <CardRow label="Network:" value={networkLabel} error={networkChanged && 'Network changed'} />
        </Card>
        <Card>
          <CardRow.Object label="Transaction data:" value={message} />
        </Card>
      </div>
    </CardLayoutV3>
  );
};

export default DelegatedStakeView;
