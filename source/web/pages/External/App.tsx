import React, { FC } from 'react';
import queryString from 'query-string';

import Container from 'scenes/common/Container';
import Login from 'scenes/external/Login';
import SelectAccounts from 'scenes/external/SelectAccounts';
import ApproveSpend from 'scenes/external/ApproveSpend';
import SendTransaction from 'scenes/home/Send/Send';
import ConfirmTransaction from 'scenes/home/Send/Confirm';

import 'assets/styles/global.scss';
import { useController } from 'hooks/index';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
const App: FC = () => {
  const controller = useController();

  // const { wallets }: IVaultState = useSelector((state: RootState) => state.vault);
  const isUnlocked = controller.wallet.isUnlocked();
  const { route } = queryString.parse(location.search);

  return (
    <section id="App" style={{ minHeight: '300px' }}>
      <Container>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/selectAccounts" component={SelectAccounts} />
            <Route path="/approveSpend" component={ApproveSpend} />
            <Route path="/sendTransaction" component={SendTransaction} />
            <Route path="/confirmTransaction" component={ConfirmTransaction} />
            <Route path="/">
              {!isUnlocked ?
                <Redirect to={`/login${location.search}`} /> :
                <Redirect to={`/${route}${location.search}`} />
              }
            </Route>
          </Switch>
        </Router>
      </Container>
    </section>
  );
};

export default App;