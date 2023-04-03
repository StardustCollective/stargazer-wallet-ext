///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import CheckIcon from 'assets/images/svg/check-transparent.svg';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////////
// Types
///////////////////////////

import { INetworksModal } from './types';

///////////////////////////
// Constants
///////////////////////////

import { ALL_MAINNET_CHAINS, ALL_TESTNETS_CHAINS } from 'constants/index';

///////////////////////////
// Scene
///////////////////////////

const NetworksModal: FC<INetworksModal> = ({ 
  currentNetwork,
  handleSwitchActiveNetwork,
}) => {

  const renderCheckIcon = (walletId: string, activeWalletId: string) => {
    if (walletId !== activeWalletId) {
      return null;
    }

    return (
      <View style={styles.checkContainer}>
        <CheckIcon height={12} width={18}/>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scroll} 
      contentContainerStyle={styles.scrollContainer} 
      showsVerticalScrollIndicator={false}
    >
      <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
        Mainnets
      </TextV3.Caption>
      {
        ALL_MAINNET_CHAINS.map((chain, i) => {
          const walletStyles = StyleSheet.flatten([
            styles.walletWrapper,
            i === 0 ? styles.firstChild : {},
            i === ALL_MAINNET_CHAINS.length - 1 ? styles.lastChild : {},
          ]);

          return (
            <TouchableOpacity key={i} onPress={() => handleSwitchActiveNetwork(chain.id)}>
              <View style={walletStyles}>
                <View style={styles.assetIconWrapper}>
                  <Image source={{ uri: chain.logo }} style={styles.assetIcon} />
                </View>
                <View testID={chain.id} style={styles.walletInfoContainer}>
                  <View style={styles.walletLabelContainer}>
                    <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                      {chain.network}
                    </TextV3.CaptionStrong>
                  </View>
                  {renderCheckIcon(chain.id, currentNetwork)}
                </View>
              </View>
            </TouchableOpacity>
          )
        })
      }
      <View style={styles.privateKeysContainer}>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100} extraStyles={styles.subtitle}>
          Testnets
        </TextV3.Caption>
        {
          ALL_TESTNETS_CHAINS.map((chain, i) => {
            const walletStyles = StyleSheet.flatten([
              styles.walletWrapper,
              i === 0 ? styles.firstChild : {},
              i === ALL_TESTNETS_CHAINS.length - 1 ? styles.lastChild : {},
            ]);

            return (
              <TouchableOpacity key={i} onPress={() => handleSwitchActiveNetwork(chain.id)}>
                <View style={walletStyles}>
                  <View style={styles.assetIconWrapper}>
                    <Image source={{ uri: chain.logo }} style={styles.assetIcon} />
                  </View>
                  <View testID={chain.id} style={styles.walletInfoContainer}>
                    <View style={styles.walletLabelContainer}>
                      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
                        {chain.label}
                      </TextV3.CaptionStrong>
                    </View>
                    {renderCheckIcon(chain.id, currentNetwork)}
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </View>
    </ScrollView>
  );
};

export default NetworksModal;
