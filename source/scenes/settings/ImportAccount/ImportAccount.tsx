import React, { FC, useState, useEffect } from 'react';
import clsx from 'clsx';
import CachedIcon from '@material-ui/icons/Cached';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { Checkbox } from '@material-ui/core';
import { dag4 } from '@stardust-collective/dag4';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
// import { KeyboardReturnOutlined } from '@material-ui/icons';

import Button from 'components/Button';
import Select from 'components/Select';
import { IOption } from 'components/Select/types';
import TextInput from 'components/TextInput';
import FileSelect from 'components/FileSelect';

// import LedgerIcon from 'assets/images/svg/ledger.svg';
import BitfiIcon from 'assets/images/svg/bitfi.svg';
import styles from './ImportAccount.scss';
import { useAlert } from 'react-alert';

import IImportAccountSettings, { HardwareWallet } from './types';

enum HARDWARE_WALLET {
  none = 0,
  bitfi,
  ledger,
}

const ImportAccount: FC<IImportAccountSettings> = ({
  accountName,
  hardwareStep,
  loadingWalletList,
  handleSubmit,
  register,
  handleImportPrivKey,
  onFinishButtonPressed,
  hardwareWalletList,
  importType,
  setImportType,
  loading,
  network,
  setLoading,
  jsonFile,
  setJsonFile,
}) => {
  const alert = useAlert();
  let [hardwareWallet, setHardwareWallet] = useState(HARDWARE_WALLET.none);
  let [dropDownMenuOptions, setDropDownMenuOptions] = useState<Array<IOption>>([
    { priv: 'Private key' },
    { json: 'JSON file' },
  ]);

  useEffect(() => {
    // Display a hardware type in drop down for constenllation wallet imports
    if (network === KeyringNetwork.Constellation) {
      let newDropDownState = [...dropDownMenuOptions, { hardware: 'Hardware wallet' }];
      setDropDownMenuOptions(newDropDownState);
    }
  }, []);

  const onSubmit = async (data: any): Promise<any> => {
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
                alert.error('Error: Invalid password to decrypt private key json file');
                setLoading(false);
              });
          } catch (error) {
            alert.error('Error: Invalid private key json file');
            setLoading(false);
          }
        }
      };
    } else if (importType === 'hardware') {
      if (hardwareWallet === HARDWARE_WALLET.ledger) {
        return window.open('/ledger.html', '_newtab');
      } else if (hardwareWallet === HARDWARE_WALLET.bitfi) {
        return window.open('/bitfi.html', '_newtab');
      }
    } else {
      return alert.error('Error: A private key json file is not chosen');
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

  const onHardwareTypeClick = (hardwareType: HARDWARE_WALLET) => {
    setHardwareWallet(hardwareType);
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
              onClick={onFinishButtonPressed}
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
                  options={dropDownMenuOptions}
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
            ) : importType === 'json' ? (
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
            ) : (
              <>
                {hardwareStep === 1 && (
                  <>
                    <span>
                      {importType === 'hardware'
                        ? 'Please select a hardware wallet to continue.'
                        : 'Please name your new account:'}
                    </span>
                  </>
                )}
                {hardwareStep === 1 && (
                  <>
                    <div className={styles.hardwareList}>
                      {/* <div onClick={() => onHardwareTypeClick(HARDWARE_WALLET.ledger)} className={clsx([styles.walletModel, hardwareWallet === HARDWARE_WALLET.ledger ? styles. walletModelSelected : null])}>
                        <img src={`/${LedgerIcon}`} alt="ledger_icon" />
                      </div>
                      &nbsp; */}
                      <div
                        onClick={() => onHardwareTypeClick(HARDWARE_WALLET.bitfi)}
                        className={clsx([
                          styles.walletModel,
                          hardwareWallet === HARDWARE_WALLET.bitfi
                            ? styles.walletModelSelected
                            : null,
                        ])}
                      >
                        <img src={`/${BitfiIcon}`} alt="bitfi_icon" />
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
              onClick={onFinishButtonPressed}
            >
              Cancel
            </Button>
            <Button
              disabled={
                importType === 'hardware'
                  ? hardwareWallet === HARDWARE_WALLET.none
                    ? true
                    : false
                  : false
              }
              id="importAccount-confirmNextButton"
              type="submit"
              variant={styles.button}
              loading={loading}
            >
              {importType === 'hardware' ? 'Next' : 'Import'}
            </Button>
          </section>
        </>
      )}
    </form>
  );
};

export default ImportAccount;
