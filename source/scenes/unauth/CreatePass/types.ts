import { Ref, BaseSyntheticEvent} from 'react';
import { 
  NestDataObject, 
  FieldElement, 
  FieldValues, 
  FieldError 
} from 'react-hook-form';

export default interface ICreatePass {
  onSubmit: (data: any) => void;
  handleSubmit: BaseSyntheticEvent<object, any, any>;
  nextHandler: () => void;
  passed: boolean;
  register: Ref<any>;
  errors: NestDataObject<FieldValues, FieldError>;
  comment: string;
  title: string
}
