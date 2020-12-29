import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import Start from 'containers/unauth/Start';
import Remind from 'containers/unauth/Remind';
import CreatePass from 'containers/unauth/CreatePass';
import { useTransition, animated } from 'react-spring';
import {
  CreatePhrase,
  ConfirmPhrase,
  RemindPhrase,
} from 'containers/unauth/Phrase';

const UnAuth = () => {
  const location = useLocation();
  const transitions = useTransition(location, (locat) => locat.pathname, {
    initial: { opacity: 1, filter: 'blur(0)' },
    from: { opacity: 0, filter: 'blur(2px)' },
    enter: { opacity: 1, filter: 'blur(0)' },
    leave: { opacity: 0, filter: 'blur(2px)' },
    config: { duration: 500 },
  });

  /**
   * --- Create Account Flow ---
   * Start => Remind => CreatePass => RemindPhrase => CreatePhrase => ConfirmPhrase
   */
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
            <Route path="/app.html" component={Start} exact />
            <Route path="/remind" component={Remind} exact />
            <Route path="/create/pass" component={CreatePass} exact />
            <Route
              path="/create/phrase/remind"
              component={RemindPhrase}
              exact
            />
            <Route
              path="/create/phrase/generated"
              component={CreatePhrase}
              exact
            />
            <Route
              path="/create/phrase/check"
              component={ConfirmPhrase}
              exact
            />
          </Switch>
        </animated.div>
      ))}
    </>
  );
};

export default UnAuth;
