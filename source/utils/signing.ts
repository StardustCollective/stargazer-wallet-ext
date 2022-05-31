
export interface ISignature {
  key: string;
  token: string;
}

export const verifySignature = (signature: ISignature): boolean => {
  // This function should return true if the signature is valid, otherwise false.
  console.log(signature);
  return true;
};