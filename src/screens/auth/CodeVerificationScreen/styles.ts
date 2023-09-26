import {StyleSheet} from 'react-native';

import colors from '@src/constants/colors';
import {shadow} from '@src/lib';

export default StyleSheet.create({
  root: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
    alignContent: 'center',
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 150,
    width: 150,
  },
  titleContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.white,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  codeFieldRoot: {
    marginTop: 20,
    alignSelf: 'center',
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 40,
    fontSize: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.white,
    textAlign: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  focusCell: {},
  btnContainer: {
    height: 45,
    justifyContent: 'center',
    alignContent: 'center',
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginTop: 40,
  },
  btnText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    color: colors.white,
  },
  cardstyle: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    margin: 20,
    borderRadius: 10,
  },
  backIconContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
    position: 'absolute',
    bottom: 140,
    width: '100%',
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    height: 320,
    width: '90%',
    ...shadow,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignContent: 'center',
  },
  textStyle: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 25,
  },
  modalText1: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 15,
    color: 'grey',
  },
});
