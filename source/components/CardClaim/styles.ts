import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9584EB',
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    color: '#331B5F',
  },
  dots: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    borderWidth: 0.5,
    borderColor: '#9583F1',
    borderRadius: 4,
  },
  image: {
    height: '100%',
    minHeight: 120,
    width: 73,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemKey: {
    color: '#4B5563',
    fontWeight: '500',
  },
  itemValue: {
    color: '#4C2FB1',
    fontWeight: '500',
  },
  card: {
    flex: 1,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: '#f4f0ff',
    borderWidth: 1,
    borderColor: '#e2d6ff',
    borderRadius: 4,
  },
  cardTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardText: {
    color: '#331b5f',
  },
  diamondIcon: {
    marginLeft: 6,
  },
  cardTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#331b5f',
    fontWeight: '600',
  },
  button: {
    height: 34,
    borderWidth: 1,
    borderColor: '#593ee0',
  },
  buttonTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#593EE0',
  },
});

export default styles;
