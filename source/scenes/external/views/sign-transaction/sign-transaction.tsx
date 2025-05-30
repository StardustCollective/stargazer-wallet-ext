import React from 'react';
import Card from 'scenes/external/components/Card/Card';
import CardRow from 'scenes/external/components/CardRow/CardRow';
import CardLayoutV3 from 'scenes/external/Layouts/CardLayoutV3';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { useSelector } from 'react-redux';
import dappSelectors from 'selectors/dappSelectors';
import { IAssetInfoState } from 'state/assets/types';
import { useFiat } from 'hooks/usePrice';
import { formatBigNumberForDisplay } from 'utils/number';
import { AssetType } from 'state/vault/types';
import { getNativeToken } from 'scripts/Background/controllers/EVMChainController/utils';
import styles from './styles.scss';
import walletsSelectors from 'selectors/walletsSelectors';

export interface ISignTransactionProps {
  title: string;
  network: string;
  deviceId?: string;
  asset: IAssetInfoState;
  amount: number | string;
  fee: number | string;
  from: string;
  to: string;
  footer?: string;
  containerStyles?: string;
  fromDapp?: boolean;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const SignTransactionView = ({
  title,
  network,
  deviceId,
  asset,
  amount,
  fee,
  from,
  to,
  footer,
  fromDapp = true,
  containerStyles,
  onSign,
  onReject,
}: ISignTransactionProps) => {
  const activeWallet = useSelector(walletsSelectors.getActiveWallet);
  const current = useSelector(dappSelectors.getCurrent);

  // Calculate the max total amount in fiat
  const getFiatAmount = useFiat(true, asset);
  const total = Number(amount) + Number(fee);
  const maxTotal = getFiatAmount(total, 2);

  // Format the amount and fee values
  const amountValue = formatBigNumberForDisplay(amount);
  const feeValue = formatBigNumberForDisplay(fee ?? 0);

  const feeSymbol =
    asset.type === AssetType.Constellation ? asset.symbol : getNativeToken(asset.network);

  const amountString = `${amountValue} ${asset.symbol}`;
  const feeString = `${feeValue} ${feeSymbol}`;

  const subtitle = fromDapp ? current.origin : null;
  const logo = fromDapp ? current.logo : null;

  return (
    <CardLayoutV3
      logo={logo}
      title={title}
      subtitle={subtitle}
      onNegativeButtonClick={onReject}
      negativeButtonLabel="Reject"
      onPositiveButtonClick={onSign}
      positiveButtonLabel="Sign"
      containerStyles={containerStyles}
    >
      <div className={styles.container}>
        <Card>
          <CardRow label="Account:" value={activeWallet?.label} />
          <CardRow label="Network:" value={network} />
          {!!deviceId && <CardRow label="Device ID:" value={deviceId} />}
        </Card>
        <Card>
          <CardRow.Token label="Token:" value={asset} />
          <CardRow label="Amount:" value={amountString} />
          <CardRow label="Transaction fee:" value={feeString} />
        </Card>
        <Card>
          <CardRow.Address label="From:" value={from} />
          <CardRow.Address label="To:" value={to} />
        </Card>
        <Card>
          <CardRow label="Max Total:" value={maxTotal} />
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

export default SignTransactionView;
