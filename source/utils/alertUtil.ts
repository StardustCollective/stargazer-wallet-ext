import { useAlert } from 'react-alert';

export const usePlatformAlert = () => {
  const alert = useAlert();

  return (message: string, type: string) => {
    alert.removeAll();

    if (type === 'danger') {
      alert.error(message);
    } else {
      alert.show(message);
    }
    return;
  };
};
