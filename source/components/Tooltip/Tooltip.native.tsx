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
}

const TooltipComponent: FC<ITooltip> = ({
  body,
  arrow = true,
  children,
  width = 150,
  backgroundColor = COLORS.gray_dark,
  visible,
}) => {
  const pointerStyle = arrow ? styles.arrow : {};

  const tooltipBody =
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

  console.log('visible in tooltip', visible);
  return (
    <View style={styles.container}>
      <Tooltip
        width={width}
        containerStyle={styles.tooltipContainer}
        popover={tooltipBody}
        withPointer={arrow}
        backgroundColor={backgroundColor}
        {...otherProps}
      >
        {children}
      </Tooltip>
    </View>
  );
};

export default TooltipComponent;
