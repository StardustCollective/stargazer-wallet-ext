import type { TokenStandard } from 'scenes/external/SignTransaction/types';

import EVMChainController from 'scripts/Background/controllers/EVMChainController';

const ERC721_INTERFACE_ID = '0x80ac58cd';
const DETECT_TIMEOUT_MS = 5000;

const detect = async (contract: string, chainId: number): Promise<TokenStandard> => {
  const controller = new EVMChainController({ chain: chainId });

  const isErc721 = await controller
    .createERC721Contract(contract)
    .supportsInterface(ERC721_INTERFACE_ID)
    .catch(() => false);
  if (isErc721 === true) return 'erc721';

  await controller.createERC20Contract(contract).decimals();
  return 'erc20';
};

/**
 * Tells ERC-20 from ERC-721 for the selectors they share (approve, transferFrom).
 * Never throws: a revert, an RPC error or no answer within 5 s yields 'unknown'.
 */
export const detectTokenStandard = async (contract: string, chainId: number): Promise<TokenStandard> => {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<TokenStandard>(resolve => {
    timer = setTimeout(() => resolve('unknown'), DETECT_TIMEOUT_MS);
  });

  try {
    return await Promise.race([detect(contract, chainId).catch((): TokenStandard => 'unknown'), timeout]);
  } finally {
    clearTimeout(timer);
  }
};
