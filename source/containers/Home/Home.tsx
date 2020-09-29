import React from 'react';
import TextInput from 'components/TextInput';
import styles from './Home.scss';

const Home = () => {
  return (
    <div className={styles.home}>
      <TextInput>Hello World</TextInput>
    </div>
  );
};

export default Home;
