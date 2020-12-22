import { useCallback, useEffect, useState } from 'react';
import { IAccountInfo } from 'scripts/types';
import { useController } from './index';

export default function useAccount() {
  const controller = useController();
  const [accountInfo, setAccountInfo] = useState<IAccountInfo>({
    address: '',
    balance: 0,
  });

  const fetchAccountInfo = useCallback(() => {
    controller.wallet.accounts.getPrimaryAccount().then((res) => {
      if (res) setAccountInfo(res);
    });
  }, []);

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  return accountInfo;
}
