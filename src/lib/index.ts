import {Platform} from 'react-native';

export const isIOS = Platform.OS === 'ios' ? true : false;

export const shadow = {
  elevation: 5,
  shadowColor: 'grey',
  shadowOpacity: 0.8,
  shadowRadius: 2,
  shadowOffset: {
    height: 1,
    width: 1,
  },
};
