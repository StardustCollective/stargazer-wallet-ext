export type IMenuItem = {
  title: string;
  subtitle?: string;
  icon?: string | JSX.Element;
  iconSize?: number;
  onClick: (data?: any) => void;
  data?: any;
  disabled?: boolean;
  labelRight?: string;
  labelRightStyles?: any;
  titleStyles?: any;
  subtitleStyles?: any;
  showArrow?: boolean;
  rightIcon?: any;
  rightIconContainerStyle?: any;
  selected?: boolean;
  containerStyle?: any;
  iconContainerStyle?: any;
};

export default interface IMenu {
  items: IMenuItem[];
  title?: string;
  titleStyles?: any;
  containerStyle?: any;
}
