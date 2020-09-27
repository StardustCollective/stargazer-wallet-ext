import React, { FC } from 'react';
// import { browser, Tabs } from "webextension-polyfill-ts";

import styles from './App.scss';

// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({ url });
// }

const App: FC = () => {
  return (
    <section id="app" className={styles.app}>
      Stardust Collective
    </section>
  );
};

export default App;
