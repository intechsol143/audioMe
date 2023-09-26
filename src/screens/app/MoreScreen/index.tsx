import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import DeleteIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {Loader} from '@src/components';
import {useAppDispatch, useAppSelector} from '@src/hooks';
import {shadow} from '@src/lib';
import {userLogout, deleteAccount} from '@src/lib/api';
import {logoutUser, setSelectedTours} from '@src/redux/actions';
import {MoreNavigationProp} from '@src/utilis/types';
import colors from '@src/constants/colors';

const height = Dimensions.get('window').height;

export default function MoreScreen() {
  const navigation = useNavigation<MoreNavigationProp>();
  const {token} = useAppSelector(({USER}) => USER);
  const dispatch = useAppDispatch();
  const [runner, setRunner] = useState(false);
  const [intervalID, setInterID] = useState();
  const [loader, setLoader] = useState(false);
  // useEffect(() => {
  //   if (runner) {
  //     const interval = setInterval(() => {
  //       console.log('This will run ever second!');
  //     }, 1000);
  //     // return () => clearInterval(interval);
  //   } else {
  //     return () => clearInterval(interval);
  //   }
  // }, []);
  console.log('runner', runner);
  useEffect(() => {
    // console.log(`isRunning changed to: ${state.isRunning}`);

    if (runner) {
      let letintervalID = setInterval(() => {
        console.log('hello');
      }, 5000);
      setInterID(letintervalID);
    } else {
      clearInterval(intervalID);
    }
  }, [runner]);
  console.log('hello');
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
  const accountDeleteAlert = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => _accountDelete()},
      ],
    );
  };
  console.log(token);
  const _accountDelete = async () => {
    try {
      setLoader(true);
      const res: any = await deleteAccount({token});
      setLoader(false);
      console.log('res of delete', res);
      if (res && res.status === 'success') {
        logoutUser()(dispatch);
      }
    } catch (error) {
      console.log('err in delete', error.response.data);
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loader && <Loader loader={loader} />}
      <ImageBackground
        source={require('@src/assets/background.jpg')}
        style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}>
          <View
            style={{
              height: height / 3.5,
              width: '100%',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: height > 700 ? height / 6 : height / 4.5,
                width: 150,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{height: '100%', width: '100%'}}
                source={require('@src/assets/logo.png')}></Image>
            </View>
            <Text
              onPress={() => setRunner(!runner)}
              style={{fontSize: 30, color: 'white'}}>
              Audio Me
            </Text>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              // height: height > 700 ? height / 3.0 : height / 2.0,
              margin: 20,
              paddingVertical: 20,
              borderRadius: 10,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedTours('liked')(dispatch);
                navigation.navigate('MyTours');
              }}
              style={{
                flexDirection: 'row',
                backgroundColor: colors.white,
                height: 50,
                margin: 20,
                marginTop: -2,
                alignContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                ...shadow,
              }}>
              <FontAwesome size={28} style={{marginLeft: 10}} name="heart" />
              <Text style={{fontSize: 18, marginLeft: 15, fontWeight: 'bold'}}>
                Liked Tours
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('Categories')}
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                height: 50,
                marginLeft: 20,
                marginRight: 20,
                alignItems: 'center',
                borderRadius: 5,
                ...shadow,
              }}>
              <MaterialIcons
                size={28}
                style={{marginLeft: 10}}
                name="category"></MaterialIcons>
              <Text style={{fontSize: 18, marginLeft: 15, fontWeight: 'bold'}}>
                Category
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                backgroundColor: colors.white,
                height: 50,
                margin: 20,
                // marginTop: -2,
                alignContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                ...shadow,
              }}>
              <MaterialIcons
                size={28}
                style={{marginLeft: 10}}
                name="rate-review"
              />
              <Text style={{fontSize: 18, marginLeft: 15, fontWeight: 'bold'}}>
                Add Reviews
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={_userLogout}
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                height: 50,
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                alignItems: 'center',
                borderRadius: 5,
                ...shadow,
              }}>
              <SimpleLineIcons
                size={28}
                style={{marginLeft: 10}}
                name="logout"
              />
              <Text style={{fontSize: 18, marginLeft: 15, fontWeight: 'bold'}}>
                Sign out
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={accountDeleteAlert}
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                height: 50,
                marginLeft: 20,
                marginRight: 20,
                marginTop: 20,
                alignItems: 'center',
                borderRadius: 5,
                ...shadow,
              }}>
              <DeleteIcon size={28} style={{marginLeft: 10}} name="delete" />
              <Text style={{fontSize: 18, marginLeft: 15, fontWeight: 'bold'}}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
