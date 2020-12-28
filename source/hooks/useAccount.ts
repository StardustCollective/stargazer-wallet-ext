import { useController } from './index';

export default function useAccount() {
  const controller = useController();

  return controller.wallet.account.currentAccount();
}
