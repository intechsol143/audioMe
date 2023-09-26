import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';

import {useRoute} from '@react-navigation/native';
import {VerifyCode} from '@src/lib/api';
import {logged, setToken} from '@src/redux/actions';
import {CodeVerificationRouteProp} from '@src/utilis/types';
import colors from '@src/constants/colors';

import styles from './styles';

const CELL_COUNT = 6;

export default function CodeVerificationScreen() {
  const route = useRoute<CodeVerificationRouteProp>();
  const dispatch = useDispatch();

  const {PhoneNum} = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <SafeAreaView style={styles.root}>
      <ImageBackground
        source={require('@src/assets/background.jpg')}
        style={{flex: 1}}>
        <View style={styles.logoContainer}>
          <View>
            <Image
              resizeMode="contain"
              style={styles.logo}
              source={require('@src/assets/logo.png')}
            />
          </View>
          <Text style={{fontSize: 30}}>Audio Me</Text>
        </View>
        <View style={{flex: 4}}>
          <View style={styles.cardstyle}>
            <Feather
              style={{margin: 10}}
              size={24}
              color="white"
              name="arrow-left"
            />
            <TouchableOpacity style={styles.backIconContainer}>
              <MaterialCommunityIcons
                name="email-edit"
                size={50}
                color={colors.primary}
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Enter the code send to you Phone number {PhoneNum}
              </Text>
            </View>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.btnContainer}>
              <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>
            <SafeAreaView style={{flex: 1}}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Aggrement</Text>
                    <Text style={styles.modalText1}>
                      We need to ask you if you agree with our Terms of Service
                      and Privacy policy. Nothing Special just legal issue.
                    </Text>

                    <View style={{position: 'absolute', bottom: 8}}>
                      <TouchableOpacity
                        style={{
                          height: 45,
                          backgroundColor: '#2D8E99',
                          justifyContent: 'center',
                          margin: 10,
                          width: 300,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          setModalVisible(false);

                          VerifyCode({
                            verification_code: value,
                            phone_number: PhoneNum,
                          })
                            .then((res: any) => {
                              if (res && res.status === 'success') {
                                setToken(res.token)(dispatch);
                                logged(res.userdata)(dispatch);
                              } else {
                                Alert.alert('Something Went Wrong');
                              }
                            })
                            .catch(() => {});
                        }}>
                        <Text style={styles.textStyle}>Yes, I agree</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          height: 45,
                          backgroundColor: 'lightgrey',
                          justifyContent: 'center',
                          margin: 10,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          setModalVisible(false);
                        }}>
                        <Text style={styles.textStyle}>No,Close </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
