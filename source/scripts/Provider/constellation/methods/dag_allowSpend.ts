import { StargazerRequest, StargazerRequestMessage } from 'scripts/common';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import { checkArguments, getChainId, getChainLabel, getWalletInfo } from '../utils';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { getAccountController } from 'utils/controllersUtils';
import { DAG_EXPLORER_API_URL } from 'constants/index';
import { MetagraphProject } from 'scenes/external/AllowSpend';
import { IAssetInfoState } from 'state/assets/types';
import store from 'state/store';
import { dag4 } from '@stardust-collective/dag4';

type AllowSpendData = {
  source: string; // Wallet address signing the transaction.
  destination: string; // The AMM metagraph address
  amount: number; // In DATUM. The maximum transaction amount for which to generate a ‘lock’ around
  approvers: string[]; // A list of metagraphIds which can atomically approve this operation.
  currencyId: string | null; // The currency metagraph identifier. For DAG, it must be null.
  fee?: number; // In DATUM.The fee in the currency of the currency metragraph. If not provided, the default fee will be 0.
  validUntilEpoch?: number; // The global snapshot epoch progress for which this is valid until. If not provided, the default value will be the currentEpoch + 30.
};

const validateParams = async (request: StargazerRequest & { type: 'rpc' }) => {
  const { activeWallet } = getWalletInfo();

  const accountController = getAccountController();

  if (!activeWallet) {
    throw new Error('There is no active wallet');
  }

  const dagAccount = activeWallet.accounts.find(
    (account) => account.network === KeyringNetwork.Constellation
  );

  if (!dagAccount) {
    throw new Error('No active account for the request asset type');
  }

  if (!request.params) {
    throw new Error('params not provided');
  }

  const [data] = request.params as [AllowSpendData];

  if (!data) {
    throw new Error('invalid params');
  }

  const args = [
    { type: 'string', value: data.source, name: 'source', validations: ['isDagAddress'] },
    {
      type: 'string',
      value: data.destination,
      name: 'destination',
      validations: ['isDagAddress'],
    },
    {
      type: 'number',
      value: data.amount,
      name: 'amount',
      validations: ['positive', 'no-zero'],
    },
    { type: 'object', value: data.approvers, name: 'approvers' },
    {
      type: ['string', 'null'],
      value: data.currencyId,
      name: 'currencyId',
      validations: ['isDagAddress'],
    },
    {
      type: 'number',
      value: data.fee,
      name: 'fee',
      optional: true,
      validations: ['positive'],
    },
    {
      type: 'number',
      value: data.validUntilEpoch,
      name: 'validUntilEpoch',
      optional: true,
      validations: ['positive', 'no-zero'],
    },
  ];

  checkArguments(args);

  if (dagAccount.address !== data.source) {
    throw new Error('"source" address must be equal to the current active account.');
  }

  if (!data.approvers.length) {
    throw new Error('"approvers" must be an array with at least one DAG address');
  }

  for (const approver of data.approvers) {
    if (!accountController.isValidDAGAddress(approver)) {
      throw new Error(
        `"approvers" must be an array with valid DAG addresses. Approver "${approver}" is an invalid DAG address.`
      );
    }
  }

  const { assets } = store.getState();

  if (!!data.currencyId) {
    const currencyAsset = Object.values(assets).find(
      (asset) => asset.address === data.currencyId
    );
    if (!currencyAsset) {
      throw new Error('"currencyId" not found in the wallet');
    }

    if (!!currencyAsset && (!currencyAsset.l0endpoint || !currencyAsset.l1endpoint)) {
      throw new Error('"currencyId" must be a valid metagraph address');
    }
  } else {
    const dagAsset = Object.values(assets).find((asset) => asset.symbol === 'DAG');

    if (!dagAsset) {
      throw new Error('DAG asset not found in the wallet');
    }
  }
};

const fetchMetagraphProjects = async (): Promise<MetagraphProject[]> => {
  const MAP_CHAIN_ID_TO_NETWORK: Record<number, string> = {
    1: 'mainnet',
    3: 'testnet',
    4: 'integrationnet',
  };
  const chainId = getChainId();
  const network = MAP_CHAIN_ID_TO_NETWORK[chainId];

  if (!network) {
    return [];
  }

  let response: Response;

  try {
    response = await fetch(
      `${DAG_EXPLORER_API_URL}/${network}/metagraph-projects?limit=20&offset=0`
    );
  } catch (err) {
    return [];
  }

  if (!response || !response.ok) {
    return [];
  }

  const responseJson = await response.json();
  return responseJson?.data ?? [];
};

