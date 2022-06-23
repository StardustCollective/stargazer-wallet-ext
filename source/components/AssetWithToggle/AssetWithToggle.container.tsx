///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react'

///////////////////////
// Types
///////////////////////

import IAssetWithToggle from './types';

///////////////////////
// Scene
///////////////////////

import AssetWithToggle from './AssetWithToggle';

///////////////////////
// Container
///////////////////////

const AssetWithToggleContainer: FC<IAssetWithToggle> = ({ id, symbol, logo, label, selected, toggleItem }) => {

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <AssetWithToggle
      id={id}
      symbol={symbol}
      logo={logo}
      label={label}
      selected={selected}
      toggleItem={toggleItem}
    />
  )

}

export default AssetWithToggleContainer;