//////////////////////
// Modules Imports
/////////////////////

import React from 'react';

//////////////////////
// Navigation
/////////////////////

import { useLinkTo } from '@react-navigation/native';

//////////////////////
// Common Scenes
/////////////////////

import Login from 'scenes/common/Login';

//////////////////////
// Component
/////////////////////

const Starter = () => {
  //////////////////////
  // Hooks
  /////////////////////

  const linkTo = useLinkTo();

  //////////////////////
  // Callbacks
  /////////////////////

  const onLoginSuccess = (res: boolean) => {
    if (res) {
      // TODO: test on Mobile
      console.log('onLoginSuccess - NOOP');
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
