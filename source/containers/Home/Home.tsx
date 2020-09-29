import React from 'react';
import TextInput from 'components/TextInput';
import styles from './Home.scss';

const Home = () => {
  return (
    <div className={styles.home}>
      <TextInput
        type="password"
        visiblePassword
        placeholder="Please enter your password"
      ></TextInput>
    </div>
  );
};

export default Home;
