import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import { browser, Tabs } from "webextension-polyfill-ts";
import Container from 'containers/common/Container';
// import AuthRouter from 'routers/Auth';
import UnAuthRouter from 'routers/UnAuth';

import './App.scss';
// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({ url });
// }

const App: FC = () => {
  return (
    <section id="app">
      <Container>
        <Router>
          <UnAuthRouter />
        </Router>
      </Container>
    </section>
  );
};

export default App;
