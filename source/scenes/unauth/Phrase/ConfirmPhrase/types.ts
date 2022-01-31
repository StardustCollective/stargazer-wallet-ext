export default interface IConfirmPhrase {
  title: string;
  isNotEqualArrays: boolean;
  passed: boolean;
  orgList: Array<string>;
  newList: Array<string>;
  checkList: Array<boolean>;
  handleOrgPhrase: (idx: number) => void;
  handleNewPhrase: (idx: number) => void;
  handleConfirm: () => void;
}