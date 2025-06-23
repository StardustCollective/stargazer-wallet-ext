import React from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useExternalViewData } from 'hooks/external/useExternalViewData';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { WalletParam } from 'scripts/Background/messaging';

import styles from './styles.scss';

export interface ISignDataProps {
  title: string;
  wallet: WalletParam;
  transactionData: string;
  footer?: string;
  onSign: () => Promise<void>;
  onReject: () => void;
}

const SignDataView = ({ title, wallet, transactionData, footer, onSign, onReject }: ISignDataProps) => {
  const { current, activeWallet, networkLabel, accountChanged } = useExternalViewData(wallet);

  return (
    <CardLayoutV3 logo={current.logo} title={title} subtitle={current.origin} onNegativeButtonClick={onReject} negativeButtonLabel="Reject" onPositiveButtonClick={onSign} positiveButtonLabel="Sign" isPositiveButtonDisabled={accountChanged}>
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={activeWallet?.label} error={accountChanged && 'Account changed'} />
          <CardRow label="Network:" value={networkLabel} />
        </Card>
        <Card>
          <CardRow.Object label="Transaction data:" value={transactionData} />
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

export default SignDataView;
