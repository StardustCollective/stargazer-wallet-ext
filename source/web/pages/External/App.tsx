import React from 'react';
import queryString from 'query-string';
import Container from 'components/Container';
import Login from 'scenes/external/Login';
import SelectAccounts from 'scenes/external/SelectAccounts';
import ApproveSpend from 'scenes/external/ApproveSpend';
import SendTransaction from 'scenes/home/SendAsset/Send';
import ConfirmTransaction from 'scenes/home/SendAsset/Confirm';
import SignatureRequest from 'scenes/external/SignatureRequest';
import SignData from 'scenes/external/SignData';
import TypedSignatureRequest from 'scenes/external/TypedSignatureRequest';
import WatchAsset from 'scenes/external/WatchAsset';
import 'assets/styles/global.scss';
import { useController } from 'hooks/index';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

const App = () => {
  const controller = useController();
  const isUnlocked = controller.wallet.isUnlocked();
  const { route } = queryString.parse(window.location.search);

  return (
    <section id="App" style={{ minHeight: '300px', height: '100%' }}>
      <Container showHeight={false}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/selectAccounts" component={SelectAccounts} />
            <Route path="/approveSpend" component={ApproveSpend} />
            <Route path="/sendTransaction" component={SendTransaction} />
            <Route path="/confirmTransaction" component={ConfirmTransaction} />
            <Route path="/signMessage" component={SignatureRequest} />
            <Route path="/signData" component={SignData} />
            <Route path="/signTypedMessage" component={TypedSignatureRequest} />
            <Route path="/watchAsset" component={WatchAsset} />
            <Route path="/">
              {!isUnlocked ? (
                <Redirect to={`/login${window.location.search}`} />
              ) : (
                <Redirect to={`/${route}${window.location.search}`} />
              )}
            </Route>
          </Switch>
        </Router>
      </Container>
    </section>
  );
};

export default App;
