import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Container from 'containers/common/Container';
import AuthRouter from 'routers/Auth';
import UnAuthRouter from 'routers/UnAuth';
import 'assets/styles/global.scss';
import { RootState } from 'state/store';

const App: FC = () => {
  const { keystore } = useSelector((state: RootState) => state.wallet);
  return (
    <section id="app" style={{ minHeight: '300px' }}>
      <Container>
        <Router>{keystore ? <AuthRouter /> : <UnAuthRouter />}</Router>
      </Container>
    </section>
  );
};

export default App;
