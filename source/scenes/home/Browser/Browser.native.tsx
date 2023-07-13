///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

///////////////////////////
// Components
///////////////////////////

///////////////////////////
// Types
///////////////////////////

import { IBrowser } from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { test } from './injectedScript';

///////////////////////////
// Constants
///////////////////////////

const Browser: FC<IBrowser> = () => {
  ///////////////////////////
  // Render
  ///////////////////////////=

  // const customJs = `
  //   window.stargazer = 'testing value';
  //   console.log(window.stargazer);
  //   window.ReactNativeWebView.postMessage(window.stargazer)
  // `;

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.content}>
        <WebView
          source={{ uri: 'https://lattice.is' }}
          injectedJavaScript={test}
          onMessage={(message) => console.log('onMessage', message.nativeEvent.data)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        />
      </View>
    </View>
  );
};

export default Browser;
