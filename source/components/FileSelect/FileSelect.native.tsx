import React, { ChangeEvent, FC, useRef, useState, useEffect } from 'react';
import Button from 'components/Button';

import { StyleSheet, View, Text } from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';

// import styles from './styles';

interface IFileSelect {
  accept?: string;
  disabled?: boolean;
  id?: string;
  onChange: (val: File | null) => void;
}

const FileSelect: FC<IFileSelect> = ({
  id,
  onChange,
  disabled = false,
}) => {
  const [result, setResult] = React.useState<
    Array<DocumentPickerResponse> | undefined | null
  >();

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2));
    onChange(null);
  }, [result]);

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered'
      );
    } else {
      throw err;
    }
  };

  const handleFileChoose = () => {
    const res = DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      })
        .then((res) => setResult([res]))
        .catch((e) => handleError(e));
    
    console.log('res::::', res);
    // onChange(res);

  };


  return (
    <View>
      <Button
        disabled={disabled}
        title="Choose File"
        onPress={handleFileChoose}
      />
      <Text>{result ? JSON.stringify(result) : 'No file selected'}</Text>
    </View>
  );
};

export default FileSelect;
