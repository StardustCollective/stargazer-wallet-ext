import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import Start from 'containers/auth/Start';
import { RootState } from 'state/store';
import { useTransition, animated } from 'react-spring';
import Home from 'containers/auth/Home';
import Send from 'containers/auth/Send';

const Auth = () => {
  const location = useLocation();
  const { isLogged } = useSelector((state: RootState) => state.auth);
  const transitions = useTransition(location, (locat) => locat.pathname, {
    initial: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 500 },
  });

  return (
    <>
      {transitions.map(({ item, props, key }) => (
        <animated.div
          style={{
            ...props,
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
          key={key}
        >
          <Switch location={item}>
            <Route path="/app.html" component={Start} exact>
              {isLogged && <Redirect to="/home" />}
            </Route>
            <Route path="/home" component={Home} exact />
            <Route path="/send" component={Send} exact />
          </Switch>
        </animated.div>
      ))}
    </>
  );
};

export default Auth;
