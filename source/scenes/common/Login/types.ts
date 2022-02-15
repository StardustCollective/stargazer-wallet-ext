import { Ref} from 'react';
import { 
  NestDataObject, 
  FieldValues, 
  FieldError,
} from 'react-hook-form';

export default interface ILogin {
  handleSubmit: any;
  control: any;
  onSubmit: (data: any) => void;
  errors: NestDataObject<FieldValues, FieldError>;
  register: Ref<any>;
  isInvalid: boolean;
  importClicked: () => void;
}