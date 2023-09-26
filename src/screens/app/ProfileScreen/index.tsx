import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {LoginManager} from 'react-native-fbsdk-next';

import {useNavigation} from '@react-navigation/core';
import {Loader} from '@src/components';
import {useAppDispatch, useAppSelector} from '@src/hooks';
import {userLogout} from '@src/lib/api';
import {logoutUser} from '@src/redux/actions';
import {ProfileNavigationProp} from '@src/utilis/types';
import colors from '@src/constants/colors';

import styles from './styles';

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const {userData, token} = useAppSelector(({USER}) => USER);
  const dispatch = useAppDispatch();

  const [loader, setLoader] = useState(false);

  const _userLogout = async () => {
    try {
      setLoader(true);
      const res: any = await userLogout(token);
      setLoader(false);
      if (res && res.status === 'success') {
        logoutUser()(dispatch);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const FBlogOut = () => {
    LoginManager.logOut();
  };

  return (
    <SafeAreaView>
      {loader && <Loader loader={loader} />}
      <View style={styles.top}>
        <AntDesign
          name="arrowleft"
          onPress={() => navigation.goBack()}
          size={25}
          color={colors.black}
        />
        <Feather
          onPress={() => navigation.navigate('EditProfile')}
          name="edit"
          color={colors.black}
          size={20}
        />
      </View>
      <View>
        {userData?.image ? (
          <Image
            style={[styles.avatar, {borderRadius: 50}]}
            source={{uri: userData.image}}
          />
        ) : (
          <Image style={styles.avatar} source={require('@src/assets/dp.png')} />
        )}
      </View>
      <View style={styles.content}>
        <View style={{marginBottom: 20}}>
          <Text style={{fontSize: 18}}>Your Name</Text>
          <View style={styles.value}>
            {userData?.name ? (
              <Text style={{fontSize: 15}}>{userData?.name}</Text>
            ) : (
              <Text style={{fontSize: 15}}>Update your name</Text>
            )}
          </View>
        </View>
        <View style={{marginBottom: 20}}>
          <Text style={{fontSize: 18}}>Phone number</Text>
          <View style={styles.value}>
            {userData?.phone_number ? (
              <Text style={{fontSize: 15}}>{userData.phone_number}</Text>
            ) : (
              <Text style={{fontSize: 15}}>Update phone number</Text>
            )}
          </View>
        </View>
        {/* <View style={{marginBottom: 20}}>
          <Text style={{fontSize: 18}}>Password</Text>
          <View
            style={{
              backgroundColor: colors.white,
              padding: 12,
              borderRadius: 5,
              marginTop: 10,
              ...shadow,
            }}>
            <Text style={{fontSize: 15}}></Text>
          </View>
        </View> */}
        <TouchableOpacity onPress={_userLogout} style={styles.button}>
          <Text style={styles.btnText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
