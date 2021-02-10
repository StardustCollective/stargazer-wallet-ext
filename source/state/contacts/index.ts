import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IContactBookState from './types';

const initialState: IContactBookState = {};

// createSlice comes with immer produce so we don't need to take care of immutational update
const ContactBookState = createSlice({
  name: 'price',
  initialState,
  reducers: {
    addContact(
      state: IContactBookState,
      action: PayloadAction<{ name: string; address: string; memo: string }>
    ) {
      state = {
        ...state,
        [action.payload.address]: {
          id: action.payload.address,
          name: action.payload.name,
          address: action.payload.address,
          memo: action.payload.memo,
        },
      };
    },
  },
});

export const { addContact } = ContactBookState.actions;

export default ContactBookState.reducer;
