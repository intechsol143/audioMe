import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';

import {Loader} from '@src/components';
import colors from '@src/constants/colors';
import {registerUser} from '@src/lib/api';
import {validateEmail} from '@src/lib/validation';
import {logged, setToken} from '@src/redux/actions';

import styles from './styles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@src/utilis/types';

export default function SignUpScreen() {
  const [image, setImage] = useState<string | undefined>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const _registerUser = async () => {
    if (_validate()) {
      try {
        setLoader(true);
        const data = new FormData();
        name && data.append('name', name);
        data.append('email', email);
        data.append('password', password);
        data.append('confirm_password', confirmPassword);
        image && data.append('image', image);
        const res: any = await registerUser(data);
        setLoader(false);

        if (res && res.status == 'success') {
          setToken(res.message.token)(dispatch);
          logged(res.message.user)(dispatch);
        } else {
          Alert.alert('Something Went Wrong');
        }
      } catch (error) {
        console.log("Error",error)
        setLoader(false);
      }
    }
  };

  const _validate = () => {
    if (!validateEmail(email) && !password && !confirmPassword) {
      resetErrStates(true);
      return false;
    } else if (!validateEmail(email)) {
      setEmailErr(true);
      return false;
    } else if (!password) {
      setPasswordErr(true);
      return false;
    } else if (password !== confirmPassword) {
      setPasswordErr(true);
      return false;
    }

    return true;
  };

  const resetErrStates = (error: boolean) => {
    setEmailErr(error);
    setPasswordErr(error);
  };

  const _selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      multiple: false,
    }).then(image => {
      setImage(image.sourceURL);
    });
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            <View style={styles.viewicon}>
              <Pressable onPress={_selectImage}>
                {image ? (
                  <Image source={{uri: image}} style={styles.logostyle} />
                ) : (
                  <Image
                    resizeMode="contain"
                    source={require('@src/assets/user_placeholder.png')}
                    style={styles.logostyle}
                  />
                )}
              </Pressable>
            </View>
            <View>
              <View style={{...styles.cardstyle}}>
                <View
                  style={{
                    ...styles.inputContainer,
                    ...{
                      width: '90%',
                    },
                  }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor={colors.white}
                    value={name}
                    onChangeText={text => {
                      setName(text);
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
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.white}
                    value={confirmPassword}
                    onChangeText={text => {
                      setConfirmPassword(text);
                      passwordErr && resetErrStates(false);
                    }}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity onPress={_registerUser} style={styles.button}>
                  <Text style={styles.btnText}>Sign Up </Text>
                </TouchableOpacity>
                <View style={styles.askSignupView}>
                  <Text style={{color: '#ffffff'}}>
                    Already have an Account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Login');
                    }}>
                    <Text style={styles.askSignupText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