const getLatestEpoch = async (): Promise<number | null> => {
  const latestSnapshot = await dag4.network.l0Api.getLatestSnapshot();
  return latestSnapshot?.value?.epochProgress ?? null;
};

const generateMetagraphInfo = (
  metagraphProjects: MetagraphProject[],
  metagraphAddress: string,
  metagraphAsset: IAssetInfoState
) => {
  let metagraphInfo = {
    isMetagraph: false,
    label: '',
    logo: '',
  };

  const metagraphProject =
    metagraphProjects &&
    metagraphProjects.length &&
    metagraphProjects.find(
      (project: MetagraphProject) => project.metagraphId === metagraphAddress
    );

  if (!metagraphProject) {
    if (
      !!metagraphAsset &&
      !!metagraphAsset?.l0endpoint &&
      !!metagraphAsset?.l1endpoint
    ) {
      metagraphInfo = {
        isMetagraph: true,
        label: metagraphAsset.label,
        logo: metagraphAsset.logo,
      };
    }
  } else {
    metagraphInfo = {
      isMetagraph: true,
      label: metagraphProject.name,
      logo: metagraphProject.icon_url,
    };
  }
  return metagraphInfo;
};

const generateAllMetagraphInfo = async (destination: string, spender: string) => {
  const { assets } = store.getState();

  const destinationAsset = Object.values(assets).find(
    (asset) => asset.address === destination
  );

  const spenderAsset = Object.values(assets).find((asset) => asset.address === spender);

  const metagraphProjects = await fetchMetagraphProjects();

  const destinationInfo = generateMetagraphInfo(
    metagraphProjects,
    destination,
    destinationAsset
  );

  const spenderInfo = generateMetagraphInfo(metagraphProjects, spender, spenderAsset);
  return { destinationInfo, spenderInfo };
};

export const dag_allowSpend = async (
  request: StargazerRequest & { type: 'rpc' },
  message: StargazerRequestMessage,
  sender: chrome.runtime.MessageSender
) => {
  await validateParams(request);

  const { activeWallet, windowUrl, windowType } = getWalletInfo();

  const [data] = request.params as [AllowSpendData];

  const [{ destinationInfo, spenderInfo }, latestEpoch] = await Promise.all([
    generateAllMetagraphInfo(data.destination, data.approvers[0]),
    getLatestEpoch(),
  ]);

  if (!latestEpoch) {
    throw new Error('Failed to fetch latest epoch. Try again later.');
  }

  const minValidUntilEpoch = latestEpoch + 5;
  const maxValidUntilEpoch = latestEpoch + 60;

  if (data.validUntilEpoch && data.validUntilEpoch < minValidUntilEpoch) {
    throw new Error(
      `Invalid "validUntilEpoch" value. Must be greater or equal than: ${minValidUntilEpoch}.`
    );
  }

  if (data.validUntilEpoch && data.validUntilEpoch > maxValidUntilEpoch) {
    throw new Error(
      `Invalid "validUntilEpoch" value. Must be less or equal than: ${maxValidUntilEpoch}.`
    );
  }

  const DEFAULT_FEE = 0;
  const DEFAULT_EPOCH_DIFF = 30;
  const DEFAULT_VALID_UNTIL_EPOCH = latestEpoch + DEFAULT_EPOCH_DIFF;

  const updatedData = {
    ...data,
    fee: data.fee ? data.fee : DEFAULT_FEE,
    validUntilEpoch: data.validUntilEpoch ?? DEFAULT_VALID_UNTIL_EPOCH,
    latestEpoch,
  };

  const allowSpendData = {
    ...updatedData,
    destinationInfo,
    spenderInfo,
    walletLabel: activeWallet.label,
    walletId: activeWallet.id,
    chainLabel: getChainLabel(),
  };

  const windowSize = { width: 390, height: 748 };

  await StargazerExternalPopups.executePopupWithRequestMessage(
    allowSpendData,
    message,
    sender.origin,
    'allowSpend',
    windowUrl,
    windowSize,
    windowType
  );

  return StargazerWSMessageBroker.NoResponseEmitted;
};
