import React, { FC } from 'react';
import clsx from 'clsx';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';

import styles from './Icon.scss';

interface IIcon {
  Component: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> | string;
  iconStyles?: string;
  spaced?: boolean;
  variant?: string;
  width?: number;
}

const Icon: FC<IIcon> = ({ Component, spaced = true, variant, width, iconStyles }) => {
  return (
    <div className={clsx(styles.icon, iconStyles, { [styles.spaced]: spaced }, variant)}>
      {typeof Component === 'string' ? (
        <img src={`/${Component}`} width={width} />
      ) : (
        <Component style={{ width }} />
      )}
    </div>
  );
};

export default Icon;
