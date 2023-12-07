import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
    width: '100%',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    bottom: 40,
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 10,
    paddingTop: 6,
  },
});

export default styles;
