import { v4 as uuid } from 'uuid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IContactBookState from './types';

const initialState: IContactBookState = {};

// createSlice comes with immer produce so we don't need to take care of immutational update
const ContactBookState = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    rehydrate(state: IContactBookState, action: PayloadAction<IContactBookState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    addContactAddress(
      state: IContactBookState,
      action: PayloadAction<{ name: string; address: string; memo: string }>
    ) {
      if (
        Object.values(state).filter((option) => option.address === action.payload.address)
          .length
      ) {
        return undefined;
      }
      const id = uuid();
      return {
        ...state,
        [id]: {
          id,
          name: action.payload.name,
          address: action.payload.address,
          memo: action.payload.memo,
        },
      };
    },
    updateContactAddress(
      state: IContactBookState,
      action: PayloadAction<{
        id: string;
        name: string;
        address: string;
        memo: string;
      }>
    ) {
      const res = Object.values(state).filter(
        (option) =>
          option.address === action.payload.address || option.name === action.payload.name
      );
      if (!state[action.payload.id] || (res.length && res[0].id !== action.payload.id)) {
        return undefined;
      }
      return {
        ...state,
        [action.payload.id]: {
          id: action.payload.id,
          name: action.payload.name,
          address: action.payload.address,
          memo: action.payload.memo,
        },
      };
    },
    deleteContactAddress(
      state: IContactBookState,
      action: PayloadAction<{ id: string }>
    ) {
      delete state[action.payload.id];
    },
  },
});

export const {
  addContactAddress,
  updateContactAddress,
  deleteContactAddress,
  rehydrate,
} = ContactBookState.actions;

export default ContactBookState.reducer;
