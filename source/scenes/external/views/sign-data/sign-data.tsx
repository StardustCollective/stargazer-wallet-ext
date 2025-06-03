import React from 'react';
import { useSelector } from 'react-redux';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import Card from 'scenes/external/components/Card';
import CardRow from 'scenes/external/components/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import dappSelectors from 'selectors/dappSelectors';

import styles from './styles.scss';

export interface ISignDataProps {
  title: string;
  account: string;
  network: string;
  transactionData: string;
  footer?: string;
  onSign: () => Promise<void>;
  onReject: () => void;
}

const SignDataView = ({ title, account, network, transactionData, footer, onSign, onReject }: ISignDataProps) => {
  const current = useSelector(dappSelectors.getCurrent);

  return (
    <CardLayoutV3 logo={current.logo} title={title} subtitle={current.origin} onNegativeButtonClick={onReject} negativeButtonLabel="Reject" onPositiveButtonClick={onSign} positiveButtonLabel="Sign">
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={account} />
          <CardRow label="Network:" value={network} />
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
