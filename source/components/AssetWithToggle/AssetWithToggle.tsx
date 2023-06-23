///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import Card from 'components/Card';
import TextV3 from 'components/TextV3';
import Switch from '@material-ui/core/Switch';

///////////////////////
// Enums
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////
// Types
///////////////////////

import IAssetWithToggle from './types';

///////////////////////
// Styles
///////////////////////

import styles from './AssetWithToggle.scss';

///////////////////////
// Component
///////////////////////

const AssetWithToggle: FC<IAssetWithToggle> = ({ id, symbol, network, logo, selected, disabled = false, toggleItem }: IAssetWithToggle) => {

  const iconStyle = logo?.includes('constellation') ? styles.dagIcon : styles.imageIcon;

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <Card id={`AssetWithToggle-${id}-${network}`} disabled style={styles.cardContainer}>
      <div className={styles.container}>
        <div className={styles.assetIcon}>
          <img className={iconStyle} src={logo} />
        </div>
        <div className={styles.assetInfo}>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{symbol}</TextV3.CaptionStrong>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{!!network && `${network}`}</TextV3.Caption>
        </div>
        <div className={styles.toggleContainer}>
          <Switch
            disabled={disabled}
            checked={selected}
            color={disabled ? 'secondary' : 'primary'}
            onChange={(ev: any) => toggleItem(ev.target.checked)}
          />
        </div>
      </div>
    </Card>
  );
};

export default AssetWithToggle;
