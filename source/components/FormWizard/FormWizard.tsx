/* eslint-disable @typescript-eslint/no-empty-function */
import React, { FC, createContext, ReactNode } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

interface IFormWizard {
  children: ReactNode;
  routes: Array<string>;
}

export const FormWizardContext = createContext({
  next: (): void => {},
});

const FormWizard: FC<IFormWizard> = ({ routes, children }) => {
  const location = useLocation();
  const history = useHistory();
  const next = () => {
    const step = routes.indexOf(location.pathname);
    if (step === -1) return;
    const nextStep = Math.min(step + 1, routes.length - 1);
    history.push(routes[nextStep]);
  };

  return (
    <FormWizardContext.Provider value={{ next }}>
      {children}
    </FormWizardContext.Provider>
  );
};

export default FormWizard;
