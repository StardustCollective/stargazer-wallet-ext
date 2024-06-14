//////////////////////
// Modules Imports
/////////////////////

import React from 'react';

//////////////////////
// Navigation
/////////////////////

import { useLinkTo, useNavigation } from '@react-navigation/native';
import navigationUtil from 'navigation/util';
import screens from 'navigation/screens';

//////////////////////
// Common Scenes
/////////////////////

import Login from 'scenes/common/Login';
import { isNative } from 'utils/envUtil';

//////////////////////
// Component
/////////////////////

const Starter = () => {
  //////////////////////
  // Hooks
  /////////////////////

  const linkTo = useLinkTo();
  const navigation = useNavigation();

  //////////////////////
  // Callbacks
  /////////////////////

  const onLoginSuccess = (res: boolean) => {
    if (res && isNative) {
      // We only need to navigate on Mobile
      navigationUtil.replace(navigation, screens.authorized.root);
    }
  };

  const onImportClicked = () => {
    linkTo('/import');
  };

  //////////////////////
  // Renders
  /////////////////////

  return <Login onLoginSuccess={onLoginSuccess} onImportClicked={onImportClicked} />;
};

export default Starter;
