export type IMenuItem = {
  title: string;
  subtitle?: string;
  icon?: string | JSX.Element;
  onClick: (data?: any) => void;
  data?: any;
  disabled?: boolean;
  labelRight?: string;
  labelRightStyles?: any;
  titleStyles?: any;
  subtitleStyles?: any;
  showArrow?: boolean;
  rightIcon?: any;
  selected?: boolean;
};

export default interface IMenu {
  items: IMenuItem[];
  title?: string;
  titleStyles?: any;
  containerStyle?: any;
}
