import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import Start from 'containers/auth/Start';
import { useTransition, animated } from 'react-spring';
import Home from 'containers/auth/Home';
import Send, { SendConfirm } from 'containers/auth/Send';
import { useController } from 'hooks/index';

const Auth = () => {
  const location = useLocation();
  const controller = useController();
  const isUnlocked = !controller.wallet.isLocked();
  const transitions = useTransition(location, (locat) => locat.pathname, {
    initial: { opacity: 1, filter: 'blur(0)' },
    from: { opacity: 0, filter: 'blur(2px)' },
    enter: { opacity: 1, filter: 'blur(0)' },
    leave: { opacity: 0, filter: 'blur(2px)' },
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
              {isUnlocked && <Redirect to="/home" />}
            </Route>
            {isUnlocked && <Route path="/home" component={Home} exact />}
            {isUnlocked && (
              <Route path="/send/confirm" component={SendConfirm} exact />
            )}
            {isUnlocked && <Route path="/send" component={Send} exact />}
          </Switch>
        </animated.div>
      ))}
    </>
  );
};

export default Auth;
