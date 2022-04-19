import { Ref } from 'react';

export default interface IImportPhrase {
  handleSubmit: any;
  register: Ref<any>;
  onSubmit: (data: any) => void;
  isInvalid: boolean;
  isDisabled: boolean;
  control: any;
}
