import { StargazerWSMessageBroker } from '../messaging';

export const handleBrokerMessages = () => {
  const broker = new StargazerWSMessageBroker();
  broker.init();
};
