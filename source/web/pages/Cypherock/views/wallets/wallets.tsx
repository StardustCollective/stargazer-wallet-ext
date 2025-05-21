import React from 'react';
import clsx from 'clsx';
import TextV3 from 'components/TextV3';
import { ReactComponent as WalletIcon } from 'assets/images/svg/single-wallet.svg';
import { ReactComponent as CircleCheck } from 'assets/images/svg/circle-check.svg';
import { IWalletItem } from '@cypherock/sdk-app-manager';
import styles from './styles.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

type WalletsViewProps = {
  wallets: IWalletItem[];
  selectedWallet: IWalletItem | null;
  onSelectWallet: (wallet: IWalletItem) => void;
};

const WalletsView = ({ wallets, selectedWallet, onSelectWallet }: WalletsViewProps) => {
  return (
    <div className={styles.container}>
      {wallets?.length &&
        wallets.map((wallet, index) => {
          const isSelected = selectedWallet?.id === wallet?.id;
          const walletSelectedStyle = isSelected && styles.walletSelected;

          return (
            <button
              className={clsx(styles.walletItem, walletSelectedStyle)}
              key={`${index}-${wallet.name}`}
              onClick={() => onSelectWallet(wallet)}
            >
              <WalletIcon className={styles.walletIcon} />
              <TextV3.BodyStrong
                color={COLORS_ENUMS.BLACK}
                extraStyles={styles.walletName}
              >
                {wallet.name}
              </TextV3.BodyStrong>
              {isSelected && <CircleCheck className={styles.selectedIcon} />}
            </button>
          );
        })}
    </div>
  );
};

export default WalletsView;
