///////////////////////////
// Modules
///////////////////////////

import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import EntryScriptWeb3 from 'source/native/EntryScriptWeb3.js';

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

///////////////////////////
// Constants
///////////////////////////

const Browser: FC<IBrowser> = () => {
  ///////////////////////////
  // Render
  ///////////////////////////

  const [entryScriptWeb3, setEntryScriptWeb3] = useState('');

  // const customJs = `
  //   window.stargazer = 'testing value';
  //   console.log(window.stargazer);
  //   window.ReactNativeWebView.postMessage(window.stargazer)
  // `;

  useEffect(() => {
    const getEntryScriptWeb3 = async () => {
      const entryScriptWeb3 = await EntryScriptWeb3.get();
      setEntryScriptWeb3(entryScriptWeb3);
    };

    getEntryScriptWeb3();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.content}>
        <WebView
          source={{ uri: 'https://lattice.is' }}
          injectedJavaScript={entryScriptWeb3}
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
