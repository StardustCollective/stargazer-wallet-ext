//////////////////////
// Modules Imports
/////////////////////

import React from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';

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

  const history = useHistory();
  const { route } = queryString.parse(location.search);

  //////////////////////
  // Callbacks
  /////////////////////

  const onLoginSuccess = (res: boolean) => {
    console.log('onLoginSuccess Calledd');
    if (res) {
      let nextRoute = `/${route}?${location.search}`;
      history.push(nextRoute);
    }
  };

  //////////////////////
  // Renders
  /////////////////////

  return <Login onLoginSuccess={onLoginSuccess} />;
};

export default Starter;
