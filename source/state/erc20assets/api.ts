import { createAsyncThunk } from "@reduxjs/toolkit";
import { ERC20_TOKENS_API, ERC20_TOKENS_WITH_ADDRESS_API } from "constants/index";
import { IAssetInfoState } from "state/assets/types";
import { ERC20Asset, ERC20AssetWithAddress } from "./types";
import { mapToAssetsArray } from "./utils";

export const getERC20Assets = createAsyncThunk(
  'assets/getERC20Assets',
  async (): Promise<IAssetInfoState[]> => {
    const tokens = await fetch(ERC20_TOKENS_API);
    const tokensWithAddress = await fetch(ERC20_TOKENS_WITH_ADDRESS_API);
    const tokensJson: ERC20Asset[] = await tokens.json();
    const tokensWithAddressJson: ERC20AssetWithAddress[]  = await tokensWithAddress.json();
    return mapToAssetsArray(tokensJson, tokensWithAddressJson);
  }
);