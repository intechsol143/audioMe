import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useNavigation, useRoute} from '@react-navigation/core';
import {Loader, Tour} from '@src/components';
import colors from '@src/constants/colors';
import {useAppSelector} from '@src/hooks';
import {seeAllToursList} from '@src/lib/api';
import {
  AllToursNavigationProp,
  AllToursRouteProp,
  ITourProps,
} from '@src/utilis/types';

export default function AllToursScreen() {
  const {userCity} = useAppSelector(({APPSTATE}) => APPSTATE);
  const {token} = useAppSelector(({USER}) => USER);

  const navigation = useNavigation<AllToursNavigationProp>();
  const route = useRoute<AllToursRouteProp>();
  const {title, isPopular, isBestRated, isNearBy} = route.params;

  const [allTours, setAllTours] = useState<ITourProps[]>([]);
  const [loader, setLoader] = useState(false);

  const {bottom} = useSafeAreaInsets();

  useEffect(() => {
    _seeAllToursList();
  }, []);

  const _seeAllToursList = async () => {
    try {
      setLoader(true);
      const key = isPopular ? 'popular' : isBestRated ? 'bestrated' : 'nearby';
      const res: any = await seeAllToursList({key, token, cityId: userCity.id});
      setLoader(false);
      if (res && res.status === 'success') {
        setAllTours(res.data);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loader && <Loader loader={loader} />}
      <View style={{height: 50, flexDirection: 'row'}}>
        <Ionicons
          onPress={() => navigation.goBack()}
          style={{marginLeft: 10}}
          size={28}
          name="arrow-back-outline"
        />
        <Text
          style={{
            marginLeft: 20,
            fontSize: 20,
            marginTop: 2,
            color: colors.accent,
          }}>
          {title}
        </Text>
      </View>

      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, paddingBottom: bottom}}
          numColumns={3}
          data={allTours}
          renderItem={({item}) => (
            <Tour
              item={item}
              isPopular={isPopular}
              isBestRated={isBestRated}
              isNearBy={isNearBy}
              image={item.image}
              name={item.name}
              description={item.description}
              rating={item.rating}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
