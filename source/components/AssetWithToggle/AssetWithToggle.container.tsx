///////////////////////
// Modules
///////////////////////

import React, { FC, memo } from 'react';

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

const AssetWithToggleContainer: FC<IAssetWithToggle> = ({
  id,
  symbol,
  networkLogo,
  networkLabel,
  logo,
  label,
  selected,
  disabled,
  toggleItem,
}) => {
  ///////////////////////
  // Render
  ///////////////////////

  return (
    <AssetWithToggle
      id={id}
      symbol={symbol}
      networkLogo={networkLogo}
      networkLabel={networkLabel}
      logo={logo}
      label={label}
      selected={selected}
      disabled={disabled}
      toggleItem={toggleItem}
    />
  );
};

export default memo(AssetWithToggleContainer);
