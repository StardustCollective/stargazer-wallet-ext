import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import Container from 'components/Container';
import Login from 'scenes/common/Login';
import SelectAccounts from 'scenes/external/SelectAccounts';
import ApproveSpend from 'scenes/external/ApproveSpend';
import SendTransaction from 'scenes/home/SendAsset/Send';
import ConfirmTransaction from 'scenes/home/SendAsset/Confirm';
import SignatureRequest from 'scenes/external/SignatureRequest';
import SignData from 'scenes/external/SignData';
import TypedSignatureRequest from 'scenes/external/TypedSignatureRequest';
import WatchAsset from 'scenes/external/WatchAsset';
import { Route, Switch, Redirect, useHistory, RouteProps } from 'react-router-dom';
import { getWalletController } from 'utils/controllersUtils';
import store, { RootState } from 'state/store';
import { setLoading } from 'state/auth';
import { clearSession, getSgw, sessionExpired } from 'utils/keyring';
import 'assets/styles/global.scss';
import Loading from 'scenes/unauth/Loading';

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { unlocked } = useSelector((state: RootState) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => (unlocked ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

const App = () => {
  const walletController = getWalletController();
  const history = useHistory();

  const { route } = queryString.parse(window.location.search);
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
        return;
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

          <PrivateRoute path="/selectAccounts" component={SelectAccounts} />
          <PrivateRoute path="/approveSpend" component={ApproveSpend} />
          <PrivateRoute path="/sendTransaction" component={SendTransaction} />
          <PrivateRoute path="/confirmTransaction" component={ConfirmTransaction} />
          <PrivateRoute path="/signMessage" component={SignatureRequest} />
          <PrivateRoute path="/signData" component={SignData} />
          <PrivateRoute path="/signTypedMessage" component={TypedSignatureRequest} />
          <PrivateRoute path="/watchAsset" component={WatchAsset} />
        </Switch>
      </Container>
    </section>
  );
};

export default App;
