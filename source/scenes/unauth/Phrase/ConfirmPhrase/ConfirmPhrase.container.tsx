///////////////////////////
// Modules
///////////////////////////

import React, { useState, useMemo } from 'react';
import shuffle from 'lodash/shuffle';
import isEqual from 'lodash/isEqual';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';

///////////////////////////
// Controllers
///////////////////////////

import WalletController from 'scripts/Background/controllers/WalletController';

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
// Constants
///////////////////////////

const phrases = WalletController.onboardHelper.getSeedPhrase();

///////////////////////////
// Container
///////////////////////////

const ConfirmPhraseContainer = () => {


  ///////////////////////////
  // Hooks
  ///////////////////////////

  const navigation = useNavigation();

  const [orgList] = useState<Array<string>>(
    shuffle((phrases || '').split(' '))
  );
  const [checkList, setCheckList] = useState<Array<boolean>>(
    new Array(12).fill(true)
  );
  const [newList, setNewList] = useState<Array<string>>([]);
  const [passed, setPassed] = useState(false);
  const title = passed
    ? `Your Wallet is ready`
    : `Verify your recovery\nphrase`;

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
      WalletController.createWallet('Main Wallet', phrases, true);
      WalletController.onboardHelper.reset();
      navigationUtil.replace( navigation, screens.authorized.root);
    }
  };

  ///////////////////////////
  // Renders
  ///////////////////////////

  return (
    <Container>
      <ConfirmPhrase
        title={title}
        isNotEqualArrays={isNotEqualArrays}
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
