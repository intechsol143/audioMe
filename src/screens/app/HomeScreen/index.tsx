import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import MapboxGL, {Camera} from '@rnmapbox/maps';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useStripe} from '@stripe/stripe-react-native';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {
  DropDown,
  HomeCardItem,
  Loader,
  PaymentError,
  SearchInput,
} from '@src/components';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@src/constants/colors';
import {useAppDispatch, useAppSelector} from '@src/hooks';
import {
  getCityName,
  HomePosts,
  LikePost,
  getToursList,
  PostSearchByCity,
  UpdateLatLong,
  popularTours,
  searchTours,
  confirmPayment,
  createPaymentIntent,
  myToursList,
} from '@src/lib/api';
import {tourCategories, toursTopTabs} from '@src/lib/data';
import {
  HomeNavigationProp,
  ITourTopTab,
  PaymentSheetProps,
} from '@src/utilis/types';
import {dummy, citiesDummyIds, citiesDummy} from '../../../../dummy';
import {setUserCity, online, setdummyData} from '@src/redux/actions';
import styles from './styles';

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const {token, dummyData, onlineState} = useAppSelector(({USER}) => USER);
  const {allCities, userCity} = useAppSelector(({APPSTATE}) => APPSTATE);
  // console.log('dummyData', dummyData);
  const [HomeList, setHomeList] = useState([]);
  const [Latitude, setLatitude] = useState(0);
  const [Longitude, setLongitude] = useState(0);
  const [Places, setPlaces] = useState([]);
  const [Element, setElement] = useState('');

  // console.log('Elemt is this one', Latitude, Longitude);
  const [value, setValue] = useState(userCity.name);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState('');
  const [items2, setItems2] = useState(tourCategories);
  const [showCard, setShowCard] = useState(false);
  const [tourTypeId, setTourTypeId] = useState('1');
  const [coordinates, setCoordinates] = useState([]);
  const [cities, setCities] = useState([]);
  // console.log('cities', cities);
  const [cityName, setCityName] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [tourId, setTourId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isElement, setIsElement] = useState(false);
  const [myTours, setMyTours] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const mapView = useRef(null);
  const tabBarHeiight = useBottomTabBarHeight();
  const {top} = useSafeAreaInsets();
  const {height, width} = useWindowDimensions();
  const dispatch = useAppDispatch();
  console.log('myTours', myTours);
  const id =
    'pk.eyJ1IjoiYnNhY2swMyIsImEiOiJjbDRvcWMzcWgwNTUzM2JvZG81amhwcGxnIn0.Ukcedqq849MYzJoQfWV8cQ';
  MapboxGL.setAccessToken(id);
  const progressListener = (offlineRegion, status) =>
    console.log('progressListener', offlineRegion, status);
  const errorListener = (offlineRegion, err) =>
    console.log('error listner', offlineRegion, err);
  MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);
  useEffect(() => {
    // MapboxGL.offlineManager.createPack(
    //   {
    //     name: 'offlinePack',
    //     // styleURL: 'mapbox://...',
    //     minZoom: 14,
    //     maxZoom: 20,
    //     bounds: [
    //       [73.0479, 33.6844],
    //       [67.0011, 248607],
    //     ],
    //   },
    //   progressListener,
    //   errorListener,
    // );
    // const interval = setInterval(() => {
    getToursList().then(res => {
      // console.log('hello', res);
      setdummyData(res.tour)(dispatch);
    });
    cuRRentlocation();
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);
  useLayoutEffect(() => {
    setCities(allCities.dropdownCities);
  }, []);
  console.log('latitude', Latitude, Longitude);
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

  const list = () => {
    return Places.map((element: any) => {
      return (
        <Marker
          key={`marker-${element.id}`}
          coordinate={{
            latitude: parseFloat(element.latitude),
            longitude: parseFloat(element.longitude),
          }}
          onPress={() => {
            setShowCard(true), setElement(element);
          }}>
          <Image
            resizeMode="contain"
            source={require('@src/assets/logo.png')}
            style={{height: 50, width: 50}}
          />
        </Marker>
      );
    });
  };

  const cuRRentlocation = async () => {
    await Geolocation.requestAuthorization('always');
    Geolocation.getCurrentPosition(
      position => {
        // Alert.alert(JSON.stringify(position.coords.latitude));
        // console.log('latlong', position.coords);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        _updateLatLong(position.coords);
      },
      error => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const _updateLatLong = async (coords: any) => {
    try {
      const data = new FormData();
      data.append('latitude', coords.latitude);
      data.append('longitude', coords.longitude);
      const findCity = allCities.toursCities.find(
        (c: any) =>
          c.name.toLowerCase().replace(/\s/g, '') ===
          userCity.name.toLowerCase().replace(/\s/g, ''),
      );

      if (findCity) {
        // setLatitude(findCity.latitude);
        // setLongitude(findCity.longitude);
        setCoordinates([
          {latitude: findCity.latitude, longitude: findCity.longitude},
        ]);
      } else {
        setCoordinates([
          {latitude: coords.latitude, longitude: coords.longitude},
        ]);
      }

      const res = await UpdateLatLong({
        data,
        token,
      });
    } catch (error) {}
  };

  // https://innovatedbusinessmarketing.com/Green/api/tour-search/

  // useLayoutEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     HomePosts(token)
  //       .then((res: any) => {
  //         if (res && res.status === 'status') {
  //           setHomeList(res.data);
  //         }
  //       })
  //       .catch(error => {});
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  const _popularTours = () => {
    popularTours({id: userCity.id, token})
      .then((res: any) => {
        if (res && res.status === 'success') {
          console.log('Popular responceRRRR');
          setHomeList(res.tour);
          setIsRefreshing(false);
        }
      })
      .catch(error => {
        setIsRefreshing(false);
      });
  };
  console.log('dummyData', dummyData);
  const searchOffline = () => {
    console.log('usercity', userCity);
    const findCities = dummyData.filter(
      item => item.city.name.toLowerCase() === userCity.name.toLowerCase(),
    );
    setHomeList(findCities);
    setIsRefreshing(false);
  };
  useEffect(() => {
    _myToursList();
    if (onlineState) {
      _popularTours();
    } else {
      searchOffline();
    }
    //
    // Alert.alert('popup');
  }, [userCity, isPaid]);

  useEffect(() => {
    searchTours({token})
      .then((res: any) => {
        if (res && res.status === 'success') {
          setPlaces(res.tour);
          // setHomeList(res.tour);
        }
      })
      .catch(error => {});
  }, [userCity, isPaid]);

  useLayoutEffect(() => {
    {
      value == '' || value == 'AllSearch'
        ? HomePosts(token)
            .then((res: any) => {
              if (res && res.status === 'success') {
                // setHomeList(res.data);
              }
            })
            .catch(error => {})
        : PostSearchByCity({Auth: token, city: value})
            .then((res: any) => {
              if (res && res.status === 'success') {
                // setHomeList(res.data);
              }
            })
            .catch(error => {});
    }
  }, [value]);

  const _onLike = async (id: number) => {
    try {
      const data = {
        tour_id: id,
      };

      const res = await LikePost({token, data});
    } catch (error) {}
  };

  const renderItem = ({item}: {item: ITourTopTab}) => {
    return (
      <View
        style={{
          marginTop: 15,
          height: 40,
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => setTourTypeId(item.id)}
          style={{
            height: 40,
            backgroundColor:
              tourTypeId == item.id ? colors.primary : colors.white,
            borderWidth: 0.5,
            margin: 10,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            width: 95,
            borderColor: 'grey',
          }}>
          <Text
            style={{
              color: tourTypeId == item.id ? colors.white : colors.black,
            }}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  useLayoutEffect(() => {
    if (mapView.current) {
      mapView.current.fitToCoordinates(coordinates, {
        edgePadding: {
          right: width / 20,
          bottom: height / 20,
          left: width / 20,
          top: height / 20,
        },
      });
    }
  }, [Latitude, Longitude, coordinates]);

  // useEffect(() => {
  //   let delayDebounceFn: any;
  //   if (zipCode) {
  //     delayDebounceFn = setTimeout(() => {
  //       _userHomeServices();
  //     }, 1500);
  //   } else {
  //     _userHomeServices();
  //   }

  //   return () => clearTimeout(delayDebounceFn);
  // }, [zipCode]);

  const _myToursList = async () => {
    myToursList({token})
      .then((res: any) => {
        if (res && res.status === 'success') {
          setMyTours(res.tour);
          setIsRefreshing(false);
          // setHomeList(res.tour);
        }
      })
      .catch(error => {
        setIsRefreshing(false);
      });
  };

  const _onPurchase = (id: any, isMap) => {
    setTourId(id);
    _createPaymentIntent(id);
    if (isMap) {
      setIsElement(true);
    }
  };

  //Payment setup start from here

  useEffect(() => {
    if (isPaid) {
      _confirmPayment();
    }
  }, [isPaid]);

  const initializePaymentSheet = async (res: PaymentSheetProps) => {
    const {error} = await initPaymentSheet({
      customerId: res.customer_id,
      customerEphemeralKeySecret: res.ephemeralKey,
      paymentIntentClientSecret: res.client_secret,
      merchantDisplayName: 'AudioMe',
      allowsDelayedPaymentMethods: true,
      style: 'alwaysLight',
    });
    if (!error) {
      openPaymentSheet();
    }
  };

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      // Alert.alert(`Error code: ${error.code}`, error.message);
      setIsError(true);
    } else {
      setIsPaid(true);
    }
  };

  const _createPaymentIntent = async (id: number) => {
    try {
      const data = new FormData();
      data.append('tour_id', id);
      setLoader(true);
      const res: any = await createPaymentIntent({data, token});
      setLoader(false);
      if (res && res.status === 'success') {
        setPaymentIntentId(res.payment_Intent_id);
        setCustomerId(res.customer_id);
        initializePaymentSheet(res);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const _confirmPayment = async () => {
    try {
      const data = new FormData();
      data.append('tour_id', tourId);
      const res: any = await confirmPayment({data, token});
      if (res && res.status === 'success') {
        setIsPaid(false);
        if (isElement) {
          setElement({...Element, is_purchased: true});
          setIsElement(false);
        }
      }
    } catch (error) {}
  };

  //Payment setup end here

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    _popularTours();
    _myToursList();
    // and set isRefreshing to false at the end of your callApiMethod()
  };
  // console.log('redux', onlineState);
  return (
    <View style={{flex: 1, marginTop: top + 20}}>
      {/* <Text>{Latitude}</Text> */}
      <View style={{alignItems: 'flex-end', marginRight: 10}}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => online()(dispatch)}>
          <Text style={{marginRight: 5}}>
            {onlineState ? 'Online Mode' : 'Offline Mode'}
          </Text>
          <Icons
            name={onlineState ? 'toggle-switch' : 'toggle-switch-off'}
            color={'black'}
            size={40}
          />
        </TouchableOpacity>
      </View>

      {loader && <Loader loader={loader} />}
      {tourTypeId !== '4' && (
        <>
          <DropDownPicker
            open={open}
            value={value}
            items={onlineState ? cities : citiesDummy.city}
            setOpen={setOpen}
            setValue={city => {
              setValue(city);
              const val = city();
              if (onlineState) {
                const findCity = allCities.toursCities.find(
                  (c: any) =>
                    c.name.toLowerCase().replace(/\s/g, '') ===
                    val.toLowerCase().replace(/\s/g, ''),
                );
                console.log('findCity', findCity);
                if (findCity) {
                  // setLatitude(findCity.latitude);
                  // setLongitude(findCity.longitude);
                  setCoordinates([
                    {
                      latitude: findCity.latitude,
                      longitude: findCity.longitude,
                    },
                  ]);
                }
                setUserCity({id: findCity.id, name: val})(dispatch);
              } else {
                // Alert.alert(citiesDummyIds.dropdownCities.length);
                const findCity = citiesDummyIds.toursCities.find(
                  (c: any) =>
                    c.name.toLowerCase().replace(/\s/g, '') ===
                    val.toLowerCase().replace(/\s/g, ''),
                );
                // Alert.alert(JSON.stringify(findCity.id));
                // Alert.alert(JSON.stringify(citiesDummyIds.toursCities.length));
                // console.log('findCity', findCity);
                if (findCity) {
                  // setLatitude(findCity.latitude);
                  // setLongitude(findCity.longitude);
                  setCoordinates([
                    {
                      latitude: findCity.latitude,
                      longitude: findCity.longitude,
                    },
                  ]);
                }
                setUserCity({id: findCity.id, name: val})(dispatch);
              }
            }}
            // setItems={setCities}
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
        </>
      )}
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={toursTopTabs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      {tourTypeId == '1' && (
        <FlatList
          style={{marginTop: 20}}
          contentContainerStyle={{paddingBottom: tabBarHeiight - 20}}
          showsVerticalScrollIndicator={false}
          data={HomeList}
          renderItem={({item}: any) => (
            <HomeCardItem
              item={item}
              onLike={() => _onLike(item.id)}
              onPurchase={() => _onPurchase(item.id, undefined)}
            />
          )}
          keyExtractor={(_, index) => `tour-${index}`}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
      {/* // 33.53466909857525, 73.05264731264204 */}
      {tourTypeId == '2' && (
        <View
          style={{
            flex: 1,
          }}>
          {/* <DropDownPicker
            open={open2}
            value={value2}
            items={items2}
            setOpen={setOpen2}
            setValue={setValue2}
            setItems={setItems2}
            dropDownDirection={'AUTO'}
            placeholder="Select Category"
            searchPlaceholderTextColor="gray"
            containerStyle={{
              borderWidth: 0,
              height: 45,
              width: '95%',
              alignSelf: 'center',
              margin: 10,
              marginBottom: 20,
            }}
            style={{borderWidth: 0}}
          /> */}
          {Longitude ? (
            <MapboxGL.MapView
              // styleURL={MapboxGL.StyleURL.Satellite}
              // styleURL="mapbox://styles/bsack03/clb6htcz6000015pkqmb4oyxv"
              style={{flex: 1}}
              onPress={event => console.log('event', event)}>
              <MapboxGL.UserLocation />

              <Camera centerCoordinate={[Longitude, Latitude]} zoomLevel={12} />
            </MapboxGL.MapView>
          ) : null}

          {/* <MapView
            maxZoomLevel={15}
            ref={mapView}
            showsUserLocation={true}
            showsMyLocationButton={true}
            provider={PROVIDER_GOOGLE}
            // showsUserLocation
            style={{flex: 1}}
            initialRegion={{
              // latitude: parseFloat(Latitude),
              // longitude: parseFloat(Longitude),
              latitude: parseFloat(coordinates[0].latitude),
              longitude: parseFloat(coordinates[0].longitude),
              latitudeDelta: 0.004,
              longitudeDelta: 0.004,
            }}>
            {value != null && value2 != null && list()}
          </MapView> */}
          {showCard && (
            <TouchableOpacity
              onPress={() => setShowCard(false)}
              style={{
                position: 'absolute',
                height: 480,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                }}>
                <Text style={{color: 'white', fontSize: 18}}>
                  {Element.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <Ionicons name="location-sharp" size={20} color="white" />
                  <Text style={{color: 'white', marginLeft: 5}}>
                    {Element.minutes} Minutes From Here
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white'}}>Price: {Element.price}$</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white'}}>Transportation: </Text>
                  <Text style={{color: 'white'}}>{Element.transportaiton}</Text>
                </View>
                <View style={{alignItems: 'center', marginTop: 10}}>
                  <Image
                    source={{uri: Element.image}}
                    style={{height: 150, width: 150}}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  {Element.price > 0 && Element.is_payment ? (
                    <TouchableOpacity
                      disabled={Element.is_purchased}
                      onPress={() => _onPurchase(Element.id, true)}
                      style={{
                        height: 30,
                        width: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        backgroundColor: 'white',
                      }}>
                      {Element.is_purchased ? (
                        <Text style={{fontSize: 10}}>Purchased</Text>
                      ) : (
                        <Text style={{fontSize: 10}}>Buy Now</Text>
                      )}
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('MoreInfo', {Element})}
                    style={{
                      height: 30,
                      marginLeft: 10,
                      width: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 20,
                      backgroundColor: 'white',
                    }}>
                    <Text style={{fontSize: 10}}>More Info</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      {tourTypeId == '3' && (
        <FlatList
          style={{marginTop: 20}}
          contentContainerStyle={{paddingBottom: tabBarHeiight - 20}}
          showsVerticalScrollIndicator={false}
          data={HomeList}
          renderItem={({item}: any) => (
            <HomeCardItem
              item={item}
              onLike={() => _onLike(item.id)}
              onPurchase={() => _onPurchase(item.id, undefined)}
            />
          )}
          keyExtractor={(_, index) => `tour-${index}`}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
      {tourTypeId == '4' && (
        <FlatList
          style={{marginTop: 20}}
          contentContainerStyle={{paddingBottom: tabBarHeiight - 20}}
          showsVerticalScrollIndicator={false}
          data={myTours}
          renderItem={({item}: any) => (
            <HomeCardItem
              item={item}
              onLike={() => _onLike(item.id)}
              onPurchase={() => _onPurchase(item.id, undefined)}
            />
          )}
          keyExtractor={(_, index) => `tour-${index}`}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
      <PaymentError error={isError} onClose={() => setIsError(false)} />
    </View>
  );
}
