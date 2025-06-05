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

import { getNativeToken } from 'scripts/Background/controllers/EVMChainController/utils';

import walletsSelectors from 'selectors/walletsSelectors';

import type { IAssetInfoState } from 'state/assets/types';
import { AssetType } from 'state/vault/types';

import type { HardwareWalletType } from 'utils/hardware';
import { formatBigNumberForDisplay, toDag } from 'utils/number';

import styles from './styles.scss';

export interface ISignTransactionProps {
  title: string;
  asset: IAssetInfoState;
  amount: number | string;
  fee: string;
  from: string;
  to?: string;
  footer?: string;
  origin?: string;
  containerStyles?: string;
  setFee: (fee: string) => void;
  onSign: () => Promise<void>;
  onReject: () => Promise<void>;
}

const WALLET_LOGO: Record<HardwareWalletType, string | JSX.Element> = {
  [KeyringWalletType.CypherockAccountWallet]: <CypherockLogo className={styles.logo} />,
  [KeyringWalletType.BitfiAccountWallet]: '/assets/images/bitfi_logo.png',
};

const SignTransactionView = ({ title, asset, amount, fee, origin, from, to, footer, containerStyles, setFee, onSign, onReject }: ISignTransactionProps) => {
  const { current, activeWallet, constellationNetwork, evmNetwork } = useExternalViewData();
  const deviceId = useSelector(walletsSelectors.selectActiveWalletDeviceId);
  const network = asset.type === AssetType.Constellation ? constellationNetwork : evmNetwork;

  const calculateTotal = (amountValue: number | string, feeValue: string): { amountNumber: number; feeNumber: number; totalNumber: number } => {
    if (asset.type === AssetType.Constellation) {
      const amountInDag = toDag(amountValue);
      const feeInDag = Number(feeValue);
      const totalInDag = amountInDag + feeInDag;

      return { amountNumber: amountInDag, feeNumber: feeInDag, totalNumber: totalInDag };
    }

    return { amountNumber: Number(amount), feeNumber: Number(feeValue), totalNumber: Number(amount) + Number(feeValue) };
  };

  // Calculate the max total amount in fiat
  const getFiatAmount = useFiat(true, asset);
  const { amountNumber, feeNumber, totalNumber } = calculateTotal(amount, fee);

  // Format the amount and fee values
  const amountValue = formatBigNumberForDisplay(amountNumber);
  const feeValue = formatBigNumberForDisplay(feeNumber);

  const feeSymbol = asset.type === AssetType.Constellation ? asset.symbol : getNativeToken(asset.network);

  const amountString = `${amountValue} ${asset.symbol}`;
  const feeString = `${feeValue} ${feeSymbol}`;

  const fromDapp = origin !== 'stargazer-wallet';
  const subtitle = fromDapp ? current.origin : null;
  const logo = fromDapp ? current.logo : WALLET_LOGO[activeWallet.type as HardwareWalletType];

  const assetWithPrice = 'priceId' in asset;
  const totalLabel = assetWithPrice ? 'Max Total:' : 'Total:';
  const totalValue = assetWithPrice ? getFiatAmount(totalNumber, 2) : `${formatBigNumberForDisplay(totalNumber)} ${feeSymbol}`;

  const recommendedFee = asset.type === AssetType.Constellation ? '0' : '0';

  return (
    <CardLayoutV3
      fee={{
        show: true,
        defaultValue: feeNumber.toString(),
        value: fee,
        recommended: recommendedFee,
        symbol: feeSymbol,
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

export default SignTransactionView;
