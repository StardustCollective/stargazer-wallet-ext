import { Ref, BaseSyntheticEvent } from 'react';

export default interface IImportPhrase {
  handleSubmit: () => void;//BaseSyntheticEvent<object, any, any>;
  register: Ref<any>;
  onSubmit: (data: any) => void;
  isInvalid: boolean;
  isDisabled: boolean;
  control: any;
}
