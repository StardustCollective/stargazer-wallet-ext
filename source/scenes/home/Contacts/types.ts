import IContactBookState, { IContactState } from 'state/contacts/types';

export default interface IWalletContacts {
  open?: boolean;
  onClose?: () => void;
  onChange: (address: string) => void;
  contacts?: IContactBookState;
  isValidContact?: (contact: IContactState) => boolean;
}
