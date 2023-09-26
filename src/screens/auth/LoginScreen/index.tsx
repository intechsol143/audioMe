import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Loader} from '@src/components';
import colors from '@src/constants/colors';
import {loginUser} from '@src/lib/api';
import {validateEmail} from '@src/lib/validation';
import {logged, setToken} from '@src/redux/actions';
import {RootStackParamList} from '@src/utilis/types';

import styles from './styles';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const _loginUser = async () => {
    if (_validate()) {
      try {
        setLoader(true);
        const res: any = await loginUser({email, password});
        setLoader(false);
        if (res && res.status == 'success') {
          console.log("responce",res)
          setToken(res.token)(dispatch);
          logged(res.userdata)(dispatch);
        } else {
          Alert.alert('Something Went Wrong');
        }
      } catch (error) {
        console.log("Errorr",error.response)
        setLoader(false);
      }
    }
  };

  const _validate = () => {
    if (!validateEmail(email) && !password) {
      resetErrStates(true);
      return false;
    } else if (!validateEmail(email)) {
      setEmailErr(true);
      return false;
    } else if (!password) {
      setPasswordErr(true);
      return false;
    }

    return true;
  };

  const resetErrStates = (error: boolean) => {
    setEmailErr(error);
    setPasswordErr(error);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageback}
        source={require('@src/assets/background.jpg')}>
        <Feather
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', top: insets.top, left: 15, zIndex: 1}}
          size={30}
          color="white"
          name="arrow-left"
        />
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          {loader && <Loader loader={loader} />}
          <View style={styles.viewicon}>
            <Image
              resizeMode="contain"
              source={require('@src/assets/logo.png')}
              style={styles.logostyle}
            />

            <View style={styles.logotext}>
              <Text style={styles.textlogo}>Audio Me</Text>
            </View>
          </View>
          <View style={{flex: 3}}>
            <View style={{...styles.cardstyle}}>
              <View
                style={{
                  ...styles.inputContainer,
                  ...{
                    width: '90%',
                    borderColor: emailErr ? colors.red : colors.grey,
                  },
                }}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.white}
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    emailErr && resetErrStates(false);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View
                style={{
                  ...styles.inputContainer,
                  ...{
                    width: '90%',
                    borderColor: passwordErr ? colors.red : colors.grey,
                  },
                }}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.white}
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    passwordErr && resetErrStates(false);
                  }}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity onPress={_loginUser} style={styles.button}>
                <Text style={styles.btnText}>Login </Text>
              </TouchableOpacity>
              <View style={styles.askSignupView}>
                <Text style={{color: '#ffffff'}}>Don't have an Account?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SignUp');
                  }}>
                  <Text style={styles.askSignupText}>Sign up!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

// import React, {useState} from 'react';
// import {
//   Alert,
//   Image,
//   ImageBackground,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import CountryPicker from 'react-native-country-picker-modal';
// import Feather from 'react-native-vector-icons/Feather';
// import {useDispatch} from 'react-redux';

// import {LoginWithPhone} from '@src/lib/api';
// import {logged, setToken} from '@src/redux/actions';

// import styles from './styles';
// import colors from '@src/constants/colors';

// export default function LoginScreen() {
//   const [cca2, setCca2] = useState('PK'); // you can set ur country here
//   const [callingCode, setCallingCode] = useState('92');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [countryCode, setCountryCode] = useState('PK');
//   const [country, setCountry] = useState(null);
//   const [withFlag, setWithFlag] = useState(true);
//   const [withEmoji, setWithEmoji] = useState(true);
//   const [withFilter, setWithFilter] = useState(true);
//   const [withAlphaFilter, setWithAlphaFilter] = useState(false);
//   const [withCallingCode, setWithCallingCode] = useState(false);

//   const dispatch = useDispatch();

//   const onSelect = (country:any) => {
//     setCountryCode(country.cca2);
//     setCountry(country);
//     setCca2(country.cca2);
//     setCallingCode(country.callingCode);
//   };

//   const LoginApiHandler = () => {
//     const PhoneNum = '+' + callingCode + phoneNumber;
//     LoginWithPhone({email: PhoneNum, password: password}).then((res:any) => {
//       if (res && res.status == 'success') {
//         setToken(res.token)(dispatch);
//         logged(res.userdata)(dispatch);
//       } else {
//         Alert.alert('Something Went Wrong');
//       }
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         style={styles.imageback}
//         source={require('@src/assets/background.jpg')}>
//         <View style={{flex: 1}}>
//           <View style={styles.viewicon}>
//             <Image
//               resizeMode="contain"
//               source={require('@src/assets/logo.png')}
//               style={styles.logostyle}
//             />

//             <View style={styles.logotext}>
//               <Text style={styles.textlogo}>Audio Me</Text>
//             </View>
//           </View>
//           <View style={{flex: 4}}>
//             <View style={{...styles.cardstyle}}>
//               <View style={{flexDirection: 'row', marginTop: 10}}>
//                 <View style={styles.countryPickerContainer}>
//                   <View style={styles.countryPicker}>
//                     <CountryPicker
//                       {...{
//                         countryCode,
//                         withFilter,
//                         withFlag,
//                         withAlphaFilter,
//                         withCallingCode,
//                         withEmoji,
//                         onSelect,
//                       }}
//                     />

//                     <Text>{cca2}</Text>
//                     <Text>+{callingCode}</Text>
//                   </View>
//                 </View>
//                 <View style={styles.inputContainer}>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Your Phone"
//                     placeholderTextColor={colors.white}
//                     value={phoneNumber}
//                     onChangeText={text => {
//                       setPhoneNumber(text);
//                     }}
//                     keyboardType="number-pad"
//                   />
//                   <Feather name="check-circle" color="skyblue" size={20} />
//                 </View>
//               </View>
//               <View style={{...styles.inputContainer, ...{width: '90%'}}}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Password"
//                   placeholderTextColor={colors.white}
//                   value={password}
//                   onChangeText={text => {
//                     setPassword(text);
//                   }}
//                 />
//               </View>

//               <TouchableOpacity onPress={LoginApiHandler} style={styles.button}>
//                 <Text style={styles.btnText}>Login </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// }
