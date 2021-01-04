import React, { FC, ReactElement, ReactNode, ChangeEvent } from 'react';
import MUISelect from '@material-ui/core/Select';
import MUIMenuItem from '@material-ui/core/MenuItem';

interface IOption {
  // key => value of Option
  // value => label of Option
  [key: string]: string;
}

interface ISelect {
  options: Array<IOption>;
  value?: unknown;
  input?: ReactElement;
  onChange?: (
    event: ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
    child: ReactNode
  ) => void;
}

const Select: FC<ISelect> = ({ options, value, input, onChange }) => {
  return (
    <MUISelect value={value} input={input} onChange={onChange}>
      {options.map((option: IOption) => {
        const value = Object.keys(option)[0];
        const label = option[value];
        return (
          <MUIMenuItem key={value} value={value}>
            {label}
          </MUIMenuItem>
        );
      })}
    </MUISelect>
  );
};

export default Select;
