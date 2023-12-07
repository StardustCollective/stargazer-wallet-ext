import React, { FC, useEffect } from 'react';
import RNFS from 'react-native-fs';
import Button from 'components/ButtonV3';

import { View, Text } from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';

import styles from './styles';

interface IFileSelect {
  accept?: string;
  disabled?: boolean;
  id?: string;
  onChange: (val: File | null | String) => void;
}

const FileSelect: FC<IFileSelect> = ({ id, onChange, disabled = false }) => {
  const [result, setResult] = React.useState<DocumentPickerResponse | undefined | null>();
  const [readFile, setReadFile] = React.useState<any>();

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2));
    onChange(null);
  }, [result]);

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered');
    } else {
      throw err;
    }
  };

  const handleFileChoose = () => {
    DocumentPicker.pickSingle({
      //restrict files types?
      type: [DocumentPicker.types.allFiles],
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
    })
      .then((res) => {
        /*
        https://github.com/rnmods/react-native-document-picker
        [
          {
            uri:
            fileCopyUri:
            type:
            name:
            size:
          }
        ]
        */

        setResult(res);
        RNFS.stat(res.fileCopyUri).then((file) => {
          setReadFile(file);

          //return file from read
          if (file.isFile()) {
            console.log('calling onChange on FileSelect--->>>', file.path);
            onChange(file.path);
          } else {
            throw new Error('No file processed');
          }
        });
      })
      .catch((e) => handleError(e));
  };

  return (
    <View style={styles.container}>
      <Button
        extraTitleStyles={styles.buttonTitle}
        extraStyles={styles.button}
        disabled={disabled}
        title="Choose File"
        onPress={handleFileChoose}
      />
      <Text style={styles.chosen}>{readFile ? result.name : 'No file chosen'}</Text>
    </View>
  );
};

export default FileSelect;
