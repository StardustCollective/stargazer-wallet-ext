import React, { FC, useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import navigationUtil from 'navigation/util';

import { getWalletController } from 'utils/controllersUtils';

import Container, { CONTAINER_COLOR } from 'components/Container';

import ImportAccount from './ImportAccount';

import { IImportAccountView, HardwareWallet } from './types';

const ImportAccountContainer: FC<IImportAccountView> = ({ route, navigation }) => {
  const walletController = getWalletController();
  const { network } = route.params;

  const [importType, setImportType] = useState('priv');
  const [loading, setLoading] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [accountName, setAccountName] = useState<string>();
  const [hardwareStep] = useState(1);
  const [loadingWalletList] = useState(false);

  // @ts-ignore
  const [hardwareWalletList, setHardwareWalletList] = useState<Array<HardwareWallet>>([]);

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      privKey: importType === 'priv' ? yup.string().required() : yup.string(),
      password: importType === 'json' ? yup.string().required() : yup.string(),
      // label: yup.string().required(),
    }),
  });

  const handleImportPrivKey = async (privKey: string, label: string) => {
    return walletController
      .importSingleAccount(label, network, privKey)
      .then((walletLabel: string) => {
        setLoading(false);
        if (walletLabel) {
          setAccountName(walletLabel);
        }
      })
      .catch(() => {
        showMessage({
          message: 'Error: Invalid private key',
          type: 'danger',
        });
        setLoading(false);
        setAccountName(undefined);
      });
  };

  const onFinishButtonPressed = () => {
    navigationUtil.popToTop(navigation);
  };

  const showErrorAlert = (message: string) => {
    return showMessage({
      message,
      type: 'danger',
    });
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <ImportAccount
        handleSubmit={handleSubmit}
        control={control}
        register={register}
        handleImportPrivKey={handleImportPrivKey}
        onFinishButtonPressed={onFinishButtonPressed}
        network={network}
        importType={importType}
        jsonFile={jsonFile}
        setJsonFile={setJsonFile}
        loading={loading}
        setLoading={setLoading}
        setImportType={setImportType}
        accountName={accountName}
        hardwareStep={hardwareStep}
        hardwareWalletList={hardwareWalletList}
        loadingWalletList={loadingWalletList}
        showErrorAlert={showErrorAlert}
      />
    </Container>
  );
};

export default ImportAccountContainer;
