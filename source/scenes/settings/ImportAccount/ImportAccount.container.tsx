import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { getWalletController } from 'utils/controllersUtils';
import Container, { CONTAINER_COLOR } from 'components/Container';
import ImportAccount from './ImportAccount';
import { IImportAccountView } from './types';
import { usePlatformAlert } from 'utils/alertUtil';
import { useLinkTo } from '@react-navigation/native';

const ImportAccountContainer: FC<IImportAccountView> = ({ route }) => {
  const linkTo = useLinkTo();

  const showAlert = usePlatformAlert();
  const walletController = getWalletController();
  const { network } = route.params;

  const [importType, setImportType] = useState('priv');
  const [loading, setLoading] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [accountName, setAccountName] = useState<string>();

  const { handleSubmit, register, control } = useForm({
    validationSchema: yup.object().shape({
      privKey: importType === 'priv' ? yup.string().required() : yup.string(),
      password: importType === 'json' ? yup.string().required() : yup.string(),
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
        showAlert('Error: Invalid private key', 'danger');
        setLoading(false);
        setAccountName(undefined);
      });
  };

  const handleCancel = () => {
    linkTo('/settings/wallets/import');
  };

  const handleFinish = () => {
    linkTo('/settings/wallets');
  };

  const showErrorAlert = (message: string) => {
    return showAlert(message, 'danger');
  };

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <ImportAccount
        control={control}
        accountName={accountName}
        importType={importType}
        jsonFile={jsonFile}
        loading={loading}
        register={register}
        handleSubmit={handleSubmit}
        handleImportPrivKey={handleImportPrivKey}
        handleCancel={handleCancel}
        handleFinish={handleFinish}
        setJsonFile={setJsonFile}
        setLoading={setLoading}
        setImportType={setImportType}
        showErrorAlert={showErrorAlert}
      />
    </Container>
  );
};

export default ImportAccountContainer;
