import {StyleSheet} from 'react-native';

import colors from '@src/constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  imageback: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  viewicon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  logostyle: {
    height: 150,
    width: 150,
  },
  logotext: {
    marginTop: 20,
    justifyContent: 'center',
    alignContent: 'center',
  },
  textlogo: {
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: 'white',
  },
  cardstyle: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    margin: 15,
    borderRadius: 10,
  },
  countryPickerContainer: {
    width: 114,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    height: 50,
    margin: 10,
    borderRadius: 5,
  },
  countryPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    borderWidth: 0.5,
    width: '55%',
    paddingHorizontal: 5,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.grey,
  },
  input: {
    fontWeight: 'bold',
    flex: 1,
    color: colors.black,
  },
  btnContainer: {
    height: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnLogo: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
  },
});
