import {StyleSheet} from 'react-native';
import colors from '@src/constants/colors';

export default StyleSheet.create({
  homeCardItem: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    padding: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  heading: {
    fontWeight: 'bold',
    color: colors.black,
  },
  image: {
    height: 320,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});
