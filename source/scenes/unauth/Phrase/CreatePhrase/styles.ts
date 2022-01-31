import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  phraseContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: 250,
    marginTop: 20,
  },
  phrase: {
    width: '49%',
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.grey_light,
    paddingVertical: 10,
  },
});

export default styles;
