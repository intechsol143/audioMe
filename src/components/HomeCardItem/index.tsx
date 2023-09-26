import React, {cloneElement, useState} from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import colors from '@src/constants/colors';
import {MoreInfoNavigationProp} from '@src/utilis/types';
import {loop} from '../../components/Symbols';
export default function HomeCardItem(props: any) {
  const navigation = useNavigation<MoreInfoNavigationProp>();
  const [isLiked, setIsLiked] = useState(props.item.is_like);

  const filtered = loop.filter(item => item.code === props.item.currency);
  console.log('Helloooo', filtered[0].symbol);

  return (
    <View style={styles.homeCardItem}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>{props.item.name}</Text>
        <TouchableOpacity
          onPress={() => {
            props.onLike();
            setIsLiked(!isLiked);
          }}>
          <AntDesign
            size={20}
            color={colors.red}
            name={isLiked == true ? 'heart' : 'hearto'}
          />
        </TouchableOpacity>
      </View>
      <Pressable
        onPress={() => navigation.navigate('MoreInfo', {Element: props.item})}>
        <Image style={styles.image} source={{uri: props.item.image}} />
      </Pressable>
      <View style={styles.infoContainer}>
        <View>
          <Text style={{color: 'grey'}}>Durations: {props.item.duration}</Text>
          <Text
            numberOfLines={2}
            style={{
              marginTop: 5,
              color: 'grey',
              maxWidth: 200,
            }}>
            Highlights: {props.item.highlights}
          </Text>
          {props.item.price > 0 && props.item.is_payment ? (
            <Text style={{marginTop: 5, color: 'grey'}}>
              Price: {filtered[0].symbol}
              {props.item.price} {props.item.currency}
            </Text>
          ) : null}
        </View>
        <View>
          <View>
            <Text style={{color: 'black', fontWeight: 'bold'}}>
              Transportation:
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginTop: 5,
                  color: 'grey',
                  flex: 1,
                  flexWrap: 'wrap',
                }}>
                {props.item.transportaiton}
              </Text>
            </View>

            <Text style={{marginTop: 5, color: 'grey'}}></Text>
          </View>
        </View>
      </View>
      <View style={styles.btnContainer}>
        {props.item.price > 0 && props.item.is_payment ? (
          <TouchableOpacity
            disabled={props.item.is_purchased}
            onPress={props.onPurchase}
            style={{
              borderWidth: 0.5,
              borderRadius: 5,
              borderColor: 'grey',
              height: 30,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              width: props.item.is_purchased ? 80 : 70,
            }}>
            {props.item.is_purchased ? (
              <Text style={{color: 'grey'}}>Purchased</Text>
            ) : (
              <Text style={{color: 'grey'}}>Buy Now</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View></View>
        )}

        <TouchableOpacity
          style={{
            borderWidth: 0.5,
            borderRadius: 5,
            borderColor: 'grey',
            height: 30,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            width: 70,
          }}
          onPress={() =>
            navigation.navigate('MoreInfo', {Element: props.item})
          }>
          <Text style={{color: 'grey'}}>More info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
