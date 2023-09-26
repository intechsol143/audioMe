import React from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {ITourProps, MoreInfoNavigationProp} from '@src/utilis/types';
import colors from '@src/constants/colors';
import {useNavigation} from '@react-navigation/native';

export default function Tour(props: ITourProps) {
  const {height, width} = useWindowDimensions();
  const navigation = useNavigation<MoreInfoNavigationProp>();

  return (
    <TouchableOpacity
      onPress={() =>
        // console.log('props', props.item)
        navigation.navigate('MoreInfo', {
          Element: props.item,
          search: true,
        })
      }
      // onPress={()}
      style={{
        height: height / 5,
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 5,
        width: width / 3.35,
        overflow: 'hidden',
      }}>
      <ImageBackground
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
        }}
        source={{uri: props.image}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          {props.isBestRated && (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#00E6FF',
                width: 40,
                borderRadius: 5,
                justifyContent: 'center',
                alignContent: 'center',
                margin: 10,
              }}>
              <AntDesign style={{marginTop: 2}} color="yellow" name="star" />
              <Text style={{color: 'white'}}>{props.rating}</Text>
            </View>
          )}
          <View
            style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 15}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                marginLeft: 5,
                color: colors.white,
              }}>
              {props.name}
            </Text>
            {props.isPopular && (
              <Text
                style={{
                  fontSize: 10,
                  marginLeft: 5,
                  marginTop: 3,
                  color: colors.white,
                }}>
                {props.description}
              </Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
