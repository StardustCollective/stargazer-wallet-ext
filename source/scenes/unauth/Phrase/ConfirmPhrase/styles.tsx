import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  section: {
    height: 133,
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sectionBorder: {
    borderBottomWidth: 1,
    borderColor: COLORS.grey_light,
  },
  wordButton: {
    minWidth: 0,
    width: 78,
    height: 35,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 5,
    paddingHorizontal: 0,
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.03,
  },
  wordButtonPurpleLight: {
    backgroundColor: COLORS.purple_light,
  },
  wordButtonTitle: {
    color: COLORS.purple,
  },
  wordButtonPressed: {
    backgroundColor: COLORS.grey_dark,
  },
  wordButtonSelected: {
    backgroundColor: COLORS.grey_light,
  },
  wordButtonSelectedTitle: {
    color: COLORS.grey_dark,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  readyContainer: {
    alignItems: 'center',
  },
  checkIcon: {
    marginBottom: 40,
  },
});

export default styles;
