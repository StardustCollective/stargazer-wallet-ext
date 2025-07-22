import React, { FC } from 'react';
import clsx from 'clsx';
import { dag4 } from '@stardust-collective/dag4';
import Button from 'components/Button';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import FileSelect from 'components/FileSelect';
import IImportAccountSettings from './types';
import { usePlatformAlert } from 'utils/alertUtil';
import styles from './ImportAccount.scss';

const ImportAccount: FC<IImportAccountSettings> = ({
  accountName,
  register,
  importType,
  loading,
  jsonFile,
  handleSubmit,
  handleImportPrivKey,
  handleCancel,
  handleFinish,
  setImportType,
  setLoading,
  setJsonFile,
}) => {
  const showAlert = usePlatformAlert();

  const onSubmit = async (data: any): Promise<any> => {
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
              showAlert('Error: Invalid private key json file', 'danger');
              return;
            }

            setLoading(true);
            dag4.keyStore
              .decryptPrivateKey(json, data.password)
              .then((privKey: string) => {
                handleImportPrivKey(privKey, data.label);
              })
              .catch(() => {
                showAlert(
                  'Error: Invalid password to decrypt private key json file',
                  'danger'
                );
                setLoading(false);
              });
          } catch (error) {
            showAlert('Error: Invalid private key json file', 'danger');
            setLoading(false);
          }
        }
      };
    } else {
      showAlert('Error: A private key or json file is not chosen', 'danger');
      return;
    }
  };

  return (
    <form className={styles.import} onSubmit={handleSubmit(onSubmit)}>
      {accountName ? (
        <div className={styles.generated}>
          <span>Your new private key account has been imported.</span>
          <span>You can view the public address in the asset view.</span>

          <div className={clsx(styles.actions, styles.centered)}>
            <Button
              id="importAccount-finishButton"
              type="button"
              variant={styles.button}
              onClick={handleFinish}
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
                  id="importAccount-importTypeSelect"
                  value={importType}
                  options={[{ priv: 'Private key' }, { json: 'JSON file' }]}
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
                  id="importAccount-privateKeyInput"
                  multiline
                  fullWidth
                  variant={styles.textarea}
                  inputRef={register}
                  name="privKey"
                  disabled={loading}
                />
              </>
            ) : (
              importType === 'json' && (
                <>
                  <FileSelect
                    id="importAccount-fileInput"
                    onChange={(val) => setJsonFile(val)}
                    disabled={loading}
                  />
                  <span>Please enter your JSON file password:</span>
                  <TextInput
                    id="importAccount-jsonPasswordInput"
                    fullWidth
                    inputRef={register}
                    name="password"
                    type="password"
                    visiblePassword
                    disabled={loading}
                  />
                </>
              )
            )}
            {importType !== 'hardware' && (
              <>
                <span>Please name your new account:</span>
                <TextInput
                  id="importAccount-accountNameInput"
                  fullWidth
                  inputRef={register}
                  name="label"
                  disabled={loading}
                />
              </>
            )}
          </section>
          <section className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.cancel)}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              id="importAccount-confirmNextButton"
              type="submit"
              variant={styles.button}
              loading={loading}
            >
              {'Import'}
            </Button>
          </section>
        </>
      )}
    </form>
  );
};

export default ImportAccount;
