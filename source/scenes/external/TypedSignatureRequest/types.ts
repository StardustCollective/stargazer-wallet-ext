type EIP712Domain = {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract?: string;
  salt?: string;
};

type TypedProperty = {
  name: string;
  type: string;
};

export type MessagePayload = {
  domain: EIP712Domain;
  types: { EIP712Domain: EIP712Domain } & Record<string, TypedProperty[]>;
  primaryType: string;
  message: any;
};

export interface ISignTypedDataParams {
  payload: string;
  cypherockId: string;
}
