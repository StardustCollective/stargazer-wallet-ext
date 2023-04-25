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
// import { readOnlyProxy } from 'scripts/common';
import { StargazerWalletProvider } from 'scripts/InjectedScript/stargazerWalletProvider';


///////////////////////////
// Constants
///////////////////////////

const Browser: FC<IBrowser> = () => {

  ///////////////////////////
  // Render
  ///////////////////////////
  let provider = null;
  try {
    provider = new StargazerWalletProvider();
  } catch (err) {
    console.log('err', err);
  }
  
  console.log('StargazerWalletProvider', provider)
  const customJs = `
    window.stargazer = new Object();
    window.
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>

      </View>
      <View style={styles.content}>
        <WebView 
          source={{ uri: 'http://localhost:3006/dashboard' }}
          // originWhitelist={['*']}
          useWebView2={true}
          injectedJavaScript={customJs}
          // javaScriptCanOpenWindowsAutomatically={true}
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
