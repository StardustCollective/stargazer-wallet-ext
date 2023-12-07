import React, { FC, ReactElement, ReactNode, ChangeEvent, useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import styles from './styles';

interface IOption {
  // key => value of Option
  // value => label of Option
  [key: string]: string;
}

interface ISelect {
  id?: string;
  options: Array<IOption>;
  value?: unknown;
  input?: ReactElement;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  extraProps: object;
}

const Select: FC<ISelect> = ({
  id,
  options,
  value,
  onChange,
  disabled = false,
  extraProps = {},
}) => {
  const _options = options.map((option) => {
    const optionValue = Object.keys(option)[0];
    const label = option[optionValue];
    return {
      label,
      value: optionValue,
    };
  });

  const [open, setOpen] = useState(false);
  const [_value, setValue] = useState(value);
  const [items, setItems] = useState(_options);

  return (
    <View style={styles.wrapper}>
      <DropDownPicker
        testID={id}
        value={_value}
        open={open}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={(value) => onChange(value)}
        disabled={disabled}
        bottomOffset={100}
        style={styles.wrapper}
        textStyle={styles.text}
        /**
         * avoid using borderColor, backgroundColor in containerStyle
         */
        dropDownContainerStyle={styles.dropDownBox}
        showTickIcon={false}
        selectedItemContainerStyle={styles.selectItem}
        listItemContainerStyle={styles.itemContainer}
        listItemLabelStyle={styles.itemLabel}
        arrowIconStyle={styles.arrowIcon}
        {...extraProps}
      />
    </View>
  );
};

export default Select;
