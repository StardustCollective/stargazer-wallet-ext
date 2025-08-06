import React, { FC, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import * as Progress from 'react-native-progress';
import TextV3 from 'components/TextV3';
import QRCode from 'react-native-qrcode-svg';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { COLORS } from 'assets/styles/_variables';
import Container from 'components/Container';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import CopyIcon from 'assets/images/svg/copy.svg';
import { getNetworkLogo } from 'scripts/Background/controllers/EVMChainController/utils';
import { CONSTELLATION_LOGO } from 'constants/index';
import { AssetType } from 'state/vault/types';
import useNetworkLabel from 'hooks/useNetworkLabel';
import Sheet from 'components/Sheet';
import TxsPanel from '../TxsPanel';
import IAssetSettings from './types';
import styles from './styles';
import Balance from '../Balance';
import { CONTAINER_COLOR } from 'components/Container';

const QR_CODE_SIZE = 240;

const renderScene = ({ route }) => {
  return <TxsPanel route={route.key} />;
};

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  balanceText,
  fiatAmount,
  showLocked,
  lockedBalanceText,
  fiatLocked,
  showBuy,
  onBuy,
  onSend,
  onReceive,
  assets,
  showQrCode,
  setShowQrCode,
  isAddressCopied,
  copyAddress,
  showFiatAmount,
}) => {
  const [isLockedInfoOpen, setIsLockedInfoOpen] = useState(false);
  const [routeIndex, setRouteIndex] = useState(0);
  const [routes] = useState([
    { key: 'transactions', title: 'Transactions' },
    { key: 'actions', title: 'Actions' },
    { key: 'rewards', title: 'Rewards' },
  ]);
  const activeAssetStyle = StyleSheet.flatten([
    styles.mask,
    !!activeAsset && !!activeWallet ? styles.loaderHide : {},
  ]);
  const asset = assets[activeAsset?.id];
  const showRewardsTab = activeAsset?.type === AssetType.Constellation;
  const networkLabel = useNetworkLabel(asset);

  const renderTabLabel = ({ route, focused }) => {
    const focusedStyle = focused && styles.labelFocused;
    return (
      <View style={styles.labelContainer}>
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

  const networkLogo =
    asset?.type === AssetType.Constellation
      ? CONSTELLATION_LOGO
      : getNetworkLogo(asset?.network);

  if (!!activeWallet && !!activeAsset) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceScrollView}>
          <View style={styles.balanceContainer}>
            <Balance.Root>
              <Balance.Header>
                <Balance.Available />
              </Balance.Header>
              <Balance.Content>
                <Balance.TokenAmount amount={balanceText} />
                {showFiatAmount && <Balance.FiatAmount amount={fiatAmount} />}
              </Balance.Content>
              <Balance.Footer>
                {showBuy && <Balance.Buy  onPress={onBuy} />}
                <Balance.Send  onPress={onSend} />
                <Balance.Receive  onPress={onReceive} />
              </Balance.Footer>
            </Balance.Root>
            {showLocked && 
              <View style={styles.lockedBalance}>
                <Balance.Root>
                  <Balance.Header>
                    <Balance.Locked onInfoPress={() => setIsLockedInfoOpen(true)} />
                  </Balance.Header>
                  <Balance.Content>
                    <Balance.TokenAmount amount={lockedBalanceText} />
                    {showFiatAmount && <Balance.FiatAmount amount={fiatLocked} />}
                  </Balance.Content>
                </Balance.Root>
              </View>
            }
          </View>
        </View>
        {showRewardsTab ? (
          <View style={styles.tabViewContainer}>
            <TabView
              navigationState={{ index: routeIndex, routes }}
              renderScene={renderScene}
              renderTabBar={renderTabBar}
              onIndexChange={setRouteIndex}
              initialLayout={{ width: Dimensions.get('window').width }}
            />
          </View>
        ) : (
          <TxsPanel route="transactions" />
        )}
        <Modal animationType="slide" transparent={false} visible={showQrCode}>
          <Container color={CONTAINER_COLOR.DARK}>
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
                onOpen={() => copyAddress && copyAddress(activeAsset?.address)}
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
        <Sheet
          isVisible={isLockedInfoOpen}
          onClosePress={() => setIsLockedInfoOpen(false)}
          height={300}
          title={{
            label: 'Locked Balance',
            align: 'left',
          }}
        >
          <TextV3.Body extraStyles={styles.lockedInfoText}>Tokens you can’t move right now due to actions like ‘AllowSpend’ or ‘TokenLock’. AllowSpend pre-approves another wallet to spend tokens for you.</TextV3.Body>
          <TextV3.Body extraStyles={styles.lockedInfoText}>TokenLock freezes them temporarily, often for staking or governance. The tokens stay in your wallet but can’t be used until unlocked.</TextV3.Body>
        </Sheet>
      </ScrollView>
    );
  }

  return (
    <View style={activeAssetStyle}>
      <Progress.Circle size={40} indeterminate color="white" />
    </View>
  );
};

export default AssetDetail;
