import { StyleSheet } from 'react-native';
import { COLORS, NEW_COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.gray_light,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  activityScrollView: {
    flexGrow: 1,
  },
  spinner: {
    color: COLORS.primary,
  },
  stargazer: {
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    opacity: 0.6,
  },
  noDataContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 32,
  },
  noFoundText: {
    fontSize: 16,
    marginTop: 16,
    color: NEW_COLORS.gray_500,
    textAlign: 'center',
  },
  heading: {
    display: 'flex',
    backgroundColor: COLORS.gray_light,
    borderBottomColor: COLORS.gray_100,
    borderBottomWidth: 1,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 60,
    width: '100%',
    color: COLORS.gray_dark,
    zIndex: 2,
  },
  goTop: {
    width: 26,
    fontSize: 16,
    height: 26,
    position: 'absolute',
    right: 36,
  },
  listWrapper: {
    margin: 0,
    padding: 0,
    width: '100%',
    position: 'relative',
    zIndex: 1,
    flexGrow: 4,
  },
  listItem: {
    width: '100%',
    height: 84,
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkIcon: {
    backgroundColor: COLORS.gray_200,
  },
  groupbar: {
    height: 24,
    backgroundColor: COLORS.purple_medium,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.purple,
  },
});

export default styles;
