import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// import { browser, Tabs } from "webextension-polyfill-ts";
import Container from 'containers/common/Container';
import AuthRouter from 'routers/Auth';
import UnAuthRouter from 'routers/UnAuth';
import 'assets/styles/global.scss';
import { RootState } from 'reducers/store';
// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({ url });
// }

const App: FC = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth.isAuth);
  return (
    <section id="app" style={{ minHeight: '300px' }}>
      <Container>
        <Router>{isAuth ? <AuthRouter /> : <UnAuthRouter />}</Router>
      </Container>
    </section>
  );
};

export default App;
