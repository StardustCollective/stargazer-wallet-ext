import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISearchCurrency, ISearchResponse } from "./types";

export const getCurrencyData = createAsyncThunk(
  'swapping/getCurrencyData',
  async ( query: string ): Promise<ISearchResponse> => {
    const response = await fetch(`https://exolix.com/api/v2/currencies?withNetworks=true&search=${query}`);
    return response.json();
  }
);