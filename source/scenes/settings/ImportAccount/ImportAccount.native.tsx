import React, { FC } from 'react';
import RNFS from 'react-native-fs';
import { View } from 'react-native';
import { dag4 } from '@stardust-collective/dag4';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import FileSelect from 'components/FileSelect';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { usePlatformAlert } from 'utils/alertUtil';
import IImportAccountSettings from './types';
import styles from './styles';

const ImportAccount: FC<IImportAccountSettings> = ({
  control,
  register,
  accountName,
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
              showAlert('Error: Invalid private key json file', 'danger');
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
                showAlert(
                  'Error: Invalid password to decrypt private key json file',
                  'danger'
                );
                setLoading(false);
              });
          } catch (err) {
            showAlert('Error: Invalid private key json file', 'danger');
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log('err in private key json file upload', err);
          showAlert('Error: Invalid private key json file', 'danger');
          setLoading(false);
        });
    }

    if (importType === 'hardware') {
      // window.open('/ledger.html', '_newtab');
      return;
    }

    showAlert('Error: A private key json file is not chosen', 'danger');
    return;
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
            onPress={handleFinish}
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
              options={[{ priv: 'Private key' }, { json: 'JSON file' }]}
              onChange={setImportType}
              fullWidth
              disabled={loading}
            />
          </View>
        </View>
        {importType === 'priv'
          ? renderPrivateKey()
          : importType === 'json' && renderJSONInput()}
        <>
          <View>
            <TextV3.Description
              color={COLORS_ENUMS.DARK_GRAY}
              extraStyles={styles.descriptionText}
            >
              Please name your new account:
            </TextV3.Description>
          </View>
          <TextInput
            control={control}
            id="importAccount-accountNameInput"
            fullWidth
            inputRef={register}
            name="label"
            disabled={loading}
          />
        </>
      </View>
      <View style={styles.actions}>
        <ButtonV3
          title="Cancel"
          extraStyles={styles.button}
          type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
          size={BUTTON_SIZES_ENUM.LARGE}
          onPress={handleCancel}
        />
        <ButtonV3
          title={'Import'}
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
