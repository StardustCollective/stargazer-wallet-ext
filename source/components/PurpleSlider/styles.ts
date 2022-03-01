import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  contentView: {
    color: '#2B1D52',
    height: 4,
    //
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  thumb: {
    height: 24,
    width: 24,
    border: '2px solid white',
    backgroundColor: '#2B1D52',
    marginTop: -8,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
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
    backgroundColor: '#fff',
    borderRadius: 4,
  },
});

export default styles;
