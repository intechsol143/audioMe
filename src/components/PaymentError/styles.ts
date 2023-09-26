import colors from '@src/constants/colors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  textStyle: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.black,
    marginTop: 15,
  },
});
