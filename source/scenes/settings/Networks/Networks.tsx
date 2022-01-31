import React, { FC, ChangeEvent } from 'react';

import Select from 'components/Select';
import styles from './Networks.scss';

import INetworkSettings from './types';

const Networks: FC<INetworkSettings> = ({ networkOptions }) => {
  return (
    <div className={styles.wrapper}>
      {networkOptions.map((network) => {
        return (
          <>
            <label>{network.label}</label>
            <Select 
              fullWidth
              value={network.value} 
              onChange={(ev: ChangeEvent<{
                    name?: string | undefined;
                    value: unknown;
                  }>
                ) => {
                network.onChange(ev.target.value as string);
              }} 
              options={network.options}
              />
          </>
        );
      })}
    </div>
  );
};

export default Networks;
