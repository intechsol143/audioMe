import React, {useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';

import {useNavigation} from '@react-navigation/core';
import colors from '@src/constants/colors';

import styles from './styles';
import {useAppDispatch, useAppSelector} from '@src/hooks';
import {editProfile} from '@src/lib/api';
import {logged} from '@src/redux/actions';
import {Loader} from '@src/components';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const {userData, token} = useAppSelector(({USER}) => USER);
  const dispatch = useAppDispatch();

  const [image, setImage] = useState<string | undefined>('');
  const [name, setName] = useState(userData?.name);
  const [number, setNumber] = useState(userData?.phone_number);
  const [loader, setLoader] = useState(false);

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

  const _validate = () => {
    if (!image && !name) {
      return false;
    }
    return true;
  };

  const _editProfile = async () => {
    if (_validate()) {
      try {
        setLoader(true);
        const data = new FormData();
        {
          image &&
            data.append('image', {
              uri: image,
              type: 'image/jpeg',
              name: 'image' + new Date() + '.jpg',
            });
        }
        data.append('name', name);
        const res: any = await editProfile({data, token});
        setLoader(false);
        if (res && res.status === 'success') {
          logged(res.userdata)(dispatch);
          navigation.goBack();
        }
      } catch (error) {
        setLoader(false);
      }
    }
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
      </View>
      <View>
        <Pressable onPress={_selectImage} style={styles.avatarContainer}>
          {image ? (
            <Image style={styles.avatar} source={{uri: image}} />
          ) : userData?.image ? (
            <Image style={styles.avatar} source={{uri: userData?.image}} />
          ) : (
            <Image
              style={styles.avatar}
              source={require('@src/assets/user_placeholder.png')}
            />
          )}
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={{marginBottom: 20}}>
          <Text style={{fontSize: 18}}>Your Name</Text>
          <View style={styles.value}>
            <TextInput
              placeholder={'Update your name'}
              style={{color: colors.black, fontSize: 16}}
              value={name}
              onChangeText={text => setName(text)}
            />
          </View>
        </View>
        {!userData?.phone_number ? (
          <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 18}}>Phone number</Text>
            <View style={styles.value}>
              <TextInput
                placeholder={'Update your phone number'}
                style={{color: colors.black, fontSize: 16}}
                value={number}
                onChangeText={text => setNumber(text)}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
        ) : null}
        <TouchableOpacity onPress={_editProfile} style={styles.button}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
