export default interface IImportPhrase {
  title: string;
  buttonTitle: string;
  modalDescription: string;
  isDisabled: boolean;
  isLoading: boolean;
  isModalLoading: boolean;
  showPhraseModal: boolean;
  phraseOptions: any;
  phraseValues: string[];
  showPasswordArray: boolean[];
  isCheckboxActive: boolean;
  onSubmit: (data: any) => void;
  handleInputChange: (text: string, index: number) => void;
  togglePassword: (index: number) => void;
  toggleCheckbox: () => void;
  closePhraseModal: () => void;
  onSubmitConfirm: (phrase: string[]) => void;
}
