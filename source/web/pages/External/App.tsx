import 'assets/styles/global.scss';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps, Switch, useHistory } from 'react-router-dom';

import Container from 'components/Container';

import Login from 'scenes/common/Login';
import AllowSpend from 'scenes/external/AllowSpend';
import ApproveSpend from 'scenes/external/ApproveSpend';
import ExternalDelegatedStake from 'scenes/external/DelegatedStake';
import SelectAccounts from 'scenes/external/SelectAccounts';
import SendMetagraphData from 'scenes/external/SendMetagraphData';
import SignatureRequest from 'scenes/external/SignatureRequest';
import SignData from 'scenes/external/SignData';
import TokenLock from 'scenes/external/TokenLock';
import TypedSignatureRequest from 'scenes/external/TypedSignatureRequest';
import WatchAsset from 'scenes/external/WatchAsset';
import WithdrawDelegatedStakeView from 'scenes/external/WithdrawDelegatedStake';
import ConfirmTransaction from 'scenes/home/SendAsset/Confirm';
import SendTransaction from 'scenes/home/SendAsset/Send';
import Loading from 'scenes/unauth/Loading';

import { StargazerExternalPopups } from 'scripts/Background/messaging';

import { setLoading } from 'state/auth';
import store, { RootState } from 'state/store';

import { getWalletController } from 'utils/controllersUtils';
import { clearSession, getSgw, sessionExpired } from 'utils/keyring';

import { ExternalRoute } from './types';

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { unlocked } = useSelector((state: RootState) => state.auth);

  return <Route {...rest} render={props => (unlocked ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

const App = () => {
  const walletController = getWalletController();
  const history = useHistory();

  const { route } = StargazerExternalPopups.decodeRequestMessageLocationParams(window.location.href);
  const { unlocked, loading } = useSelector((state: RootState) => state.auth);

  const hideLoadingScreen = () => {
    setTimeout(() => {
      store.dispatch(setLoading(false));
    }, 500);
  };

  useEffect(() => {
    if (unlocked) {
      hideLoadingScreen();
      history.push(`/${route}${window.location.search}`);
    }
  }, [unlocked]);

  useEffect(() => {
    const checkWalletStatus = async () => {
      if (unlocked) return;

      store.dispatch(setLoading(true));
      const expired = await sessionExpired();

      if (expired) {
        // Session expired. User needs to login again
        await walletController.logOut();
        await clearSession();
        history.push(`/login${window.location.search}`);
        hideLoadingScreen();
        return;
      }

      const sgw = await getSgw();
      if (!sgw) {
        hideLoadingScreen();
        return;
      }

      const success = await walletController.unLock(sgw);
      if (!success) {
        hideLoadingScreen();
      }
    };

    checkWalletStatus();
  }, []);

  return (
    <section id="App" style={{ minHeight: '300px', height: '100%' }}>
      <Container showHeight={false}>
        <Switch>
          {loading && <Route path="/" component={Loading} />}
          <Route path="/login" component={Login} />

          <PrivateRoute path={`/${ExternalRoute.SelectAccounts}`} component={SelectAccounts} />
          <PrivateRoute path={`/${ExternalRoute.ApproveSpend}`} component={ApproveSpend} />
          <PrivateRoute path={`/${ExternalRoute.SignTransaction}`} component={SendTransaction} />
          <PrivateRoute path={`/${ExternalRoute.ConfirmTransaction}`} component={ConfirmTransaction} />
          <PrivateRoute path={`/${ExternalRoute.SignMessage}`} component={SignatureRequest} />
          <PrivateRoute path={`/${ExternalRoute.SignData}`} component={SignData} />
          <PrivateRoute path={`/${ExternalRoute.SendMetagraphData}`} component={SendMetagraphData} />
          <PrivateRoute path={`/${ExternalRoute.SignTypedMessage}`} component={TypedSignatureRequest} />
          <PrivateRoute path={`/${ExternalRoute.WatchAsset}`} component={WatchAsset} />
          <PrivateRoute path={`/${ExternalRoute.AllowSpend}`} component={AllowSpend} />
          <PrivateRoute path={`/${ExternalRoute.TokenLock}`} component={TokenLock} />
          <PrivateRoute path={`/${ExternalRoute.DelegatedStake}`} component={ExternalDelegatedStake} />
          <PrivateRoute path={`/${ExternalRoute.WithdrawDelegatedStake}`} component={WithdrawDelegatedStakeView} />
        </Switch>
      </Container>
    </section>
  );
};

export default App;
