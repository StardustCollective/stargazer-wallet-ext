/* eslint-disable @typescript-eslint/no-empty-function */
import React, { ReactNode, useState, FC, Children, createContext } from 'react';

interface IFormWizard {
  children: ReactNode;
}

export const FormWizardContext = createContext({
  step: 0,
  next: (): void => {},
  prev: (): void => {},
});

const FormWizard: FC<IFormWizard> = ({ children }) => {
  const [step, setStep] = useState(0);
  const compArray = Children.toArray(children);
  const next = () => setStep(Math.min(step + 1, compArray.length - 1));
  const prev = () => setStep(Math.max(step - 1, 0));

  return (
    <FormWizardContext.Provider value={{ step, next, prev }}>
      {compArray[step]}
    </FormWizardContext.Provider>
  );
};

export default FormWizard;
