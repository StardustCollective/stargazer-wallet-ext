///////////////////////////
// Modules
///////////////////////////

import React, { useState, useMemo } from 'react';
import shuffle from 'lodash/shuffle';
import isEqual from 'lodash/isEqual';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

///////////////////////////
// Controllers
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Navigation
///////////////////////////

import { useNavigation } from '@react-navigation/native';
import navigationUtil from 'navigation/util';
import screens from 'navigation/screens';

///////////////////////////
// Scene
///////////////////////////

import ConfirmPhrase from './ConfirmPhrase';

///////////////////////////
// Container
///////////////////////////

const ConfirmPhraseContainer = ({ route }: { route: any }) => {
  const { walletName = 'Main Wallet', resetAll = true } = route.params || {};

  ///////////////////////////
  // Hooks
  ///////////////////////////

  const navigation = useNavigation();
  const walletController = getWalletController();
  const phrases = walletController.onboardHelper.getSeedPhrase();

  const [orgList] = useState<Array<string>>(shuffle((phrases || '').split(' ')));
  const [checkList, setCheckList] = useState<Array<boolean>>(new Array(12).fill(true));
  const [newList, setNewList] = useState<Array<string>>([]);
  const [passed, setPassed] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const title = passed ? `Your Wallet is ready` : `Verify your recovery\nphrase`;
  const showMaxHeight = !!walletName && walletName !== 'undefined';

  const isNotEqualArrays = useMemo((): boolean => {
    if (!phrases) return true;
    return !isEqual(phrases.split(' '), newList);
  }, [phrases, newList]);

  const handleSetPhrase = (idx: number) => {
    const checkNewList = [...checkList];
    if (checkNewList[idx]) {
      setNewList([...newList, orgList[idx]]);
    } else {
      const newIdx = newList.indexOf(orgList[idx]);
      const tempList = [...newList];
      tempList.splice(newIdx, 1);
      setNewList([...tempList]);
    }
    checkNewList[idx] = !checkNewList[idx];
    setCheckList([...checkNewList]);
  };

  ///////////////////////////
  // Callbacks
  ///////////////////////////

  const handleOrgPhrase = (idx: number) => {
    handleSetPhrase(idx);
  };

  const handleNewPhrase = (idx: number) => {
    const orgIdx = orgList.indexOf(newList[idx]);
    handleSetPhrase(orgIdx);
  };

  const handleConfirm = async () => {
    if (!passed) {
      setPassed(true);
    } else {
      setIsButtonDisabled(true);
      const resetAllValue = resetAll === 'false' || resetAll === false ? false : true;
      const walletNameValue =
        walletName === 'undefined' || !walletName ? 'Main Wallet' : walletName;
      await walletController.createWallet(walletNameValue, phrases, resetAllValue);
      walletController.onboardHelper.reset();
      navigationUtil.replace(navigation, screens.authorized.root);
    }
  };

  ///////////////////////////
  // Renders
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} maxHeight={showMaxHeight}>
      <ConfirmPhrase
        title={title}
        isButtonDisabled={isButtonDisabled || isNotEqualArrays}
        passed={passed}
        orgList={orgList}
        newList={newList}
        checkList={checkList}
        handleOrgPhrase={handleOrgPhrase}
        handleNewPhrase={handleNewPhrase}
        handleConfirm={handleConfirm}
      />
    </Container>
  );
};

export default ConfirmPhraseContainer;
