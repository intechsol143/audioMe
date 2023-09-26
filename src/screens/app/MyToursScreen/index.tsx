import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {useStripe} from '@stripe/stripe-react-native';

import colors from '@src/constants/colors';
import {useAppDispatch, useAppSelector} from '@src/hooks';
import {shadow} from '@src/lib';
import {
  confirmPayment,
  createPaymentIntent,
  myLikedToursList,
  myToursList,
} from '@src/lib/api';
import {setSelectedTours} from '@src/redux/actions';
import {
  IMyTourProps,
  ITopButtonProps,
  PaymentSheetProps,
} from '@src/utilis/types';
import {Loader, PaymentError} from '@src/components';
import {useNavigation} from '@react-navigation/native';

const TopButton = (props: ITopButtonProps) => (
  <TouchableOpacity
    onPress={props.onSelect}
    style={{
      minWidth: 50,
      padding: 10,
      backgroundColor: props.isSelected ? colors.primary : colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      ...shadow,
    }}>
    <Text style={{color: props.isSelected ? colors.white : colors.grey}}>
      {props.title}
    </Text>
  </TouchableOpacity>
);

const MyTour = (props: IMyTourProps) => (
  <Pressable
    onPress={props.onPress}
    style={{
      backgroundColor: colors.primary,
      marginHorizontal: 15,
      marginBottom: 10,
      borderRadius: 5,
      flexDirection: 'row',
    }}>
    <Image
      style={{
        height: 100,
        backgroundColor: colors.white,
        width: 120,
        margin: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}
      source={{uri: props.image}}
    />
    <View style={{flex: 1}}>
      <Text style={{marginTop: 10, color: colors.white, fontWeight: 'bold'}}>
        {props.name}
      </Text>
      <Text style={{marginTop: 5, color: colors.white}}>
        {props.description}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5,
          marginRight: 5,
        }}>
        <TouchableOpacity
          disabled={props.is_purchased}
          onPress={props.onPurchase}
          style={{
            backgroundColor: colors.white,
            alignItems: 'center',
            borderRadius: 5,
            padding: 5,
          }}>
          {props.is_purchased ? (
            <Text style={{color: colors.grey}}>Purchased</Text>
          ) : (
            <Text style={{color: colors.grey}}>Buy Now</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <FontAwesome color="white" size={20} name="map-marker" />
        <Text style={{marginLeft: 5, color: colors.white}}>
          {props.minutes} Minutes From Here
        </Text>
      </View>
    </View>
  </Pressable>
);

export default function MyToursScreen() {
  const {selectedTours, token} = useAppSelector(({APPSTATE, USER}) => ({
    ...APPSTATE,
    ...USER,
  }));

  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  // const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [data, setData] = useState<IMyTourProps[]>([]);
  const [loader, setLoader] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [tourId, setTourId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log('data', data);
  useEffect(() => {
    if (selectedTours === 'all') {
      _myToursList();
    } else if (selectedTours === 'downloaded') {
      _myToursList();
    } else {
      _myLikedToursList();
    }
  }, [selectedTours, isPaid]);

  //give key to api so it can find data according like all, download and liked
  const _myToursList = async () => {
    myToursList({token})
      .then((res: any) => {
        setIsRefreshing(false);
        if (res && res.status === 'success') {
          setData(res.tour);

          // setHomeList(res.tour);
        }
      })
      .catch(error => {
        setIsRefreshing(false);
      });
  };

  const _myLikedToursList = async () => {
    try {
      const res: any = await myLikedToursList(token);
      setIsRefreshing(false);
      if (res && res.status === 'success') {
        setData(res.data);
      }
    } catch (error) {
      setIsRefreshing(false);
    }
  };

  const _onPurchase = (id: any) => {
    setTourId(id);
    _createPaymentIntent(id);
  };

  //Payment setup start from here

  useEffect(() => {
    if (isPaid) {
      _confirmPayment();
    }
  }, [isPaid]);

  // const initializePaymentSheet = async (res: PaymentSheetProps) => {
  //   const {error} = await initPaymentSheet({
  //     customerId: res.customer_id,
  //     customerEphemeralKeySecret: res.ephemeralKey,
  //     paymentIntentClientSecret: res.client_secret,
  //     merchantDisplayName: 'AudioMe',
  //     allowsDelayedPaymentMethods: true,
  //     style: 'alwaysLight',
  //   });
  //   if (!error) {
  //     openPaymentSheet();
  //   }
  // };

  // const openPaymentSheet = async () => {
  //   const {error} = await presentPaymentSheet();

  //   if (error) {
  //     // Alert.alert(`Error code: ${error.code}`, error.message);
  //     setIsError(true);
  //   } else {
  //     setIsPaid(true);
  //   }
  // };

  // const _createPaymentIntent = async (id: number) => {
  //   try {
  //     const data = new FormData();
  //     data.append('tour_id', id);
  //     setLoader(true);

  //     const res: any = await createPaymentIntent({data, token});
  //     setLoader(false);
  //     if (res && res.status === 'success') {
  //       initializePaymentSheet(res);
  //     }
  //   } catch (error) {
  //     setLoader(false);
  //   }
  // };

  const _confirmPayment = async () => {
    try {
      const data = new FormData();
      data.append('tour_id', tourId);
      const res: any = await confirmPayment({data, token});

      if (res && res.status === 'success') {
        setIsPaid(false);
      }
    } catch (error) {}
  };

  //Payment setup end here

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    if (selectedTours === 'all') {
      _myToursList();
    } else if (selectedTours === 'downloaded') {
      _myToursList();
    } else {
      _myLikedToursList();
    }
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loader && <Loader loader={loader} />}
      <View
        style={{
          flexDirection: 'row',
          height: 80,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 15,
        }}>
        <TopButton
          title="All"
          isSelected={selectedTours === 'all' ? true : false}
          onSelect={() => {
            setSelectedTours('all')(dispatch);
            _myToursList();
          }}
        />
        <TopButton
          // title="Downloaded"
          title="Purchased Tours"
          isSelected={selectedTours === 'downloaded' ? true : false}
          onSelect={() => {
            setSelectedTours('downloaded')(dispatch);
            _myToursList();
          }}
        />
        <TopButton
          title="Liked Tours"
          isSelected={selectedTours === 'liked' ? true : false}
          onSelect={() => setSelectedTours('liked')(dispatch)}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({item}) => (
          <MyTour
            onPress={() => navigation.navigate('MoreInfo', {Element: item})}
            id={item.id}
            image={item.image}
            name={item.name}
            description={item.description}
            minutes={item.minutes}
            is_purchased={item.is_purchased}
            onPurchase={() => _onPurchase(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
      <PaymentError error={isError} onClose={() => setIsError(false)} />
    </SafeAreaView>
  );
}
