import React, { FC, ReactElement, ReactNode, ChangeEvent } from 'react';
import MUISelect from '@material-ui/core/Select';
import MUIMenuItem from '@material-ui/core/MenuItem';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import styles from './Select.scss';
import { IOption } from './types';

interface ISelect {
  id?: string;
  options: Array<IOption>;
  value?: unknown;
  input?: ReactElement;
  fullWidth?: boolean;
  onChange?: (
    event: ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: ReactNode
  ) => void;
  disabled?: boolean;
}

const Select: FC<ISelect> = ({
  id,
  options,
  value,
  input,
  fullWidth,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={styles.select}>
      <MUISelect
        id={id}
        value={value}
        input={input}
        disabled={disabled}
        onChange={onChange}
        fullWidth={fullWidth}
        IconComponent={ArrowDownIcon}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        }}
      >
        {options.map((option: IOption) => {
          const val = Object.keys(option)[0];
          const label = option[val];
          return (
            <MUIMenuItem key={val} value={val}>
              {label}
            </MUIMenuItem>
          );
        })}
      </MUISelect>
    </div>
  );
};

export default Select;
