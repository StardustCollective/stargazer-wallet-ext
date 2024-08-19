import { KeyringNetwork, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { DAG_NETWORK } from 'constants/index';
import store from 'state/store';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { dag4 } from '@stardust-collective/dag4';
import { decodeFromBase64, encodeToBase64 } from 'utils/encoding';
import { WatchAssetParameters } from '../methods/wallet_watchAsset';
import { toDag } from 'utils/number';

const LEDGER_URL = '/ledger.html';
const BITFI_URL = '/bitfi.html';
export const EXTERNAL_URL = '/external.html';
export const WINDOW_TYPES: Record<string, chrome.windows.createTypeEnum> = {
  popup: 'popup',
  normal: 'normal',
};
export const WINDOW_SIZE = {
  small: { width: 372, height: 600 },
  large: { width: 600, height: 1000 },
};

export type StargazerSignatureRequest = {
  content: string;
  metadata: Record<string, any>;
};

export const getWalletInfo = () => {
  const { vault } = store.getState();
  let windowUrl = EXTERNAL_URL;
  let deviceId = '';
  let bipIndex;
  const allWallets = [
    ...vault.wallets.local,
    ...vault.wallets.ledger,
    ...vault.wallets.bitfi,
  ];
  const activeWallet = vault?.activeWallet
    ? allWallets.find(
        (wallet: any) =>
          wallet.id === vault.activeWallet.id || vault.activeWallet.label === wallet.label
      )
    : null;
  const isLedger = activeWallet?.type === KeyringWalletType.LedgerAccountWallet;
  const isBitfi = activeWallet?.type === KeyringWalletType.BitfiAccountWallet;
  const isHardware = isLedger || isBitfi;

  if (isLedger) {
    windowUrl = LEDGER_URL;
    bipIndex = activeWallet?.bipIndex;
  } else if (isBitfi) {
    windowUrl = BITFI_URL;
    deviceId = activeWallet?.accounts[0].deviceId;
  }
  const windowType = isHardware ? WINDOW_TYPES.normal : WINDOW_TYPES.popup;
  const windowSize = isHardware ? WINDOW_SIZE.large : WINDOW_SIZE.small;

  return { activeWallet, windowUrl, windowType, windowSize, deviceId, bipIndex };
};

export const getNetwork = (): string => {
  const { activeNetwork }: IVaultState = store.getState().vault;

  return activeNetwork[KeyringNetwork.Constellation];
};

export const getChainId = (): number => {
  const networkName = getNetwork();

  return DAG_NETWORK[networkName].chainId;
};

export const getChainLabel = () => {
  const networkName = getNetwork();
  const chainId = getChainId();
  const network = DAG_NETWORK[networkName].network;
  const label = DAG_NETWORK[networkName].label;
  const extraLabel = chainId !== 1 ? ` ${label}` : '';

  return `${network}${extraLabel}`;
};

export const validateMetagraphAddress = (address: unknown): IAssetState => {
  const { vault, assets } = store.getState();
  const { activeNetwork } = vault;

  if (!address) {
    throw new Error("'metagraphAddress' is required");
  }

  if (typeof address !== 'string') {
    throw new Error("Bad argument 'metagraphAddress'");
  }

  if (!dag4.account.validateDagAddress(address)) {
    throw new Error("Invaid address 'metagraphAddress'");
  }

  const metagraphToken = vault?.activeWallet?.assets?.find(
    (asset) =>
      asset.contractAddress === address &&
      activeNetwork.Constellation === assets[asset?.id]?.network
  );

  if (!metagraphToken) {
    throw new Error("'metagraphAddress' not found in wallet");
  }

  return metagraphToken;
};

export const normalizeSignatureRequest = (encodedSignatureRequest: string): string => {
  let signatureRequest: StargazerSignatureRequest;
  try {
    const stringSignatureDecoded = decodeFromBase64(encodedSignatureRequest);
    signatureRequest = JSON.parse(stringSignatureDecoded);
  } catch (e) {
    throw new Error('Unable to decode signatureRequest');
  }

  const test =
    typeof signatureRequest === 'object' &&
    signatureRequest !== null &&
    typeof signatureRequest.content === 'string' &&
    typeof signatureRequest.metadata === 'object' &&
    signatureRequest.metadata !== null;

  if (!test) {
    throw new Error('SignatureRequest does not match spec');
  }

  const parsedMetadata: Record<string, any> = {};
  for (const [key, value] of Object.entries(signatureRequest.metadata)) {
    if (['boolean', 'number', 'string'].includes(typeof value) || value === null) {
      parsedMetadata[key] = value;
    }
  }

  signatureRequest.metadata = parsedMetadata;

  const stringSignature = JSON.stringify(signatureRequest);
  const newEncodedSignatureRequest = encodeToBase64(stringSignature);

  if (newEncodedSignatureRequest !== encodedSignatureRequest) {
    throw new Error('SignatureRequest does not match spec (unable to re-normalize)');
  }

  return newEncodedSignatureRequest;
};

export const getAssetByType = (type: AssetType): IAssetState => {
  const { activeAsset, activeWallet }: IVaultState = store.getState().vault;

  let stargazerAsset: IAssetState = activeAsset as IAssetState;

  if (!activeAsset || activeAsset.type !== type) {
    stargazerAsset = activeWallet.assets.find((a) => a.type === type);
  }

  return stargazerAsset;
};

export const getAssetByContractAddress = (address: string): IAssetState => {
  const { activeAsset, activeWallet }: IVaultState = store.getState().vault;

  let metagraphAsset: IAssetState = activeAsset as IAssetState;

  if (!activeAsset || activeAsset?.contractAddress !== address) {
    metagraphAsset = activeWallet.assets.find((a) => a?.contractAddress === address);
  }

  return metagraphAsset;
};

export const fetchMetagraphBalance = async (
  url: string,
  metagraphAddress: string,
  dagAddress: string
): Promise<number> => {
  const responseJson = await (
    await fetch(`${url}/currency/${metagraphAddress}/addresses/${dagAddress}/balance`)
  ).json();
  const balance = responseJson?.data?.balance ?? 0;
  const balanceNumber = toDag(balance);

  return balanceNumber;
};

export const checkArguments = (
  args: { type: string; value: any; name: string }[]
): void => {
  if (args.length) {
    for (const arg of args) {
      if (!arg.value) {
        throw new Error(`Argument "${arg.name}" is required`);
      }

      if (typeof arg.value !== arg.type) {
        throw new Error(`Bad argument "${arg.name}" -> not a "${arg.type}"`);
      }
    }
  }
};

export const isValidMetagraphAddress = async (
  address: string,
  chainId?: string
): Promise<boolean> => {
  if (!dag4.account.validateDagAddress(address)) return false;

  const { activeNetwork }: IVaultState = store.getState().vault;
  const activeChain = chainId || activeNetwork[KeyringNetwork.Constellation];
  const BE_URL = DAG_NETWORK[activeChain].config.beUrl;
  const response: any = await (
    await fetch(`${BE_URL}/currency/${address}/snapshots/latest`)
  ).json();
  return !!response?.data?.hash;
};

export const checkWatchAssetParams = async ({
  type,
  options,
}: WatchAssetParameters): Promise<void> => {
  const { chainId, address, l0, l1, name, symbol, logo } = options;
  const SUPPORTED_TYPES = ['L0'];
  const SUPPORTED_CHAINS = Object.values(DAG_NETWORK).map((network) => network.chainId);
  const args = [
    { type: 'string', value: type, name: 'type' },
    { type: 'number', value: chainId, name: 'chainId' },
    { type: 'string', value: address, name: 'address' },
    { type: 'string', value: l0, name: 'l0' },
    { type: 'string', value: l1, name: 'l1' },
    { type: 'string', value: name, name: 'name' },
    { type: 'string', value: symbol, name: 'symbol' },
    { type: 'string', value: logo, name: 'logo' },
  ];

  checkArguments(args);

  const isValidType = SUPPORTED_TYPES.includes(type);
  const isValidChainId = SUPPORTED_CHAINS.includes(chainId);
  const isValidAddress = dag4.account.validateDagAddress(address);

  if (!isValidType) {
    throw new Error('Argument "type" is not supported');
  }

  if (!isValidChainId) {
    throw new Error('Argument "chainId" is not supported');
  }

  const selectedNetwork = Object.values(DAG_NETWORK).find(
    (network) => network.chainId === chainId
  );
  const isValidMetagraph = await isValidMetagraphAddress(address, selectedNetwork.id);

  if (!isValidAddress) {
    throw new Error('Argument "address" is invalid -> not a DAG address');
  }

  if (!isValidMetagraph) {
    throw new Error('Argument "address" or "chainId" are invalid -> metagraph not found');
  }
};
