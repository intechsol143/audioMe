import {StyleSheet} from 'react-native';

import colors from '@src/constants/colors';
import {shadow} from '@src/lib';

export default StyleSheet.create({
  top: {
    marginHorizontal: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    marginVertical: 30,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  content: {
    marginHorizontal: 15,
  },
  value: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    ...shadow,
  },
  button: {
    backgroundColor: colors.primary,
    marginTop: 30,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: 18,
  },
});
