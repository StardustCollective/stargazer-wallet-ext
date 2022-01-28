import React, { useState, useMemo } from 'react';
import ConfirmPhrase from './ConfirmPhrase';
import Container from 'components/Container';
import shuffle from 'lodash/shuffle';
import isEqual from 'lodash/isEqual';
// import { useController } from 'hooks/index';
import { useNavigation} from '@react-navigation/native';
import navigationUtil from 'navigation/util';
import screens from 'navigation/screens';


const ConfirmPhraseContainer = () => {

  const navigation = useNavigation();
  // const controller = useController();
  // const phrases = controller.wallet.onboardHelper.getSeedPhrase();
  const phrases = 'wave squeeze stamp film work eyebrow resist balance strong danger street economy';
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
      // await controller.wallet.createWallet('Main Wallet', phrases, true);
      // controller.wallet.onboardHelper.reset();
      navigationUtil.replace( navigation, screens.authorized.root);
    }
  };

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
