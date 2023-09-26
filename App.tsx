import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {StripeProvider} from '@stripe/stripe-react-native';

import {getCitiesList} from '@src/lib/api';
import RootNavigator from '@src/navigation';
import {setCities} from '@src/redux/actions';
import {persistor, store} from '@src/redux/store';
import {StatusBar} from 'react-native';

export default function App() {
  const dispatch = store.dispatch;

  useEffect(() => {
    SplashScreen.hide();
    _getCitiesList();
  }, []);

  const _getCitiesList = async () => {
    try {
      const res: any = await getCitiesList();

      const newCities = res.cities.map((city: any) => {
        const newCity = {
          label: city.name,
          value: city.name?.toLowerCase().replace(/\s/g, ''),
        };
        return newCity;
      });

      setCities({toursCities: res.cities, dropdownCities: newCities})(dispatch);
    } catch (error) {}
  };

  return (
    <StripeProvider
      publishableKey="pk_live_PQXDida968Nr3zfxdXWM6li1"
      // publishableKey="pk_test_51HpdygAnsSDL7LeEKko1GIAhrQ14ZJs6PeNgAeOsLMfrJbnloRW3V3DNesd9ktS6QzshQwOnt3tHtWvy3hbusOUb00gNoOvFuh"
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </PersistGate>
      </Provider>
    </StripeProvider>
  );
}
