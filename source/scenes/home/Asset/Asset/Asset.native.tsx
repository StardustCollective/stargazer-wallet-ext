import React, { FC, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import * as Progress from 'react-native-progress';
import TextV3 from 'components/TextV3';
import QRCode from 'react-native-qrcode-svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS, NEW_COLORS } from 'assets/styles/_variables';
import Container from 'components/Container';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import CopyIcon from 'assets/images/svg/copy.svg';
import ArrowsIcon from 'assets/images/svg/arrows.svg';
import GiftIcon from 'assets/images/svg/gift.svg';
import {
  getNetworkLabel,
  getNetworkLogo,
  getNetworkFromChainId,
} from 'scripts/Background/controllers/EVMChainController/utils';
import { CONSTELLATION_LOGO } from 'constants/index';
import { AssetSymbol, AssetType } from 'state/vault/types';
import TxsPanel from '../TxsPanel';
import IAssetSettings from './types';
import AssetButtons from '../AssetButtons';
import styles from './styles';

const QR_CODE_SIZE = 240;

const renderScene = ({ route }) => {
  return <TxsPanel route={route.key} />;
};

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  activeNetwork,
  balanceText,
  fiatAmount,
  onSendClick,
  assets,
  showQrCode,
  setShowQrCode,
  isAddressCopied,
  copyAddress,
  showFiatAmount,
}) => {
  const [routeIndex, setRouteIndex] = useState(0);
  const [routes] = useState([
    { key: 'transactions', title: 'Transactions' },
    { key: 'rewards', title: 'Rewards' },
  ]);
  const activeAssetStyle = StyleSheet.flatten([
    styles.mask,
    !!activeAsset && !!activeWallet ? styles.loaderHide : {},
  ]);
  const asset = assets[activeAsset?.id];
  const showRewardsTab = activeAsset?.type === AssetType.Constellation;
  let network = asset?.network;
  // 349: New network should be added here.
  if (
    [AssetSymbol.ETH, AssetSymbol.MATIC, AssetSymbol.AVAX, AssetSymbol.BNB].includes(
      asset?.symbol
    )
  ) {
    const currentNetwork = getNetworkFromChainId(network);
    network = activeNetwork[currentNetwork as keyof typeof activeNetwork];
  } else if (AssetSymbol.DAG === asset?.symbol) {
    network = activeNetwork.Constellation;
  }

  const renderTabLabel = ({ route, focused }) => {
    const focusedStyle = focused && styles.labelFocused;
    const isRewards = route.key === 'rewards';
    const iconColor = focused ? COLORS.white : NEW_COLORS.secondary_text;
    return (
      <View style={styles.labelContainer}>
        {isRewards ? <GiftIcon color={iconColor} /> : <ArrowsIcon color={iconColor} />}
        <TextV3.LabelSemiStrong
          color={focused ? COLORS_ENUMS.WHITE : COLORS_ENUMS.SECONDARY_TEXT}
          extraStyles={[styles.tabLabel, focusedStyle]}
        >
          {route.title}
        </TextV3.LabelSemiStrong>
      </View>
    );
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={renderTabLabel}
      style={styles.tabBar}
      labelStyle={styles.tabBarLabel}
      activeColor={COLORS.white}
      indicatorStyle={styles.tabBarIndicator}
    />
  );

  const networkLabel = getNetworkLabel(network);
  const networkLogo =
    asset?.type === AssetType.Constellation
      ? CONSTELLATION_LOGO
      : getNetworkLogo(asset?.network);

  if (!!activeWallet && !!activeAsset) {
    return (
      <>
        <View style={styles.wrapper}>
          <View style={styles.center}>
            <View style={styles.balance}>
              <TextV3.HeaderDisplay
                color={COLORS_ENUMS.WHITE}
                dynamic
                extraStyles={styles.balanceText}
              >
                {balanceText}
              </TextV3.HeaderDisplay>
              <TextV3.Body color={COLORS_ENUMS.WHITE} extraStyles={styles.symbolText}>
                {assets[activeAsset.id].symbol}
              </TextV3.Body>
            </View>
            {showFiatAmount && (
              <View style={styles.fiatBalance}>
                <TextV3.Body extraStyles={styles.fiatText}>{fiatAmount}</TextV3.Body>
              </View>
            )}
            <View style={styles.actions}>
              <AssetButtons
                setShowQrCode={setShowQrCode}
                onSendClick={onSendClick}
                assetId={activeAsset?.id}
              />
            </View>
          </View>
          {showRewardsTab ? (
            <TabView
              navigationState={{ index: routeIndex, routes }}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              onIndexChange={setRouteIndex}
              initialLayout={{ width: Dimensions.get('window').width }}
            />
          ) : (
            <TxsPanel route="transactions" />
          )}
        </View>
        <Modal animationType="slide" transparent={false} visible={showQrCode}>
          <Container>
            <View style={styles.qrCodeCloseButton}>
              <TouchableOpacity onPress={() => setShowQrCode(false)}>
                <Icon name="close" />
              </TouchableOpacity>
            </View>
            <View style={styles.qrCode}>
              <Tooltip
                visible={isAddressCopied}
                width={80}
                body="Copied"
                arrow
                onOpen={() => copyAddress(activeAsset?.address)}
                skipAndroidStatusBar
              >
                <View style={styles.qrCodeCard}>
                  <View style={styles.network}>
                    <View style={styles.logoContainer}>
                      <Image source={{ uri: networkLogo }} style={styles.logo} />
                    </View>
                    <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                      {networkLabel}
                    </TextV3.BodyStrong>
                  </View>
                  <QRCode
                    value={activeAsset.address}
                    backgroundColor={COLORS.white}
                    color={COLORS.black}
                    size={QR_CODE_SIZE}
                  />
                  <View style={styles.addressContainer}>
                    <TextV3.Caption
                      color={COLORS_ENUMS.BLACK}
                      extraStyles={styles.qrCodeAddressText}
                    >
                      {activeAsset.address.substring(0, 10)}...
                      {activeAsset.address.substring(
                        activeAsset.address.length - 10,
                        activeAsset.address.length
                      )}
                    </TextV3.Caption>
                    <CopyIcon height={20} width={20} />
                  </View>
                </View>
              </Tooltip>
            </View>
          </Container>
        </Modal>
      </>
    );
  }

  return (
    <View style={activeAssetStyle}>
      <Progress.Circle size={40} indeterminate color="white" />
    </View>
  );
};

export default AssetDetail;
