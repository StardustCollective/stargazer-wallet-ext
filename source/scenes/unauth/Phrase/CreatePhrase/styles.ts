import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  phraseContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  firstColumnContainer: {
    flexDirection: 'column',
    width: '50%',
  },
  secondColumnContainer: {
    flexDirection: 'column',
    width: '50%',
  },
  phrase: {
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.grey_light,
    paddingVertical: 10,
  },
  nextButton: {
    marginTop: 30,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default styles;
