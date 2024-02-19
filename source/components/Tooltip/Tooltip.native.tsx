import React, { FC, ReactElement, useRef, useEffect } from 'react';
import { Tooltip } from 'react-native-elements';
import TextV3 from 'components/TextV3';

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
  backgroundColor = COLORS.black,
  visible = true,
  onOpen,
  ...others
}) => {
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        tooltipRef?.current?.toggleTooltip();
      }, 500);
    }
  }, [visible]);

  const tooltipBody: JSX.Element =
    typeof body === 'string' ? (
      <TextV3.CaptionStrong>{body}</TextV3.CaptionStrong>
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
    <Tooltip
      ref={tooltipRef}
      width={width}
      containerStyle={styles.container}
      popover={tooltipBody}
      withPointer={arrow}
      backgroundColor={backgroundColor}
      overlayColor="transparent"
      onOpen={onOpen}
      {...otherProps}
      {...others}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipComponent;
