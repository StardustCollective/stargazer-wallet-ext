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

const ApproveSpend = () => {

  //////////////////////
  // Hooks
  ///////////////////// 

  const history = useHistory();
  const { route } = queryString.parse(location.search);

  //////////////////////
  // Callbacks
  ///////////////////// 

  //////////////////////
  // Renders
  ///////////////////// 

  return (
    <>
      <div>
        Spprive Spend
      </div>
    </>
  );
};

export default ApproveSpend;
