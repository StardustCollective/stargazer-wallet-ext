import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { DAG_NETWORK } from 'constants/index';
import store from 'state/store';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { dag4 } from '@stardust-collective/dag4';
import { decodeFromBase64, encodeToBase64 } from 'utils/encoding';
import { WatchAssetParameters } from '../methods/wallet_watchAsset';
import { toDag } from 'utils/number';
import { getAccountController } from 'utils/controllersUtils';
import * as ethers from 'ethers';
import {
  isBitfi,
  isLedger,
  isHardware,
  getHardwareWalletPage,
  isCypherock,
} from 'utils/hardware';

export const EXTERNAL_URL = '/external.html';
export const WINDOW_TYPES: Record<string, chrome.windows.createTypeEnum> = {
  popup: 'popup',
  normal: 'normal',
};
export const WINDOW_SIZE = {
  small: { width: 372, height: 600 },
  large: { width: 1000, height: 1000 },
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
  let cypherockId;
  const allWallets = [
    ...vault.wallets.local,
    ...vault.wallets.ledger,
    ...vault.wallets.bitfi,
    ...vault.wallets.cypherock,
  ];
  const activeWallet = vault?.activeWallet
    ? allWallets.find(
        (wallet: any) =>
          wallet.id === vault.activeWallet.id || vault.activeWallet.label === wallet.label
      )
    : null;

  if (isLedger(activeWallet?.type)) {
    bipIndex = activeWallet?.bipIndex;
  } else if (isBitfi(activeWallet?.type)) {
    deviceId = activeWallet?.accounts[0].deviceId;
  } else if (isCypherock(activeWallet?.type)) {
    cypherockId = activeWallet?.cypherockId;
  }

  const isHardwareWallet = isHardware(activeWallet?.type);

  if (isHardwareWallet) {
    windowUrl = getHardwareWalletPage(activeWallet?.type);
  }

  const windowType = isHardwareWallet ? WINDOW_TYPES.normal : WINDOW_TYPES.popup;
  const windowSize = isHardwareWallet ? WINDOW_SIZE.large : WINDOW_SIZE.small;

  return {
    activeWallet,
    windowUrl,
    windowType,
    windowSize,
    deviceId,
    bipIndex,
    cypherockId,
  };
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

type ArgumentType = string | string[];

type ArgumentCheck = {
  type: ArgumentType;
  value: any;
  name: string;
  optional?: boolean;
  validations?: string[];
};

// Helper function to normalize type to array
const normalizeType = (type: ArgumentType): string[] => {
  return Array.isArray(type) ? type : [type];
};

export const checkArguments = (args: ArgumentCheck[]): void => {
  if (!args.length) return;

  const accountController = getAccountController();

  for (const arg of args) {
    const isUndefined = arg.value === undefined;
    const isNull = arg.value === null;
    const types = normalizeType(arg.type);
    const allowNull = types.includes('null');

    // Handle undefined checks
    if (isUndefined && !arg.optional) {
      throw new Error(`Argument "${arg.name}" is required`);
    }

    // Skip further validations if value is undefined and optional
    if (isUndefined && arg.optional) {
      continue;
    }

    // Handle null checks
    if (isNull) {
      if (!allowNull) {
        throw new Error(`Argument "${arg.name}" cannot be null`);
      }
      continue;
    }

    // Type validation - check if value matches any of the allowed types
    if (!isNull && !isUndefined) {
      const valueType = typeof arg.value;
      const isValidType = types.some((type) => {
        if (type === 'null') return isNull;
        return valueType === type;
      });

      if (!isValidType) {
        if (types.length === 1) {
          throw new Error(
            `Bad argument "${arg.name}" -> expected "${types[0]}", got "${valueType}"`
          );
        }

        throw new Error(
          `Bad argument "${arg.name}" -> expected one of [${types.join(
            ', '
          )}], got "${valueType}"`
        );
      }
    }

    // Skip additional validations if no validations array is provided
    if (!arg.validations?.length) {
      continue;
    }

    // Apply custom validations only if value is not null or undefined
    if (!isNull && !isUndefined) {
      for (const validation of arg.validations) {
        switch (validation) {
          case 'no-empty':
            if (types.includes('string') && !arg.value) {
              throw new Error(`Argument "${arg.name}" must be provided`);
            }
            break;
          case 'no-zero':
            if (types.includes('number') && arg.value === 0) {
              throw new Error(`Argument "${arg.name}" cannot be zero`);
            }
            break;

          case 'positive':
            if (types.includes('number') && arg.value < 0) {
              throw new Error(`Argument "${arg.name}" must be positive`);
            }
            break;

          case 'negative':
            if (types.includes('number') && arg.value > 0) {
              throw new Error(`Argument "${arg.name}" must be negative`);
            }
            break;

          case 'isDagAddress':
            if (
              types.includes('string') &&
              !accountController.isValidDAGAddress(arg.value)
            ) {
              throw new Error(`Argument "${arg.name}" must be a valid DAG address`);
            }
            break;

          case 'isEthAddress':
            if (types.includes('string') && !ethers.utils.isAddress(arg.value)) {
              throw new Error(`Argument "${arg.name}" must be a valid ETH address`);
            }
            break;
        }
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

export const validateNodes = async (
  l0: string,
  cl1: string,
  dl1: string
): Promise<void> => {
  const accountController = getAccountController();

  const isValidL0 = await accountController.isValidNode(l0);

  if (!isValidL0) {
    throw new Error('Argument "l0" is invalid -> node not found');
  }
  if (!!cl1) {
    const isValidcL1 = await accountController.isValidNode(cl1);

    if (!isValidcL1) {
      throw new Error('Argument "cl1" is invalid -> node not found');
    }
  }

  if (!!dl1) {
    const isValiddL1 = await accountController.isValidNode(dl1);

    if (!isValiddL1) {
      throw new Error('Argument "dl1" is invalid -> node not found');
    }
  }
};

export const checkWatchAssetParams = async ({
  type,
  options,
}: WatchAssetParameters): Promise<void> => {
  const { chainId, address, l0, cl1, dl1, name, symbol, logo } = options;
  const SUPPORTED_TYPES = ['L0'];
  const SUPPORTED_CHAINS = Object.values(DAG_NETWORK).map((network) => network.chainId);
  const args: ArgumentCheck[] = [
    { type: 'string', value: type, name: 'type' },
    { type: 'number', value: chainId, name: 'chainId' },
    { type: 'string', value: address, name: 'address' },
    { type: 'string', value: l0, name: 'l0', validations: ['no-empty'] },
    {
      type: 'string',
      value: cl1,
      optional: true,
      name: 'cl1',
    },
    {
      type: 'string',
      value: dl1,
      optional: true,
      name: 'dl1',
    },
    { type: 'string', value: name, name: 'name' },
    { type: 'string', value: symbol, name: 'symbol' },
    { type: 'string', value: logo, optional: true, name: 'logo' },
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

  await validateNodes(l0, cl1, dl1);
};
