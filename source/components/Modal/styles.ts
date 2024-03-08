import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables.native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    borderRadius: 8,
    borderColor: COLORS.gray_500,
    borderWidth: 1,
    padding: 24,
    backgroundColor: COLORS.white,
  },
});

export default styles;
