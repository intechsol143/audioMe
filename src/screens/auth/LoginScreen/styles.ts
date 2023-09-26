import colors from '@src/constants/colors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  imageback: {
    height: '100%',
    width: '100%',
  },
  viewicon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flex: 3,
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
    fontStyle: 'italic',
  },
  cardstyle: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    margin: 15,
    borderRadius: 10,
  },
  countryPickerContainer: {
    width: 100,
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
    alignSelf: 'center',
  },
  input: {
    fontWeight: 'bold',
    flex: 1,
    color: colors.black,
    height: 45,
  },
  button: {
    height: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: colors.white,
    fontSize: 16,
  },
  askSignupView: {
    width: '90%',
    marginLeft: '5%',
    marginVertical: 15,
    fontSize: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askSignupText: {
    marginLeft: 5,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    color: colors.primary,
  },
});
