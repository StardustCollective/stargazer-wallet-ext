import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  iconContainer: {
    display: 'flex',
    height: 47,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    display: 'flex',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 24,
  },
  label: {
    fontSize: 16,
  },
  img: {
    width: 32,
    height: 32,
  },
  linkedIconImage: {
    width: 25,
    height: 25,
  },
  labelContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrowRightContainer: {
    justifyContent: 'center',
    marginRight: 8,
  },
  disabled: {
    backgroundColor: COLORS.grey_100,
  },
});

export default styles;
