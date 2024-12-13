import React, { FC } from 'react';

interface SvgIconProps {
  name: string;
  color?: string;
  height?: number;
  width?: number;
}

const SvgIcon: FC<SvgIconProps> = ({
  name,
  color = 'currentColor',
  height,
  width,
  ...props
}) => {
  const Icon = require(`assets/images/svg/${name}.svg`).default;
  return <Icon fill={color} height={height} width={width} {...props} />;
};

export default SvgIcon;
