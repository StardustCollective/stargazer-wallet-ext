import React, { FC, useMemo, useState } from 'react';
import { getWalletController } from 'utils/controllersUtils';
import Container, { CONTAINER_COLOR } from 'components/Container';
import ImportPhrase from './ImportPhrase';
import { IDropdownOptions } from 'components/Dropdown/types';

interface IImportPhraseContainer {
  type: IMPORT_TYPE;
  title: string;
  buttonTitle: string;
  onButtonPress: () => void;
}

export enum IMPORT_TYPE {
  IMPORT = 0,
  RESTORE,
}

const ImportPhraseContainer: FC<IImportPhraseContainer> = ({
  type,
  buttonTitle,
  title,
  onButtonPress,
}) => {
  const walletController = getWalletController();

  const [phraseLength, setPhraseLength] = useState('12');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInvalidPhrase, setIsInvalidPhrase] = useState(false);
  const [isButtonDisabled, setIsDisabled] = useState(false);
  const [phraseValues, setPhraseValues] = useState<string[]>(
    Array(parseInt(phraseLength)).fill('')
  );
  const [showPasswordArray, setShowPasswordArray] = useState<boolean[]>(
    Array(parseInt(phraseLength)).fill(false)
  );

  const isDisabled = useMemo(() => {
    if (!phraseValues) return true;
    let disableButton = false;

    for (let phrase of phraseValues) {
      if (!phrase.trim()) {
        disableButton = true;
        break;
      }
    }

    // Reset invalid if phrase has changed and no longer disabled.
    if (isInvalidPhrase) {
      setIsInvalidPhrase(false);
    }

    setIsDisabled(disableButton);
    return disableButton;
  }, [phraseValues]);

  const handleInputChange = (value: string, index: number) => {
    const newInput = [...phraseValues];
    newInput[index] = value.trim();
    setPhraseValues(newInput);
  };

  const onSubmit = async (phraseArray: string[]) => {
    setIsDisabled(true);
    const phrase = phraseArray.join(' ');

    if (type === IMPORT_TYPE.RESTORE) {
      if (walletController.onboardHelper.importAndValidateSeedPhrase(phrase)) {
        onButtonPress();
      } else {
        setIsInvalidPhrase(true);
      }
    } else {
      try {
        await walletController.createWallet(null, phrase);
        onButtonPress();
      } catch (error) {
        console.log(error);
        setIsInvalidPhrase(true);
      }
    }
  };

  const togglePassword = (index: number) => {
    const newShowPasswordArray: boolean[] = Array(parseInt(phraseLength)).fill(false);
    newShowPasswordArray[index] = !showPasswordArray[index];
    setShowPasswordArray(newShowPasswordArray);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const phraseOptions: IDropdownOptions = {
    isOpen: isDropdownOpen,
    toggleItem: toggleDropdown,
    value: phraseLength,
    onChange: (value: string) => {
      setPhraseLength(value);
      setPhraseValues(Array(parseInt(value)).fill(''));
      toggleDropdown();
    },
    containerStyle: {
      zIndex: 8000,
    },
    items: [
      {
        value: '12',
        label: '12-word phrase',
      },
      {
        value: '15',
        label: '15-word phrase',
      },
      {
        value: '18',
        label: '18-word phrase',
      },
      {
        value: '21',
        label: '21-word phrase',
      },
      {
        value: '24',
        label: '24-word phrase',
      },
    ],
  };

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} safeArea={false}>
      <ImportPhrase
        title={title}
        buttonTitle={buttonTitle}
        onSubmit={onSubmit}
        isDisabled={isDisabled || isButtonDisabled}
        isInvalidPhrase={isInvalidPhrase}
        phraseOptions={phraseOptions}
        phraseValues={phraseValues}
        showPasswordArray={showPasswordArray}
        handleInputChange={handleInputChange}
        togglePassword={togglePassword}
      />
    </Container>
  );
};

export default ImportPhraseContainer;
