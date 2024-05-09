///////////////////////////
// Modules
///////////////////////////
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import {
  KeyringNetwork,
  KeyringWalletState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';

///////////////////////////
// Components
///////////////////////////
import TextV3 from 'components/TextV3';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from 'components/Icon';

///////////////////////////
// Layouts
///////////////////////////
import CardLayout from 'scenes/external/Layouts/CardLayout';

///////////////////////////
// Selectors
///////////////////////////
import walletsSelectors from 'selectors/walletsSelectors';

///////////////////////////
// Styles
///////////////////////////
import { COLORS_ENUMS } from 'assets/styles/colors';
import { withStyles } from '@material-ui/core/styles';
import styles from './index.module.scss';
const PurpleCheckbox = withStyles({
  root: {
    color: '#2B1D52',
    '&$checked': {
      color: '#2B1D52',
    },
  },
})(({ onChange, checked }: { onChange: (e: any) => void; checked: boolean }) => (
  <Checkbox color="default" onChange={onChange} checked={checked} />
));

///////////////////////////
// Images
///////////////////////////
import ConstellationIcon from 'assets/images/svg/constellation.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';
import StargazerIcon from 'assets/images/svg/stargazerLogoV3.svg';

///////////////////////////
// Hooks Imports
///////////////////////////

import {
  sendDappMessage,
  sendExternalMessage,
} from 'scripts/Background/messaging/messenger';
import { DappMessageID, ExternalMessageID } from 'scripts/Background/messaging/types';
import dappSelectors from 'selectors/dappSelectors';

///////////////////////////
// Types
///////////////////////////
type IWalletItem = {
  wallet: KeyringWalletState;
  onCheckboxChange: (checked: boolean, wallet: KeyringWalletState) => void;
};

///////////////////////////
// Enums
///////////////////////////
enum SCENE_STATE {
  SELECT_ACCOUNTS = 1,
  CONNECT,
}

///////////////////////////
// View
///////////////////////////
const SelectAccounts = () => {
  ///////////////////////////
  // Hooks
  ///////////////////////////

  const current = useSelector(dappSelectors.getCurrent);
  const allWallets = useSelector(walletsSelectors.selectAllWallets);
  const [wallets, setWallets] = useState<KeyringWalletState[]>([]);
  const [network, setNetwork] = useState<string>('');
  const [selectedWallets, setSelectedWallets] = useState<KeyringWalletState[]>([]);
  const [sceneState, setSceneState] = useState<SCENE_STATE>(SCENE_STATE.SELECT_ACCOUNTS);
  const origin = current && current.origin;

  // Set the network based on query string to determine
  // which accounts to return after selecting wallets
  useEffect(() => {
    const { network } = queryString.parse(location.search);

    setNetwork(network as string);
    setWallets(allWallets);
  }, []);

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const onPositiveButtonPressed = async () => {
    if (sceneState === SCENE_STATE.SELECT_ACCOUNTS) {
      setSceneState(SCENE_STATE.CONNECT);
    } else if (sceneState === SCENE_STATE.CONNECT) {
      const accounts = selectedWallets.reduce((carry, wallet) => {
        carry = carry.concat(wallet.accounts);
        return carry;
      }, []);

      const ethAccounts = accounts
        .filter(({ network }) => network === KeyringNetwork.Ethereum)
        .map(({ address }) => address);

      const dagAccounts = accounts
        .filter(({ network }) => network === KeyringNetwork.Constellation)
        .map(({ address }) => address);

      // No specific network selected, connect both
      if (!network) {
        await sendDappMessage(DappMessageID.connect, {
          origin,
          dapp: current,
          network: KeyringNetwork.Ethereum,
          accounts: ethAccounts,
        });
        await sendDappMessage(DappMessageID.connect, {
          origin,
          dapp: current,
          network: KeyringNetwork.Constellation,
          accounts: dagAccounts,
        });
      } else {
        await sendDappMessage(DappMessageID.connect, {
          origin,
          dapp: current,
          network,
          accounts,
        });
      }

      const { windowId }: { windowId?: string } = queryString.parse(
        window.location.search
      );
      await sendExternalMessage(ExternalMessageID.connectWallet, { windowId, accounts });
      window.close();
    }
  };

  const onNegativeButtonPressed = () => {
    if (sceneState === SCENE_STATE.SELECT_ACCOUNTS) {
      window.close();
    } else if (sceneState === SCENE_STATE.CONNECT) {
      setSceneState(SCENE_STATE.SELECT_ACCOUNTS);
    }
  };

  const onCheckboxChange = (checked: boolean, wallet: KeyringWalletState) => {
    // Add the account address to the white list.
    if (checked) {
      setSelectedWallets([...selectedWallets, wallet]);
    } else {
      const wallets = selectedWallets.filter(
        (selectedWallet: any) => wallet.id !== selectedWallet.id
      );
      setSelectedWallets(wallets);
    }
  };

  ///////////////////////////
  // Renders
  ///////////////////////////

  const RenderWalletItem = ({ wallet, onCheckboxChange }: IWalletItem) => {
    let icon = '',
      symbolText = '',
      iconStyle = styles.icon;
    if (
      wallet.type === KeyringWalletType.SingleAccountWallet &&
      wallet.supportedAssets[0] === 'DAG'
    ) {
      icon = ConstellationIcon;
      symbolText = 'DAG';
    } else if (
      wallet.type === KeyringWalletType.SingleAccountWallet &&
      wallet.supportedAssets[0] === 'ETH'
    ) {
      icon = EthereumIcon;
      symbolText = 'ETH';
    } else {
      icon = StargazerIcon;
      symbolText = 'Multi Chain Wallet';
      iconStyle = styles.iconPurple;
    }

    return (
      <div key={wallet.id} className={styles.walletItem}>
        <div className={styles.walletItemCheckBox}>
          <PurpleCheckbox
            onChange={(e: any) => onCheckboxChange(e.target.checked, wallet)}
            checked={
              selectedWallets.filter((selectedWallet) => wallet.id === selectedWallet.id)
                .length > 0
            }
          />
        </div>
        <div className={styles.walletItemIcon}>
          <Icon width={25} Component={icon} iconStyles={iconStyle} />
        </div>
        <div className={styles.walletItemDetails}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {wallet.label}
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>{symbolText}</TextV3.Caption>
        </div>
      </div>
    );
  };

  const RenderContentByState = ({ state }: { state: SCENE_STATE }) => {
    if (state === SCENE_STATE.SELECT_ACCOUNTS) {
      return (
        <>
          {wallets.length > 0 &&
            wallets.map((wallet: KeyringWalletState) => (
              <RenderWalletItem
                key={wallet.id}
                wallet={wallet}
                onCheckboxChange={onCheckboxChange}
              />
            ))}
        </>
      );
    } else if (state === SCENE_STATE.CONNECT) {
      return (
        <div className={styles.connectPermissionsPrompt}>
          <TextV3.Header color={COLORS_ENUMS.BLACK}>Connect To</TextV3.Header>
          <TextV3.Body color={COLORS_ENUMS.BLACK}>
            {selectedWallets.length} Wallet(s)
          </TextV3.Body>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.BLACK}
            extraStyles={styles.allowSitesText}
          >
            Allow this site to:
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.permissionText}>
            View the addresses of your permitted wallets.
          </TextV3.Caption>
        </div>
      );
    }

    return null;
  };

  return (
    <CardLayout
      stepLabel={`${sceneState === SCENE_STATE.SELECT_ACCOUNTS ? '1' : '2'} out 2`}
      originDescriptionLabel={'Connect to:'}
      headerLabel={'Connect with Stargazer'}
      captionLabel={
        sceneState === SCENE_STATE.SELECT_ACCOUNTS
          ? 'Select Account(s)'
          : 'Grant Permissions'
      }
      negativeButtonLabel={sceneState === SCENE_STATE.SELECT_ACCOUNTS ? 'Cancel' : 'Back'}
      onNegativeButtonClick={onNegativeButtonPressed}
      positiveButtonLabel={
        sceneState === SCENE_STATE.SELECT_ACCOUNTS ? 'Next' : 'Connect'
      }
      onPositiveButtonClick={onPositiveButtonPressed}
      isPositiveButtonDisabled={selectedWallets.length === 0}
    >
      <RenderContentByState state={sceneState} />
    </CardLayout>
  );
};

export default SelectAccounts;
