import React, { FC } from 'react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import SeedIcon from '@material-ui/icons/Description';
import PrivKeyIcon from '@material-ui/icons/VpnKey';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowIcon from '@material-ui/icons/ArrowForwardIosRounded';

import Icon from 'components/Icon';
import Button from 'components/Button';
import TextInput from 'components/TextInput';
import { useController } from 'hooks/index';

import styles from './index.scss';;
import { KeyringWalletState, KeyringWalletType} from '@stardust-collective/dag4-keyring';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import WalletSelectors from 'selectors/walletsSelectors';
interface IManageWalletView {
  route: any;
  navigation: any;
}

const ManageWallet: FC<IManageWalletView> = ({route, navigation}) => {
  const controller = useController();
  const linkTo = useLinkTo();
  const id = route.params.id;
  const { handleSubmit, register } = useForm();
  const wallets: KeyringWalletState[]  = useSelector(WalletSelectors.selectAllWallets);
  const wallet = wallets.find(w => w.id === id);

  const onSubmit = (data: any) => {
    controller.wallet.account.updateWalletLabel(id, data.name);
    navigation.goBack();
  };

  const onCancelClicked = () => {
    navigation.goBack()
  }

  const onShowRecoveryPhraseClicked = () => {
    linkTo(`/settings/wallets/phrase?id=${id}`);
  }

  const onDeleteWalletClicked = () => {
    linkTo(`/settings/wallets/remove?id=${id}`)
  }

  const onShowPrivateKeyClicked = () => {
    linkTo(`/settings/wallets/privateKey?id=${id}`)
  }

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <label>Name</label>
      <TextInput
        name="name"
        visiblePassword
        fullWidth
        variant={styles.input}
        defaultValue={wallet.label}
        inputRef={register({ required: true })}
      />
      <label>Backup Options</label>
      {wallet.type === KeyringWalletType.MultiChainWallet ? (
        <section className={styles.menu} 
        onClick={onShowRecoveryPhraseClicked}
        >
          <Icon Component={SeedIcon} />
          <span>Show Recovery Phrase</span>
          <ArrowIcon />
        </section>
      ) : (
        <section
          className={styles.menu}
          onClick={onShowPrivateKeyClicked}
        >
          <Icon Component={PrivKeyIcon} />
          <span>Export private key</span>
          <ArrowIcon />
        </section>
      )}

      <span>
        If you lose access to this wallet, your funds will be lost, unless you
        back up!
      </span>
      <section
        className={styles.menu}
        onClick={onDeleteWalletClicked}
      >
        <Icon Component={DeleteIcon} />
        <span>Delete Wallet</span>
        <ArrowIcon />
      </section>
      <section className={styles.actions}>
        <div className={styles.buttons}>
        <Button
          type="button"
          variant={clsx(styles.button, styles.cancel)}
          onClick={onCancelClicked}
        >
          Cancel
        </Button>
        <Button type="submit" variant={clsx(styles.button, styles.save)}>
          Save
        </Button>
        </div>

      </section>
    </form>
  );
};

export default ManageWallet;
