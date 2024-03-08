import { Ref } from 'react';
import { Control, FieldValues, OnSubmit, ValidationOptions } from 'react-hook-form';

export interface IEnterPassword {
  control: Control<FieldValues>;
  register: (options: ValidationOptions) => Ref<any>;
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  handleOnCancel: () => void;
  handleOnSubmit: (data: any) => void;
  isSubmitDisabled: boolean;
  isRemoveWallet: boolean;
  errors: any;
}
