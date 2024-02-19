import React, { FC } from 'react';

import RNFS from 'react-native-fs';
import { View, StyleSheet } from 'react-native';
import { Table, TableWrapper, Cell } from 'react-native-table-component';

import LedgerIcon from 'assets/images/svg/ledger.svg';
import { dag4 } from '@stardust-collective/dag4';

import Icon from 'components/Icon';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import FileSelect from 'components/FileSelect';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';

import styles from './styles';
import IImportAccountSettings, { HardwareWallet } from './types';

const ImportAccount: FC<IImportAccountSettings> = ({
  handleSubmit,
  showErrorAlert,
  control,
  register,
  handleImportPrivKey,
  onFinishButtonPressed,
  importType,
  setImportType,
  loading,
  setLoading,
  jsonFile,
  setJsonFile,
  accountName,
  hardwareStep,
  loadingWalletList,
  hardwareWalletList,
}) => {
  const onSubmit = async (data: any) => {
    // setAccountName(undefined);
    if (importType === 'priv') {
      setLoading(true);
      return handleImportPrivKey(data.privKey, data.label);
    }

    if (importType === 'json' && jsonFile) {
      return RNFS.readFile(jsonFile, 'utf8')
        .then((contents) => {
          const json = JSON.parse(contents);
          try {
            if (!dag4.keyStore.isValidJsonPrivateKey(json)) {
              showErrorAlert('Error: Invalid private key json file');
              return;
            }

            setLoading(true);
            dag4.keyStore
              .decryptPrivateKey(json, data.password)
              .then((privKey: string) => {
                console.log('handleImportPrivKey....', privKey);
                handleImportPrivKey(privKey, data.label);
              })
              .catch(() => {
                showErrorAlert(
                  'Error: Invalid password to decrypt private key json file'
                );
                setLoading(false);
              });
          } catch (err) {
            showErrorAlert('Error: Invalid private key json file');
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log('err in private key json file upload', err);
          showErrorAlert('Error: Invalid private key json file');
          setLoading(false);
        });
    }

    if (importType === 'hardware') {
      // window.open('/ledger.html', '_newtab');
      return;
    }

    showErrorAlert('Error: A private key json file is not chosen');
    return;
  };

  const renderWallet = (hwItem: HardwareWallet, index: number) => {
    return (
      <TableWrapper key={`wallet-${index}`}>
        <Cell>
          <Icon name="check-circle" fontType="mateiral" color="#1dbf8e" />
        </Cell>
        <Cell>{index + 1}</Cell>
        <Cell>{hwItem.address}</Cell>
        <Cell>{hwItem.balance.toFixed(5)} ETH</Cell>
        <Cell style={styles.expand}>
          <Icon name="call-made" fontType="material" color="#474747" />
        </Cell>
      </TableWrapper>
    );
  };

  const renderPrivateKey = () => {
    return (
      <>
        <TextV3.Description
          color={COLORS_ENUMS.DARK_GRAY}
          extraStyles={styles.descriptionText}
        >
          Paste your private key string here:
        </TextV3.Description>
        <TextInput
          control={control}
          id="importAccount-privateKeyInput"
          multiline
          fullWidth
          inputStyle={styles.textarea}
          inputRef={register}
          name="privKey"
          disabled={loading}
        />
      </>
    );
  };

  const renderJSONInput = () => {
    // do not memoize as this causes issues in JSON file select
    return (
      <>
        <FileSelect
          id="importAccount-fileInput"
          onChange={setJsonFile}
          disabled={loading}
        />
        <TextV3.Description
          color={COLORS_ENUMS.DARK_GRAY}
          extraStyle={styles.descriptionText}
        >
          Please enter your JSON file password:
        </TextV3.Description>
        <TextInput
          control={control}
          id="importAccount-jsonPasswordInput"
          fullWidth
          inputRef={register}
          name="password"
          type="password"
          visiblePassword
          disabled={loading}
        />
      </>
    );
  };

  if (accountName) {
    return (
      <View style={styles.import}>
        <View style={styles.generated}>
          <TextV3.Description
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyle={styles.descriptionText}
          >
            Your new private key account has been imported.
          </TextV3.Description>
          <TextV3.Description
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyle={styles.descriptionText}
          >
            You can view the public address in the asset view.
          </TextV3.Description>
          <ButtonV3
            title="Finish"
            type={BUTTON_TYPES_ENUM.PRIMARY}
            size={BUTTON_SIZES_ENUM.LARGE}
            id="importAccount-finishButton"
            onPress={onFinishButtonPressed}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.import}>
      <View style={styles.content}>
        <View style={styles.select}>
          <TextV3.Description
            color={COLORS_ENUMS.DARK_GRAY}
            extraStyles={styles.selectText}
          >
            Select Type:
          </TextV3.Description>
          <View style={styles.inner}>
            <Select
              id="importAccount-importTypeSelect"
              value={importType}
              options={[
                { priv: 'Private key' },
                { json: 'JSON file' },
                // { hardware: 'Hardware wallet' },
              ]}
              onChange={setImportType}
              fullWidth
              disabled={loading}
            />
          </View>
        </View>
        {importType === 'priv' ? (
          renderPrivateKey()
        ) : importType === 'json' ? (
          renderJSONInput()
        ) : (
          <>
            {hardwareStep === 1 && (
              <>
                <View style={styles.hardwareList}>
                  <View style={styles.walletModel}>
                    <View>
                      <LedgerIcon width={24} />
                    </View>
                  </View>
                </View>
              </>
            )}
            {hardwareStep === 2 && (
              <>
                <TextV3.Description color={COLORS_ENUMS.DARK_GRAY}>
                  Please select an account:
                </TextV3.Description>
                <View
                  style={StyleSheet.flatten([
                    styles.walletList,
                    loadingWalletList ? styles.loading : {},
                  ])}
                >
                  {loadingWalletList ? (
                    <>
                      <Icon name="cached" color="#474747" />
                      <TextV3.Label color={COLORS_ENUMS.DARK_GRAY}>
                        Loading your Hardware Wallet
                      </TextV3.Label>
                    </>
                  ) : (
                    <>
                      <View style={styles.wallet}>
                        <Table>
                          {hardwareWalletList.map(
                            (hwItem: HardwareWallet, index: number) =>
                              renderWallet(hwItem, index)
                          )}
                        </Table>
                      </View>
                    </>
                  )}
                </View>
                {!loadingWalletList && (
                  <View style={styles.pagination}>
                    <TextV3.Description
                      color={COLORS_ENUMS.DARK_GRAY}
                      extraStyles={styles.previous}
                    >
                      Previous
                    </TextV3.Description>
                    <TextV3.Description color={COLORS_ENUMS.DARK_GRAY}>
                      Next
                    </TextV3.Description>
                  </View>
                )}
              </>
            )}
          </>
        )}
        {hardwareStep === 1 && (
          <>
            <View>
              <TextV3.Description
                color={COLORS_ENUMS.DARK_GRAY}
                extraStyles={styles.descriptionText}
              >
                {importType === 'hardware'
                  ? 'Connect to your ledger hardware wallet to import accounts'
                  : 'Please name your new account:'}
              </TextV3.Description>
            </View>
            {importType !== 'hardware' && (
              <TextInput
                control={control}
                id="importAccount-accountNameInput"
                fullWidth
                inputRef={register}
                name="label"
                disabled={loading}
              />
            )}
          </>
        )}
      </View>
      <View style={styles.actions}>
        <ButtonV3
          title="Cancel"
          extraStyles={styles.button}
          type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
          size={BUTTON_SIZES_ENUM.LARGE}
          onPress={onFinishButtonPressed}
        />
        <ButtonV3
          title={importType === 'hardware' ? 'Next' : 'Import'}
          extraStyles={styles.button}
          id="importAccount-confirmNextButton"
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE}
          loading={loading}
          onPress={handleSubmit((data) => onSubmit(data))}
        />
      </View>
    </View>
  );
};

export default ImportAccount;
