import React, { FC, ReactElement } from 'react';
import { Tooltip, Text } from 'react-native-elements';
import { View } from 'react-native';

import styles from './styles';
import { COLORS } from '../../assets/styles/_variables.native';

interface ITooltip {
  arrow?: boolean;
  children: ReactElement;
  body: ReactElement | string;
  title: string | ReactElement;
  width?: number;
  backgroundColor?: string;
  visible?: Boolean;
  onOpen?: () => void;
}

const TooltipComponent: FC<ITooltip> = ({
  body,
  arrow = true,
  children,
  width = 150,
  backgroundColor = COLORS.gray_dark,
  visible,
  onOpen,
}) => {
  const tooltipBody: JSX.Element =
    typeof body === 'string' ? (
      <Text style={styles.tooltip}>{body}</Text>
    ) : (
      React.cloneElement(body, { style: styles.tooltip })
    );

  let otherProps = {};
  if (visible !== undefined) {
    otherProps = {
      visible,
    };
  }

  return (
    <View style={styles.container}>
      <Tooltip
        width={width}
        containerStyle={styles.container}
        popover={tooltipBody}
        withPointer={arrow}
        backgroundColor={backgroundColor}
        onOpen={onOpen}
        {...otherProps}
      >
        {children}
      </Tooltip>
    </View>
  );
};

export default TooltipComponent;
