import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
    width: '100%',
    padding: 16,
  },
  container: {
    marginTop: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    borderRadius: 8,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: 8,
  },
});

export default styles;
