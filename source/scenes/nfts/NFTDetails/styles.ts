import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 358,
    borderRadius: 8,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFoundText: {
    fontSize: 16,
    marginTop: 16,
    color: '#000000A8',
  },
  titleContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    marginBottom: 4,
    fontWeight: '600',
  },
  sendButton: {
    marginBottom: 24,
  },
  sendTitleButton: {
    marginRight: 8,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  attributesContainer: {
    marginBottom: 8,
  },
  attributesItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subtitle: {
    marginBottom: 12,
  },
});

export default styles;
