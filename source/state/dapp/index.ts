import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDAppState, IDAppInfo } from './types';

const initialState: IDAppState = {
  listening: {},
  whitelist: {}
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const DAppState = createSlice({
  name: 'dapp',
  initialState,
  reducers: {
    registerListeningSite(
      state: IDAppState,
      action: PayloadAction<{ origin: string, eventName: string }>
    ) {
      const { origin, eventName } = action.payload;

      const originState = state.listening.hasOwnProperty(origin) ? state.listening[origin].filter((val: string) => val !== eventName) : [];

      return {
        ...state,
        listening: {
          ...state.listening,
          [origin]: [
            ...originState,
            eventName
          ]
        }
      };
    },
    deregisterListeningSite(
      state: IDAppState,
      action: PayloadAction<{ origin: string, eventName: string }>
    ) {
      const { origin, eventName } = action.payload;

      if (!state.listening.hasOwnProperty(origin)) {
        return state;
      }

      const originState = state.listening[origin].filter((val: string) => val !== eventName);

      const retState = {
        ...state,
        listening: {
          ...state.listening,
          [origin]: originState
        }
      };

      if (originState.length === 0) {
        delete retState.listening[origin];
      }

      return retState;
    },
    listNewDapp(
      state: IDAppState,
      action: PayloadAction<{
        id: string;
        dapp: IDAppInfo;
        network: string;
        accounts: string[];
      }>
    ) {
      const {
        dapp,
        network,
        accounts
      } = action.payload;

      const id = action.payload.id.replace(/(^\w+:|^)\/\//, '');

      // Append to accounts if a network already exists
      let accountsByNetwork = {};
      if (state.whitelist[id]) {
        accountsByNetwork = {
          ...state.whitelist[id].accounts
        }
      }

      return {
        ...state,
        whitelist: {
          ...state.whitelist,
          [id]: {
            id,
            ...dapp,
            accounts: {
              ...accountsByNetwork,
              [network]: [
                ...accounts
              ]
            }
          }
        },
      };
    },
    unlistDapp(state: IDAppState, action: PayloadAction<{ id: string }>) {
      console.log('Unlist App ID: ' + action.payload.id);
      delete state.whitelist[action.payload.id];
      delete state.listening[action.payload.id];
    },

  },
});

export const { listNewDapp, unlistDapp, registerListeningSite, deregisterListeningSite } = DAppState.actions;

export default DAppState.reducer;
