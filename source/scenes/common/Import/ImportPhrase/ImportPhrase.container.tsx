///////////////////////////
// Controllers
///////////////////////////

import React, { FC, useMemo, useState } from 'react';
///////////////////////////
// Controllers
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

///////////////////////////
// Scene
///////////////////////////

import ImportPhrase from './ImportPhrase';
import { IDropdownOptions } from 'components/Dropdown/types';

///////////////////////////
// Types
///////////////////////////

interface IImportPhraseContainer {
  title: string;
  buttonTitle: string;
  onButtonPress: () => void;
}

///////////////////////////
// Container
///////////////////////////

const ImportPhraseContainer: FC<IImportPhraseContainer> = ({
  buttonTitle,
  title,
  onButtonPress,
}) => {
  ///////////////////////////
  // Hooks
  ///////////////////////////
  const walletController = getWalletController();

  const [phraseLength, setPhraseLength] = useState('12');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInvalidPhrase, setIsInvalidPhrase] = useState(false);
  const [phraseValues, setPhraseValues] = useState<string[]>(
    Array(parseInt(phraseLength)).fill('')
  );

  const isDisabled = useMemo(() => {
    if (!phraseValues) return true;
    let result = false;

    for (let phrase of phraseValues) {
      if (!phrase.trim()) {
        result = true;
        break;
      }
    }

    // Reset invalid if phrase has changed and no longer disabled.
    if (isInvalidPhrase && !result) {
      setIsInvalidPhrase(false);
    }

    return result;
  }, [phraseValues]);

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const handleInputChange = (value: string, index: number) => {
    const newInput = [...phraseValues];
    newInput[index] = value.trim();
    setPhraseValues(newInput);
  };

  const onSubmit = (phraseArray: string[]) => {
    const phrase = phraseArray.join(' ');

    if (walletController.onboardHelper.importAndValidateSeedPhrase(phrase)) {
      // onButtonPress();
    } else {
      setIsInvalidPhrase(true);
    }
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

  ///////////////////////////
  // Renders
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} safeArea={false}>
      <ImportPhrase
        title={title}
        buttonTitle={buttonTitle}
        onSubmit={onSubmit}
        isDisabled={isDisabled}
        isInvalidPhrase={isInvalidPhrase}
        phraseOptions={phraseOptions}
        phraseValues={phraseValues}
        handleInputChange={handleInputChange}
      />
    </Container>
  );
};

export default ImportPhraseContainer;
