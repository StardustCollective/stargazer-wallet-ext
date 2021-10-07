///////////////////////////
// Modules
///////////////////////////

import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import {
  KeyringNetwork
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

import walletsSelectors from 'selectors/walletsSelectors'

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
})(({ onChange, checked }: { onChange: (e: any) => void, checked: boolean }) => <Checkbox color="default" onChange={onChange} checked={checked} />);

///////////////////////////
// Images
///////////////////////////

import ConstellationIcon from 'assets/images/svg/constellation.svg';
import EthereumIcon from 'assets/images/svg/ethereum.svg';

///////////////////////////
// Hooks Imports
///////////////////////////

import { useController } from 'hooks/index';

///////////////////////////
// Types
///////////////////////////

import { IAccountDerived } from 'state/vault/types';

type IAccountItem = {
  accountName: string;
  accountAddress: string;
  accountBalance: string;
  onCheckboxChange: (checked: boolean, address: string) => void;
}

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

  const allDagAccounts = useSelector(walletsSelectors.selectAllDagAccounts);
  const allEthAccounts = useSelector(walletsSelectors.selectAllEthAccounts);
  const [accounts, setAccounts] = useState<IAccountDerived[]>([]);
  const [network, setNetwork] = useState<string>("");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [sceneState, setSceneState] = useState<SCENE_STATE>(SCENE_STATE.SELECT_ACCOUNTS);
  const controller = useController();
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;

  // Set the account data based on the type of network
  // that is retrieved from the query parameter.
  useEffect(() => {
    const { network } = queryString.parse(location.search);
    setNetwork(network as string);
    if (network === KeyringNetwork.Constellation) {
      setAccounts(allDagAccounts)
    } else if (network === KeyringNetwork.Ethereum) {
      setAccounts(allEthAccounts)
    }
  }, []);

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const onPositiveButtonPressed = async () => {
    if (sceneState === SCENE_STATE.SELECT_ACCOUNTS) {
      setSceneState(SCENE_STATE.CONNECT);
    } else if (sceneState === SCENE_STATE.CONNECT) {
      controller.dapp.fromUserConnectDApp(origin, current, network, selectedAccounts);
      const background = await browser.runtime.getBackgroundPage();

      background.dispatchEvent(
        new CustomEvent('connectWallet', { detail: { hash: window.location.hash, accounts: selectedAccounts } })
      );

      window.close();
    }
  }

  const onNegativeButtonPressed = () => {
    if(sceneState === SCENE_STATE.SELECT_ACCOUNTS){
      window.close();
    }else if(sceneState === SCENE_STATE.CONNECT){
      setSceneState(SCENE_STATE.SELECT_ACCOUNTS);
    }
  }

  const onCheckboxChange = (checked: boolean, address: string) => {
    // Add the account address to the white list.
    if (checked) {
      let accounts = [...selectedAccounts, address];
      setSelectedAccounts(accounts);
    } else {
      let accounts = selectedAccounts.filter((account) => account !== address);
      setSelectedAccounts(accounts);
    }
  }

  ///////////////////////////
  // Renders
  ///////////////////////////

  const RenderAccountItem = ({
    accountName,
    accountAddress,
    accountBalance,
    onCheckboxChange
  }: IAccountItem) => {

    const shortAddress = accountAddress.substring(accountAddress.length - 4)
    const symbol = network === KeyringNetwork.Constellation ? 'DAG' : 'ETH';
    let icon = '';

    if (network === KeyringNetwork.Constellation) {
      icon = ConstellationIcon
    } else if (network === KeyringNetwork.Ethereum) {
      icon = EthereumIcon;
    }

    return (
      <div key={accountAddress} className={styles.walletItem}>
        <div className={styles.walletItemCheckBox}>
          <PurpleCheckbox
            onChange={(e: any) => onCheckboxChange(e.target.checked, accountAddress)}
            checked={(selectedAccounts.filter((account) => account === accountAddress).length > 0)}
          />
        </div>
        <div className={styles.walletItemIcon}>
          <Icon width={25} Component={icon} iconStyles={styles.icon} />
        </div>
        <div className={styles.walletItemDetails}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
            {accountName} (...{shortAddress})
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK}>
            {accountBalance} {symbol}
          </TextV3.Caption>
        </div>
      </div>
    );

  }

  const RenderContentByState = ({ state }: { state: SCENE_STATE }) => {

    if (state === SCENE_STATE.SELECT_ACCOUNTS) {
      return (
        <>
          {accounts.length > 0 && accounts.map((account: IAccountDerived) => (
            <RenderAccountItem
              accountName={account.label}
              accountAddress={account.address}
              accountBalance=""
              onCheckboxChange={onCheckboxChange}
            />
          ))}
        </>
      );
    } else if (state === SCENE_STATE.CONNECT) {
      return (
        <div className={styles.connectPermissionsPrompt}>
          <TextV3.Header color={COLORS_ENUMS.BLACK}>
            Connect To
          </TextV3.Header>
          <TextV3.Body color={COLORS_ENUMS.BLACK}>
            {selectedAccounts.length} Account(s)
          </TextV3.Body>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.allowSitesText}>
            Allow this site to:
          </TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.permissionText}>
            View the addresses of your permitted accounts.
          </TextV3.Caption>
        </div>
      )
    }

    return null;
  }

  return (
    <CardLayout
      stepLabel={`${sceneState === SCENE_STATE.SELECT_ACCOUNTS ? '1' : '2'} out 2`}
      originDescriptionLabel={'Connect to:'}
      headerLabel={'Connect with Stargazer'}
      captionLabel={sceneState === SCENE_STATE.SELECT_ACCOUNTS ? 'Select Account(s)' : 'Grant Permissions'}
      negativeButtonLabel={sceneState === SCENE_STATE.SELECT_ACCOUNTS ? 'Cancel' : 'Back'}
      onNegativeButtonClick={onNegativeButtonPressed}
      positiveButtonLabel={sceneState === SCENE_STATE.SELECT_ACCOUNTS ? 'Next' : 'Connect'}
      onPositiveButtonClick={onPositiveButtonPressed}
    >
      <RenderContentByState state={sceneState} />
    </CardLayout>
  );
};

export default SelectAccounts;
