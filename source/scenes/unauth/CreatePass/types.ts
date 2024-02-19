import { Ref } from 'react';
import { NestDataObject, FieldValues, FieldError } from 'react-hook-form';

export default interface ICreatePass {
  onSubmit: (data: any) => void;
  control: any;
  handleSubmit: any;
  nextHandler: () => void;
  passed: boolean;
  register: Ref<any>;
  errors: NestDataObject<FieldValues, FieldError>;
  comment: string;
  title: string;
}
