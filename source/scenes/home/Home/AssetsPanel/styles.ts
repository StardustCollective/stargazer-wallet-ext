import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: COLORS.gray_light,
  },
  content: {
    margin: 16,
    paddingBottom: 18,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
    borderRadius: 8,
  },
  titleContainer: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: '#5B36D3',
  },
});

export default styles;
