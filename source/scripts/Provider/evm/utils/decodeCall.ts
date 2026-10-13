import { BigNumber, ethers } from 'ethers';

const CALL_INTERFACE = new ethers.utils.Interface([
  'function approve(address spender, uint256 amount)',
  'function increaseAllowance(address spender, uint256 addedValue)',
  'function decreaseAllowance(address spender, uint256 subtractedValue)',
  'function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
  'function permit(address holder, address spender, uint256 nonce, uint256 expiry, bool allowed, uint8 v, bytes32 r, bytes32 s)',
  'function setApprovalForAll(address operator, bool approved)',
  'function transferFrom(address from, address to, uint256 amountOrId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
  'function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)',
]);

export type DecodedCall =
  | { method: 'approve' | 'increaseAllowance' | 'decreaseAllowance'; spender: string; amount: BigNumber }
  | { method: 'permit'; variant: 'erc2612'; owner: string; spender: string; value: BigNumber; deadline: BigNumber }
  | { method: 'permit'; variant: 'dai'; owner: string; spender: string; allowed: boolean; expiry: BigNumber }
  | { method: 'setApprovalForAll'; operator: string; approved: boolean }
  | { method: 'transferFrom'; from: string; to: string; amountOrId: BigNumber }
  | { method: 'safeTransferFrom721'; from: string; to: string; tokenId: BigNumber }
  | { method: 'safeTransferFrom1155'; from: string; to: string; ids: BigNumber[]; amounts: BigNumber[] };

/**
 * Decodes the approval and transfer-from calls the signing popup explains.
 * Returns null on an unknown selector or a decode error.
 */
export const decodeCall = (data: string): DecodedCall | null => {
  let call: ethers.utils.TransactionDescription;
  try {
    call = CALL_INTERFACE.parseTransaction({ data });
  } catch {
    return null;
  }

  const { args } = call;

  switch (call.signature) {
    case 'approve(address,uint256)':
      return { method: 'approve', spender: args.spender, amount: args.amount };
    case 'increaseAllowance(address,uint256)':
      return { method: 'increaseAllowance', spender: args.spender, amount: args.addedValue };
    case 'decreaseAllowance(address,uint256)':
      return { method: 'decreaseAllowance', spender: args.spender, amount: args.subtractedValue };
    case 'permit(address,address,uint256,uint256,uint8,bytes32,bytes32)':
      return {
        method: 'permit',
        variant: 'erc2612',
        owner: args.owner,
        spender: args.spender,
        value: args.value,
        deadline: args.deadline,
      };
    case 'permit(address,address,uint256,uint256,bool,uint8,bytes32,bytes32)':
      return {
        method: 'permit',
        variant: 'dai',
        owner: args.holder,
        spender: args.spender,
        allowed: args.allowed,
        expiry: args.expiry,
      };
    case 'setApprovalForAll(address,bool)':
      return { method: 'setApprovalForAll', operator: args.operator, approved: args.approved };
    case 'transferFrom(address,address,uint256)':
      return { method: 'transferFrom', from: args.from, to: args.to, amountOrId: args.amountOrId };
    case 'safeTransferFrom(address,address,uint256)':
    case 'safeTransferFrom(address,address,uint256,bytes)':
      return { method: 'safeTransferFrom721', from: args.from, to: args.to, tokenId: args.tokenId };
    case 'safeTransferFrom(address,address,uint256,uint256,bytes)':
      return { method: 'safeTransferFrom1155', from: args.from, to: args.to, ids: [args.id], amounts: [args.amount] };
    case 'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)':
      // The contract would revert; showing unpaired ids and amounts would mislead.
      if (args.ids.length !== args.amounts.length) return null;
      return {
        method: 'safeTransferFrom1155',
        from: args.from,
        to: args.to,
        ids: [...args.ids],
        amounts: [...args.amounts],
      };
    default:
      return null;
  }
};
