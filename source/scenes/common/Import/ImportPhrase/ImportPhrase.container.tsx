import React, { FC, useMemo, useState } from 'react';
import { getWalletController } from 'utils/controllersUtils';
import Container, { CONTAINER_COLOR } from 'components/Container';
import { IDropdownOptions } from 'components/Dropdown/types';
import ImportPhrase from './ImportPhrase';
import { MODAL_DESCRIPTION_IMPORT, MODAL_DESCRIPTION_RESTORE } from './constants';

interface IImportPhraseContainer {
  type: IMPORT_TYPE;
  title: string;
  buttonTitle: string;
  onImportPhraseSuccess: () => void;
}

export enum IMPORT_TYPE {
  IMPORT = 0,
  RESTORE,
}

const ImportPhraseContainer: FC<IImportPhraseContainer> = ({
  type,
  buttonTitle,
  title,
  onImportPhraseSuccess,
}) => {
  const walletController = getWalletController();

  const [phraseLength, setPhraseLength] = useState('12');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPhraseModal, setShowPhraseModal] = useState(false);
  const [isButtonDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isCheckboxActive, setIsCheckboxActive] = useState(false);
  const [phraseValues, setPhraseValues] = useState<string[]>(
    Array(parseInt(phraseLength)).fill('')
  );
  const [showPasswordArray, setShowPasswordArray] = useState<boolean[]>(
    Array(parseInt(phraseLength)).fill(false)
  );

  const isDisabled = useMemo(() => {
    if (!phraseValues) return true;
    let disableButton = false;

    for (const phrase of phraseValues) {
      if (!phrase.trim()) {
        disableButton = true;
        break;
      }
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
    setIsLoading(true);
    const phrase = phraseArray.join(' ');

    if (type === IMPORT_TYPE.RESTORE) {
      if (walletController.onboardHelper.importAndValidateSeedPhrase(phrase)) {
        onImportPhraseSuccess();
      } else {
        setShowPhraseModal(true);
        setIsLoading(false);
      }
    } else {
      try {
        const isValidPhrase = walletController.onboardHelper.validateSeedPhrase(phrase);
        if (isValidPhrase) {
          await walletController.createWallet(null, phrase);
          onImportPhraseSuccess();
        } else {
          setShowPhraseModal(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  const onSubmitConfirm = async (phraseArray: string[]) => {
    setIsModalLoading(true);
    const phrase = phraseArray.join(' ');

    if (type === IMPORT_TYPE.RESTORE) {
      walletController.onboardHelper.setSeedPhrase(phrase);
    } else {
      await walletController.createWallet(null, phrase);
    }

    onImportPhraseSuccess();
  };

  const closePhraseModal = () => {
    setShowPhraseModal(false);
    setIsCheckboxActive(false);
  };

  const togglePassword = (index: number) => {
    const newShowPasswordArray: boolean[] = Array(parseInt(phraseLength)).fill(false);
    newShowPasswordArray[index] = !showPasswordArray[index];
    setShowPasswordArray(newShowPasswordArray);
  };

  const toggleCheckbox = () => {
    setIsCheckboxActive(!isCheckboxActive);
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

  const modalDescription =
    type === IMPORT_TYPE.RESTORE ? MODAL_DESCRIPTION_RESTORE : MODAL_DESCRIPTION_IMPORT;

  return (
    <Container
      color={CONTAINER_COLOR.EXTRA_LIGHT}
      safeArea={false}
      maxHeight={type === IMPORT_TYPE.IMPORT}
    >
      <ImportPhrase
        title={title}
        modalDescription={modalDescription}
        buttonTitle={buttonTitle}
        isDisabled={isDisabled || isButtonDisabled}
        isLoading={isLoading}
        isModalLoading={isModalLoading}
        showPhraseModal={showPhraseModal}
        phraseOptions={phraseOptions}
        phraseValues={phraseValues}
        showPasswordArray={showPasswordArray}
        isCheckboxActive={isCheckboxActive}
        onSubmit={onSubmit}
        toggleCheckbox={toggleCheckbox}
        handleInputChange={handleInputChange}
        togglePassword={togglePassword}
        closePhraseModal={closePhraseModal}
        onSubmitConfirm={onSubmitConfirm}
      />
    </Container>
  );
};

export default ImportPhraseContainer;
