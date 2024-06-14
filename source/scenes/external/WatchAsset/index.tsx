import React from 'react';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import Tooltip from 'components/Tooltip';
import CopyIcon from 'assets/images/svg/copy.svg';
import ConstellationIcon from 'assets/images/svg/constellation-blue.svg';
import { useCopyClipboard } from 'hooks/index';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { WatchAssetOptions } from 'scripts/Provider/constellation';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { ellipsis, formatNumber } from 'scenes/home/helpers';
import { DAG_NETWORK } from 'constants/index';
import dappSelectors from 'selectors/dappSelectors';

import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { EIPRpcError } from 'scripts/common';
import { getWalletController } from 'utils/controllersUtils';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';
import {
  ADD_TOKEN,
  ADD_TO_STARGAZER,
  ARE_YOU_SURE,
  BALANCE,
  CANCEL,
  L0_ENDPOINT,
  L1_ENDPOINT,
  METAGRAPH_ADDRESS,
  NETWORK,
  TOKEN,
  YOU_CAN_DELETE,
} from './constants';

const WatchAsset = () => {
  const [isAddressCopied, copyAddress] = useCopyClipboard(1000);
  const textTooltip = isAddressCopied ? 'Copied' : 'Copy Address';

  const { data, message } = StargazerExternalPopups.decodeRequestMessageLocationParams<{
    type: string;
    options: WatchAssetOptions;
    balance: number;
  }>(location.href);

  const { type, options, balance } = data;

  const { address, chainId, l0, l1, logo, symbol, name } = options;

  const wallet = getWalletController();
  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', 4001),
      message
    );

    window.close();
  };

  const onPositiveButtonClick = async () => {
    const selectedNetwork = Object.values(DAG_NETWORK).find(
      (network) => network.chainId === chainId
    );

    await wallet.account.assetsController.addCustomL0Token(
      l0,
      l1,
      address,
      name,
      symbol,
      selectedNetwork.id,
      logo
    );

    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseResult(true, message);

    window.close();
  };

  const renderL0tokenInfo = () => {
    const networkValue = Object.values(DAG_NETWORK).find(
      (network) => network.chainId === chainId
    ).label;
    return (
      <div className={styles.content}>
        <div className={styles.rowItem}>
          <TextV3.Caption
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.itemTitle}
          >
            {NETWORK}
          </TextV3.Caption>
          <div className={styles.logoContainer}>
            <img src={`/${ConstellationIcon}`} className={styles.logo} />
            <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.itemValue}>
              {networkValue}
            </TextV3.Body>
          </div>
        </div>
        <div className={styles.rowItem}>
          <TextV3.Caption
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.itemTitle}
          >
            {TOKEN}
          </TextV3.Caption>
          <div className={styles.logoContainer}>
            <img src={logo} className={styles.logo} alt="token logo" />
            <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.itemValue}>
              {symbol}
            </TextV3.Body>
          </div>
        </div>
        <div className={styles.rowItem}>
          <TextV3.Caption
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.itemTitle}
          >
            {BALANCE}
          </TextV3.Caption>
          <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.itemValue}>
            {formatNumber(balance, 0, 0)} {symbol}
          </TextV3.Body>
        </div>
        <div className={styles.rowItem}>
          <TextV3.Caption
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.itemTitle}
          >
            {METAGRAPH_ADDRESS}
          </TextV3.Caption>
          <Tooltip title={textTooltip} placement="bottom" arrow>
            <div className={styles.metagraphAddress} onClick={() => copyAddress(address)}>
              <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.itemValue}>
                {ellipsis(address)}
              </TextV3.Body>
              <img className={styles.copyIcon} src={`/${CopyIcon}`} alt="copy" />
            </div>
          </Tooltip>
        </div>
        <div className={styles.rowItem}>
          <TextV3.Caption
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.itemTitle}
          >
            {L0_ENDPOINT}
          </TextV3.Caption>
          <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.itemValue}>
            {l0}
          </TextV3.Body>
        </div>
        <div className={styles.rowItem}>
          <TextV3.Caption
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.itemTitle}
          >
            {L1_ENDPOINT}
          </TextV3.Caption>
          <TextV3.Body color={COLORS_ENUMS.BLACK} extraStyles={styles.itemValue}>
            {l1}
          </TextV3.Body>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.originContainer}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{origin}</TextV3.CaptionStrong>
        </div>
        <div className={styles.titleContainer}>
          <TextV3.BodyStrong
            color={COLORS_ENUMS.PRIMARY_LIGHTER_1}
            extraStyles={styles.title}
          >
            {ADD_TO_STARGAZER}
          </TextV3.BodyStrong>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.SECONDARY_TEXT}
            align={TEXT_ALIGN_ENUM.CENTER}
          >
            {ARE_YOU_SURE}
          </TextV3.CaptionRegular>
          <TextV3.CaptionRegular
            color={COLORS_ENUMS.SECONDARY_TEXT}
            align={TEXT_ALIGN_ENUM.CENTER}
          >
            {YOU_CAN_DELETE}
          </TextV3.CaptionRegular>
        </div>
      </div>
      <div className={styles.contentContainer}>
        {type === 'L0' && renderL0tokenInfo()}
      </div>
      <div className={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={CANCEL}
          extraStyle={styles.button}
          onClick={onNegativeButtonClick}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={ADD_TOKEN}
          extraStyle={styles.button}
          onClick={onPositiveButtonClick}
        />
      </div>
    </div>
  );
};

export default WatchAsset;
