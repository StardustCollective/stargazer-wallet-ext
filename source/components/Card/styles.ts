import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 12,
    margin: 0,
    marginBottom: 10,
  },
  wrapperStyle: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default styles;
