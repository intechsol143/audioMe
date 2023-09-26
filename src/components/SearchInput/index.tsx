import React from 'react';
import {TextInput, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import colors from '@src/constants/colors';
import {shadow} from '@src/lib';
import {InputProps} from '@src/utilis/types';

export default function SearchInput(props: InputProps) {
  return (
    <View
      style={{
        height: 45,
        backgroundColor: 'white',
        margin: 20,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        width: '95%',
        alignSelf: 'center',
        ...shadow,
      }}>
      <FontAwesome
        color="grey"
        style={{marginLeft: 10}}
        size={18}
        name="search"
      />
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        style={{color: colors.black, marginHorizontal: 10, flex: 1}}
        placeholder="Search for Tour Places"
        placeholderTextColor={colors.grey}
        {...props}
      />
    </View>
  );
}
