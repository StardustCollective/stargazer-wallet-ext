/**
 * @format
 */

import './shim';
import "@ethersproject/shims"
import { AppRegistry , Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

Text.defaultProps = {};
Text.defaultProps.maxFontSizeMultiplier = 1.2;

TextInput.defaultProps = {};
TextInput.defaultProps.maxFontSizeMultiplier = 1.2;

AppRegistry.registerComponent(appName, () => App);
