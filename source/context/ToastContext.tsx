import React, { FC, ReactNode, createContext, useContext, useState } from 'react';
import Toast from 'components/Toast';

export enum ToastType {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}
export enum ToastPosition {
  top = 'top',
  bottom = 'bottom',
}

export interface ToastProps {
  type: ToastType;
  position: ToastPosition;
  containerStyle?: any;
  title?: string;
  titleStyle?: any;
  message1?: string;
  message1Style?: any;
  message2?: string;
  message2Style?: any;
  onClose?: () => void;
}

interface ToastContextType {
  showToast: (props: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [topVisible, setTopVisible] = useState(false);

  const showToast = (props: ToastProps) => {
    setToastProps(props);
    if (props.position === ToastPosition.bottom) {
      setBottomVisible(true);
    } else {
      setTopVisible(true);
    }
  };

  const closeBottomToast = () => {
    setBottomVisible(false);
  };

  const closeTopToast = () => {
    setTopVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={bottomVisible}
        type={toastProps?.type}
        position={ToastPosition.bottom}
        containerStyle={toastProps?.containerStyle}
        title={toastProps?.title ?? ''}
        titleStyle={toastProps?.titleStyle}
        message1={toastProps?.message1 || ''}
        message1Style={toastProps?.message1Style}
        message2={toastProps?.message2 ?? ''}
        message2Style={toastProps?.message2Style}
        onClose={closeBottomToast}
      />
      <Toast
        visible={topVisible}
        type={toastProps?.type}
        position={ToastPosition.top}
        containerStyle={toastProps?.containerStyle}
        title={toastProps?.title ?? ''}
        titleStyle={toastProps?.titleStyle}
        message1={toastProps?.message1 || ''}
        message1Style={toastProps?.message1Style}
        message2={toastProps?.message2 ?? ''}
        message2Style={toastProps?.message2Style}
        onClose={closeTopToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
