import { createAsyncThunk } from "@reduxjs/toolkit";
import { ERC20_TOKENS_API, ERC20_TOKENS_WITH_ADDRESS_API } from "constants/index";
import { ERC20Asset, ERC20AssetWithAddress } from "./types";

export const getERC20Assets = createAsyncThunk(
  'assets/getERC20Assets',
  async (): Promise<ERC20Asset[]> => {
    const response = await fetch(ERC20_TOKENS_API);
    return response.json();
  }
);

export const getERC20AssetsWithAddress = createAsyncThunk(
  'assets/getERC20AssetsWithAddress',
  async (): Promise<ERC20AssetWithAddress[]> => {
    const response = await fetch(ERC20_TOKENS_WITH_ADDRESS_API);
    return response.json();
  }
);
