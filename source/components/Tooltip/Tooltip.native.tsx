import React, { FC, ReactElement } from 'react';
import { Tooltip, Text } from 'react-native-elements';
import { View } from 'react-native';

import styles from './styles';

interface ITooltip {
  arrow?: boolean;
  children: ReactElement;
  body: ReactElement | string;
  title: string | ReactElement;
}

const TooltipComponent: FC<ITooltip> = ({ body, arrow = true, children }) => {
  const pointerStyle = arrow ? styles.arrow : {};

  const tooltipBody =
    typeof body === 'string' ? (
      <Text>{body}</Text>
    ) : (
      React.cloneElement(body, { style: styles.tooltip })
    );

  return (
    <View style={styles.container}>
      <Tooltip
        containerStyle={styles.tooltipContainer}
        popover={<Text style={{ color: 'white' }}>Hellooooo</Text>}
        withPointer={arrow}
        pointerStyle={pointerStyle}
      >
        {children}
      </Tooltip>
    </View>
  );
};

export default TooltipComponent;
