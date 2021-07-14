import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { dag4 } from '@stardust-collective/dag4';
import CachedIcon from '@material-ui/icons/Cached';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { Checkbox } from '@material-ui/core';

import Button from 'components/Button';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import FileSelect from 'components/FileSelect';
import { useController, useSettingsView } from 'hooks/index';

import { MAIN_VIEW } from '../routes';
import styles from './index.scss';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import LedgerIcon from 'assets/images/svg/ledger.svg';
import styles from './index.scss';

function isValidJsonPrivateKey(jKey: any) {
  const params = jKey && jKey.crypto && jKey.crypto.kdfparams;

  if (
    params &&
    params.salt &&
    params.n !== undefined &&
    params.r !== undefined &&
    params.p !== undefined &&
    params.dklen !== undefined
  ) {
    return true;
  }

  return false;
}

interface IImportAccountView {
  network: KeyringNetwork;
}

interface HardwareWallet {
  address: string;
  balance: number;
}

const ImportAccountView: FC<IImportAccountView> = ({ network }) => {

  const alert = useAlert();
  const controller = useController();
  const showView = useSettingsView();
  const [importType, setImportType] = useState('priv');
  const [loading, setLoading] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [accountName, setAccountName] = useState<string>();
  const [hardwareStep] = useState(1);
  const [loadingWalletList] = useState(false);
  // @ts-ignore
  const [hardwareWalletList, setHardwareWalletList] = useState<
    Array<HardwareWallet>
  >([]);

  const { handleSubmit, register } = useForm({
    validationSchema: yup.object().shape({
      privKey: importType === 'priv' ? yup.string().required() : yup.string(),
      password: importType === 'json' ? yup.string().required() : yup.string(),
      // label: yup.string().required(),
    }),
  });

  const handleImportPrivKey = async (privKey: string, label: string) => {
    // controller.wallet.account
    //   .importPrivKeyAccount(privKey, label, network)
    controller.wallet.importSingleAccount(label, network, privKey)
      .then((addr) => {
        setLoading(false);
        if (addr) {
          setAccountName(label);
        }
      })
      .catch(() => {
        alert.removeAll();
        alert.error('Error: Invalid private key');
        setLoading(false);
        setAccountName(undefined);
      });
  };

  const onSubmit = async (data: any) => {
    // setAccountName(undefined);
    if (importType === 'priv') {
      setLoading(true);
      handleImportPrivKey(data.privKey, data.label);
    } else if (importType === 'json' && jsonFile) {
      const fileReader = new FileReader();
      fileReader.readAsText(jsonFile, 'UTF-8');
      fileReader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target) {
          try {
            const json = JSON.parse(ev.target.result as string);
            if (!dag4.keyStore.isValidJsonPrivateKey(json)) {
              alert.removeAll();
              alert.error('Error: Invalid private key json file');
              return;
            }

            setLoading(true);
            dag4.keyStore
              .decryptPrivateKey(json, data.password)
              .then((privKey: string) => {
                handleImportPrivKey(privKey, data.label);
              })
              .catch(() => {
                alert.removeAll();
                alert.error(
                  'Error: Invalid password to decrypt private key json file'
                );
                setLoading(false);
              });
          } catch (error) {
            alert.removeAll();
            alert.error('Error: Invalid private key json file');
            setLoading(false);
          }
        }
      };
    } else if (importType === 'hardware') {
      window.open('/ledger.html', '_newtab');
    } else {
      alert.removeAll();
      alert.error('Error: A private key json file is not chosen');
    }
  };

  const renderWallet = (hwItem: HardwareWallet, index: number) => {
    return (
      <tr key={`wallet-${index}`}>
        <td>
          <Checkbox color="primary" />
        </td>
        <td>{index + 1}</td>
        <td>{hwItem.address}</td>
        <td>{hwItem.balance.toFixed(5)} ETH</td>
        <td className={styles.expand}>
          <CallMadeIcon />
        </td>
      </tr>
    );
  };
  return (
    <form className={styles.import} onSubmit={handleSubmit(onSubmit)}>
      {accountName ? (
        <div className={styles.generated}>
          <span>{`Your new private key account ${accountName} has been imported.`}</span>
          <span>
            You can select and share your public key by selecting an asset and
            copying the public key address.
          </span>

          <div className={clsx(styles.actions, styles.centered)}>
            <Button
              type="button"
              variant={styles.button}
              onClick={() => showView(MAIN_VIEW)}
            >
              Finish
            </Button>
          </div>
        </div>
      ) : (
        <>
          <section className={styles.content}>
            <div className={styles.select}>
              Select Type:
              <div className={styles.inner}>
                <Select
                  value={importType}
                  options={[
                    { priv: 'Private key' },
                    { json: 'JSON file' },
                    { hardware: 'Hardware wallet' },
                  ]}
                  onChange={(ev) => setImportType(ev.target.value as string)}
                  fullWidth
                  disabled={loading}
                />
              </div>
            </div>
            {importType === 'priv' ? (
              <>
                <span>Paste your private key string here:</span>
                <TextInput
                  multiline
                  fullWidth
                  variant={styles.textarea}
                  inputRef={register}
                  name="privKey"
                  disabled={loading}
                />
              </>
            ) : importType === 'json' ? (
              <>
                <FileSelect
                  onChange={(val) => setJsonFile(val)}
                  disabled={loading}
                />
                <span>Please enter your JSON file password:</span>
                <TextInput
                  fullWidth
                  inputRef={register}
                  name="password"
                  type="password"
                  visiblePassword
                  disabled={loading}
                />
              </>
            ) : (
              <>
                {hardwareStep === 1 && (
                  <>
                    <div className={styles.hardwareList}>
                      <div className={styles.walletModel}>
                        <img src={LedgerIcon} alt="ledger_icon" />
                      </div>
                    </div>
                  </>
                )}
                {hardwareStep === 2 && (
                  <>
                    <span>Please select an account:</span>
                    <div
                      className={clsx(styles.walletList, {
                        [styles.loading]: loadingWalletList,
                      })}
                    >
                      {loadingWalletList ? (
                        <>
                          <CachedIcon />
                          <span>Loading your Hardware Wallet</span>
                        </>
                      ) : (
                        <>
                          <div className={styles.wallet}>
                            <table>
                              <tbody>
                                {hardwareWalletList.map(
                                  (hwItem: HardwareWallet, index: number) =>
                                    renderWallet(hwItem, index)
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                    {!loadingWalletList && (
                      <div className={styles.pagination}>
                        <span className={styles.previous}>Previous</span>
                        <span>Next</span>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {hardwareStep === 1 && (
              <>
                <span>
                  {importType === 'hardware'
                    ? 'Connect to your ledger hardware wallet to import accounts'
                    : 'Please name your new account:'}
                </span>
                {importType !== 'hardware' && (
                  <TextInput
                    fullWidth
                    inputRef={register}
                    name="label"
                    disabled={loading}
                  />
                )}
              </>
            )}
          </section>
          <section className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.cancel)}
              onClick={() => showView(MAIN_VIEW)}
            >
              Cancel
            </Button>
            <Button type="submit" variant={styles.button} loading={loading}>
              {importType === 'hardware' ? 'Next' : 'Import'}
            </Button>
          </section>
        </>
      )}
    </form>
  );
};

export default ImportAccountView;
