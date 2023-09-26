import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import {useNavigation} from '@react-navigation/native';
import {Loader} from '@src/components';
import {useAppDispatch, useAppSelector} from '@src/hooks';
import {getCityName} from '@src/lib/api';
import {setUserCity} from '@src/redux/actions';

export default function SplashScreen() {
  const {allCities} = useAppSelector(({APPSTATE}) => APPSTATE);
  const [loader, setLoader] = useState(true);
  const [Latitude, setLatitude] = useState(0);
  const [Longitude, setLongitude] = useState(0);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    cuRRentlocation();
    setTimeout(() => {
      setLoader(false);
      navigation.navigate('HomeTab');
    }, 4000);
  }, []);

  useEffect(() => {
    if (Latitude && Longitude && allCities.toursCities.length) {
      (async () => {
        try {
          const res: any = await getCityName({
            lat: Latitude,
            long: Longitude,
          });
          // const userCity = res.results[0].address_components.filter(
          //   (x: any) =>
          //     x.types.filter((t: any) => t == 'administrative_area_level_2')
          //       .length > 0,
          // )[0].short_name;
          const userCity = res.results[0].address_components.filter(
            (x: any) => x.types.filter((t: any) => t == 'locality').length > 0,
          )[0].long_name;

          const findCity = allCities.toursCities.find(
            (c: any) =>
              c.name.toLowerCase().replace(/\s/g, '') ===
              userCity.toLowerCase().replace(/\s/g, ''),
          );

          setUserCity({id: findCity.id, name: userCity})(dispatch);
        } catch (error) {}
      })();
    }
  }, [Latitude, Longitude, allCities]);

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

  return <View>{loader && <Loader loader={loader} />}</View>;
}
