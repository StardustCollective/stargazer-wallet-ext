import { StyleSheet } from 'react-native';
import { COLORS } from '../../assets/styles/_variables.native';

const styles = StyleSheet.create({
  contentView: {
    color: '#2B1D52',
    height: 4,
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  thumb: {
    height: 24,
    width: 24,
    border: '2px solid white',
    backgroundColor: COLORS.purple_2,
    marginTop: -8,
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 4,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    borderRadius: 4,
  },
});

export default styles;
