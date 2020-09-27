import React, { FC } from 'react';
// import { browser, Tabs } from "webextension-polyfill-ts";

import Container from 'containers/common/Container';

// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({ url });
// }

const App: FC = () => {
  return (
    <section id="app">
      <Container></Container>
    </section>
  );
};

export default App;
