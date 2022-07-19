import { IItem } from "scenes/settings/Networks/types";

export type IDropdownOptions = {
  icon: string;
  title: string;
  value: string;
  items: IItem[];
  isOpen: boolean;
  onChange: (value: string) => void;
  toggleItem: () => void;
}

export default interface IDropdown {
  options: IDropdownOptions;
}