import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  NativeModules,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import {Loader} from '@src/components';
import colors from '@src/constants/colors';
import {isIOS} from '@src/lib';
import {
  loginUser,
  registerUser,
  SignupWithPhone,
  getTwitterUser,
} from '@src/lib/api';
import {logged, setToken} from '@src/redux/actions';
import {SignUpNavigationProp} from '@src/utilis/types';

import styles from './styles';

import type {SocialUserData} from '@src/utilis/types';

const {RNTwitterSignIn} = NativeModules;

const Constants = {
  //Dev Parse keys
  TWITTER_COMSUMER_KEY: '9s1CmAdC5aCrJU1WVZBhWQx5u',
  TWITTER_CONSUMER_SECRET: 'uD2g15m7SifRSq3M6Nho0eLhCMmxSQIfvGsHz7oPboviOV8iz3',
};

export default function LoginSelectorScreen() {
  const [cca2, setCca2] = useState('US'); // you can set ur country here
  const [callingCode, setCallingCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [country, setCountry] = useState(null);
  const [withFlag, setWithFlag] = useState(true);
  const [withEmoji, setWithEmoji] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState(false);
  const [withCallingCode, setWithCallingCode] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigation = useNavigation<SignUpNavigationProp>();
  const dispatch = useDispatch();

  const onSelect = (country: any) => {
    setCountryCode(country.cca2);
    setCountry(country);
    setCca2(country.cca2);
    setCallingCode(country.callingCode);
  };

  const _validate = () => {
    if (!phoneNumber) {
      setPhoneErr(true);
      return false;
    }
    return true;
  };

  const _getTwitterUser = async (data: SocialUserData) => {
    try {
      const res: any = await getTwitterUser(data.id);
      if (res) {
        const twitterUser = {
          ...data,
          image: res.profile_image_url,
          name: res.name,
        };
        _loginUser(twitterUser);
      }
    } catch (error) {}
  };

  const LoginApiHandler = async () => {
    if (_validate()) {
      try {
        const PhoneNum = '+' + callingCode + phoneNumber;
        const res: any = await SignupWithPhone({
          phone_number: PhoneNum,
          resend: 1,
        });

        if (res && res.status === 'success') {
          navigation.navigate('CodeVerification', {PhoneNum});
        } else {
          Alert.alert('Something Went Wrong');
        }
      } catch (error: any) {
        Alert.alert('Something Went Wrong');
      }
    }
  };

  const FBLogin = async () => {
    LoginManager.logOut();
    LoginManager.setLoginBehavior('web_only');
    LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      function (result) {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const {accessToken}: any = data;
            initUser(accessToken);
          });
        }
      },
      function (error) {},
    );
  };

  const twitterSignIn = () => {
    RNTwitterSignIn.init(
      Constants.TWITTER_COMSUMER_KEY,
      Constants.TWITTER_CONSUMER_SECRET,
    );
    RNTwitterSignIn.logIn()
      .then((res: any) => {
        const {authToken, authTokenSecret} = res;
        if (authToken && authTokenSecret) {
          const data = {
            email: res.email,
            id: res.userID,
            loginVia: 'twitter',
            image: '',
            name: '',
          };
          _getTwitterUser(data);
        }
      })
      .catch((error: any) => {});
  };

  const initUser = (token: string) => {
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=email,name,picture.height(480),friends&access_token=' +
        token,
    )
      .then(response => response.json())
      .then(res => {
        const data = {
          email: res.email,
          name: res.name,
          id: res.id,
          image: res.picture.data.url,
          loginVia: 'facebook',
        };
        // setSocialLoginCredentials(data)(dispatch);
        _loginUser(data);
      })
      .catch(() => {});
  };

  const _loginUser = async (data: SocialUserData) => {
    try {
      const res: any = await loginUser({email: data.email, password: data.id});
      if (res && res.status == 'success') {
        setToken(res.token)(dispatch);
        logged(res.userdata)(dispatch);
      } else {
        _registerUser(data);
      }
    } catch (error) {}
  };

  const _registerUser = async (user: SocialUserData) => {
    try {
      setLoader(true);
      const data = new FormData();
      data.append('name', user.name);
      data.append('email', user.email);
      data.append('password', user.id);
      data.append('confirm_password', user.id);
      data.append('image_url', user.image);
      const res: any = await registerUser(data);
      setLoader(false);
      if (res && res.status == 'success') {
        setToken(res.message.token)(dispatch);
        logged(res.message.user)(dispatch);
      } else {
        Alert.alert('Something Went Wrong');
      }
    } catch (error) {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.imageback}
        source={require('@src/assets/background.jpg')}>
        {loader && <Loader loader={loader} />}
        <View style={{...styles.viewicon, ...{flex: 2}}}>
          <Image
            source={require('@src/assets/logo.png')}
            style={styles.logostyle}
          />

          <View style={styles.logotext}>
            <Text
              style={styles.textlogo}
              // onPress={() => navigation.navigate('MapBoxScreen')}
            >
              Audio Me
            </Text>
          </View>
        </View>
        <View style={{flex: 4}}>
          <View style={{...styles.cardstyle}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={styles.countryPickerContainer}>
                  <View style={styles.countryPicker}>
                    <CountryPicker
                      {...{
                        countryCode,
                        withFilter,
                        withFlag,
                        withAlphaFilter,
                        withCallingCode,
                        withEmoji,
                        onSelect,
                      }}
                      // visible
                    />

                    <Text>{cca2}</Text>
                    <Text>+{callingCode}</Text>
                  </View>
                </View>
                <View
                  style={{
                    ...styles.inputContainer,
                    ...{borderColor: phoneErr ? colors.red : colors.grey},
                  }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Your Phone"
                    placeholderTextColor="white"
                    value={phoneNumber}
                    onChangeText={text => {
                      setPhoneNumber(text);
                      phoneErr && setPhoneErr(false);
                    }}
                    keyboardType={
                      isIOS ? 'numbers-and-punctuation' : 'phone-pad'
                    }
                  />
                  <Feather name="check-circle" color="skyblue" size={20} />
                </View>
              </View>

              <TouchableOpacity
                onPress={LoginApiHandler}
                style={styles.btnContainer}>
                <Text style={styles.btnText}>Confirm and Get Code</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.btnContainer}>
                <Text style={styles.btnText}>Login With Phone Number</Text>
              </TouchableOpacity> */}

              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 2,
                    width: '39%',
                    backgroundColor: 'white',
                    margin: 15,
                  }}
                />
                <Text style={{color: 'white', marginTop: 8}}>OR</Text>
                <View
                  style={{
                    height: 2,
                    width: '39%',
                    backgroundColor: 'white',
                    margin: 15,
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={FBLogin}
                style={{
                  ...styles.btnContainer,
                  ...{backgroundColor: colors.facebook},
                }}>
                <Image
                  style={styles.btnLogo}
                  source={require('@src/assets/Facebook.png')}
                />

                <Text style={styles.btnText}>Continue with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={twitterSignIn}
                style={{
                  ...styles.btnContainer,
                  ...{backgroundColor: colors.twitter},
                }}>
                <Image
                  style={styles.btnLogo}
                  source={require('@src/assets/twitter2.png')}
                />

                <Text style={styles.btnText}>Continue with Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={{
                  ...styles.btnContainer,
                  ...{backgroundColor: colors.blue},
                }}>
                <Image
                  style={styles.btnLogo}
                  source={require('@src/assets/email.png')}
                />

                <Text style={styles.btnText}>Continue with Email</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={{
                  ...styles.btnContainer,
                  ...{backgroundColor: colors.blue},
                }}>
                <Image
                  style={styles.btnLogo}
                  source={require('@src/assets/email.png')}
                />

                <Text style={styles.btnText}>Continue with Apple</Text>
              </TouchableOpacity> */}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
