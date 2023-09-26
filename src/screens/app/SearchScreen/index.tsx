import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DropDown, Loader, SearchInput, Tour} from '@src/components';
import colors from '@src/constants/colors';
import {useAppDispatch, useAppSelector} from '@src/hooks';
import {shadow} from '@src/lib';
import {getCityName, searchFilterTours} from '@src/lib/api';
import {setUserCity} from '@src/redux/actions';
import {ITourProps, RootStackParamList} from '@src/utilis/types';

interface IToursHeader {
  title: string;
  onPress: () => void;
}

const ToursHeader = (props: IToursHeader) => (
  <View
    style={{
      flexDirection: 'row',
      margin: 10,
      justifyContent: 'space-between',
    }}>
    <Text style={{fontSize: 22, color: colors.accent}}>{props.title}</Text>
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        width: 60,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 5,
        ...shadow,
      }}>
      <Text style={{color: colors.accent}}>See All</Text>
    </TouchableOpacity>
  </View>
);

export default function () {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {token} = useAppSelector(({USER}) => USER);
  const {allCities, userCity} = useAppSelector(({APPSTATE}) => APPSTATE);

  const [value, setValue] = useState(userCity.name);
  const [popular, setPopular] = useState<ITourProps[]>([]);
  const [bestRated, setBestRated] = useState<ITourProps[]>([]);
  const [nearBy, setNearBy] = useState<ITourProps[]>([]);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);
  const [Latitude, setLatitude] = useState(0);
  const [Longitude, setLongitude] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabBarHeiight = useBottomTabBarHeight();
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    cuRRentlocation();
    setCities(allCities.dropdownCities);
  }, []);

  useLayoutEffect(() => {
    if (Latitude && Longitude) {
      (async () => {
        try {
          const res: any = await getCityName({
            lat: Latitude,
            long: Longitude,
          });

          // const currentCity = res.results[0].address_components.filter(
          //   (x: any) =>
          //     x.types.filter((t: any) => t == 'administrative_area_level_2')
          //       .length > 0,
          // )[0].short_name;
          const currentCity = res.results[0].address_components.filter(
            (x: any) => x.types.filter((t: any) => t == 'locality').length > 0,
          )[0].long_name;

          setCityName(currentCity);
          setValue(currentCity.toLowerCase().replace(/\s/g, ''));
        } catch (error) {}
      })();
    }
  }, [Latitude, Longitude]);

  useLayoutEffect(() => {
    if (cities.length && cityName) {
      const foundedCity = cities.find(
        (city: any) =>
          city.label?.toLowerCase().replace(/\s/g, '') ===
          cityName.toLowerCase().replace(/\s/g, ''),
      );
      if (foundedCity) setValue(foundedCity.label);
    }
  }, [cities, cityName]);

  useEffect(() => {
    _searchFilterTours();
  }, [userCity]);

  const cuRRentlocation = async () => {
    await Geolocation.requestAuthorization('whenInUse');

    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const _searchFilterTours = async () => {
    try {
      const data = new FormData();
      data.append('city', userCity.id);

      const res: any = await searchFilterTours({data, token});
      console.log('res of nearby', res);
      setIsRefreshing(false);
      if (res && res.status === 'success') {
        setBestRated(res.bestrated);
        setPopular(res.popular);
        setNearBy(res.nearby);
      }
    } catch (error) {
      setIsRefreshing(false);
      console.log('err', error.response.data);
    }
  };

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    _searchFilterTours();
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  return (
    <SafeAreaView>
      {loader && <Loader loader={loader} />}
      {/* <SearchInput
        value={value != 'AllSearch' ? value : ''}
        onChangeText={text => setValue(text)}
      /> */}
      <DropDownPicker
        open={open}
        value={value}
        items={cities}
        setOpen={setOpen}
        setValue={city => {
          setValue(city);
          const val = city();
          const findCity = allCities.toursCities.find(
            (c: any) =>
              c.name.toLowerCase().replace(/\s/g, '') ===
              val.toLowerCase().replace(/\s/g, ''),
          );
          setUserCity({id: findCity.id, name: val})(dispatch);
        }}
        setItems={setCities}
        placeholder="Select City"
        searchPlaceholderTextColor="gray"
        containerStyle={{
          borderWidth: 0,
          height: 45,
          width: '95%',
          alignSelf: 'center',
        }}
        style={{borderWidth: 0, height: 50}}
      />
      {/* <DropDown value={value} setValue={setValue} /> */}

      <View style={{height: 15}} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: tabBarHeiight * 2,
        }}
        showsVerticalScrollIndicator={false}>
        <ToursHeader
          title="Most Popular"
          onPress={() =>
            navigation.navigate('AllTours', {
              title: 'Most Popular',
              isPopular: true,
              isBestRated: false,
              isNearBy: false,
            })
          }
        />
        <FlatList
          contentContainerStyle={{marginBottom: 20}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={popular}
          renderItem={({item}) => (
            <Tour
              item={item}
              // navigation={navigation}
              isPopular
              image={item.image}
              name={item.name}
              description={item.description}
            />
          )}
        />

        <ToursHeader
          title="Best Rated"
          onPress={() =>
            navigation.navigate('AllTours', {
              title: 'Best Rated',
              isPopular: false,
              isBestRated: true,
              isNearBy: false,
            })
          }
        />
        <FlatList
          contentContainerStyle={{marginBottom: 20}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={bestRated}
          renderItem={({item}) => (
            <Tour
              item={item}
              isBestRated
              image={item.image}
              name={item.name}
              rating={item.rating}
            />
          )}
        />
        <ToursHeader
          title="Nearby"
          onPress={() =>
            navigation.navigate('AllTours', {
              title: 'Nearby',
              isPopular: false,
              isBestRated: false,
              isNearBy: true,
            })
          }
        />
        <FlatList
          contentContainerStyle={{paddingBottom: tabBarHeiight}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={nearBy}
          renderItem={({item}) => (
            <Tour item={item} isNearBy image={item.image} name={item.name} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
