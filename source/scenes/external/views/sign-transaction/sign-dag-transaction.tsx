import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import React from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as CypherockLogo } from 'assets/images/svg/cypherock-animated.svg';
import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';

import { useExternalViewData } from 'hooks/external/useExternalViewData';
import { useFiat } from 'hooks/usePrice';

import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';

import { WalletParam } from 'scripts/Background/messaging';

import walletsSelectors from 'selectors/walletsSelectors';

import type { IAssetInfoState } from 'state/assets/types';

import type { HardwareWalletType } from 'utils/hardware';
import { formatBigNumberForDisplay, toDag } from 'utils/number';

import styles from './styles.scss';

export interface ISignDagTransactionProps {
  title: string;
  asset: IAssetInfoState | null;
  transaction: {
    from: string;
    to: string;
    value: number;
    fee?: number;
  };
  fee: string;
  footer?: string;
  origin?: string;
  containerStyles?: string;
  isLoading?: boolean;
  wallet: WalletParam;
  setFee: (fee: string) => void;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const WALLET_LOGO: Record<HardwareWalletType, string | JSX.Element> = {
  [KeyringWalletType.CypherockAccountWallet]: <CypherockLogo className={styles.logo} />,
  [KeyringWalletType.BitfiAccountWallet]: '/assets/images/bitfi_logo.png',
};

export const SignDagTransactionView = ({ title, asset, transaction, fee, origin, footer, containerStyles, isLoading, wallet, setFee, onSign, onReject }: ISignDagTransactionProps) => {
  const { from, to, value: amount } = transaction;
  const { current, activeWallet, networkLabel, accountChanged, networkChanged } = useExternalViewData(wallet);
  const deviceId = useSelector(walletsSelectors.selectActiveWalletDeviceId);

  // DAG-specific calculations (always in DAG/DATUM)
  const amountInDag = toDag(amount ?? 0);
  const feeInDag = Number(fee ?? 0);
  const totalInDag = amountInDag + feeInDag;

  // Get fiat amounts for display
  const getFiatAmount = useFiat(true, asset);

  // Format the amount and fee values
  const amountValue = formatBigNumberForDisplay(amountInDag);
  const feeValue = formatBigNumberForDisplay(feeInDag);

  const amountString = asset ? `${amountValue} ${asset?.symbol}` : '-';
  const feeString = asset ? `${feeValue} ${asset?.symbol}` : '-';

  const fromDapp = origin !== 'stargazer-wallet';
  const subtitle = fromDapp ? current.origin : null;
  const logo = fromDapp ? current.logo : WALLET_LOGO[activeWallet.type as HardwareWalletType];

  // For DAG transactions, show fiat value if available
  const assetWithPrice = !!asset?.priceId;
  const totalLabel = assetWithPrice ? 'Max Total:' : 'Total:';
  const totalValue = assetWithPrice ? getFiatAmount(totalInDag, 2) : asset ? `${formatBigNumberForDisplay(totalInDag)} ${asset?.symbol}` : '-';

  const recommendedFee = '0'; // Default DAG fee

  const tokenValue = { logo: asset?.logo, symbol: asset ? asset?.symbol : '-' };

  return (
    <CardLayoutV3
      fee={{
        show: true,
        defaultValue: feeInDag.toString(),
        value: feeValue,
        recommended: recommendedFee,
        symbol: asset ? asset?.symbol : '-',
        disabled: false,
        setFee,
      }}
      logo={logo}
      title={title}
      subtitle={subtitle}
      onNegativeButtonClick={onReject}
      negativeButtonLabel="Reject"
      onPositiveButtonClick={onSign}
      positiveButtonLabel="Sign"
      isPositiveButtonLoading={isLoading}
      isPositiveButtonDisabled={isLoading || accountChanged || networkChanged}
      containerStyles={containerStyles}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={activeWallet?.label} error={accountChanged && 'Account changed'} />
          <CardRow label="Network:" value={networkLabel} error={networkChanged && 'Network changed'} />
          {!!deviceId && <CardRow label="Device ID:" value={deviceId} />}
        </Card>
        <Card>
          <CardRow.Token label="Token:" value={tokenValue} />
          <CardRow label="Amount:" value={amountString} />
          <CardRow label="Transaction fee:" value={feeString} />
        </Card>
        <Card>
          <CardRow.Address label="From:" value={from} />
          {!!to && <CardRow.Address label="To:" value={to} />}
        </Card>
        <Card>
          <CardRow label={totalLabel} value={totalValue} />
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
