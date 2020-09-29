import { createReducer } from '@reduxjs/toolkit';

const initialState = {};

// create reducer comes with immer produce so we don't need to take care of immutational update
const authReducer = createReducer(initialState, {});

export default authReducer;
