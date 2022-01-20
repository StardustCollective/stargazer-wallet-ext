import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    // height: 80,
    borderRadius: 8,
    background: COLORS.white,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.08)',
    marginBottom: 10,
  }
});

export default styles;
