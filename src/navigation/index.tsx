import React from 'react';
import {useSelector} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  LoginSelectorScreen,
  LoginScreen,
  SignUpScreen,
  AllToursScreen,
  CategoriesScreen,
  CodeVerificationScreen,
  EditProfileScreen,
  MoreInfoScreen,
  SplashScreen,
  MapBoxScreen,
} from '@src/screens';
import {RootStackParamList} from '@src/utilis/types';
import MapScreen from '@src/screens/app/Mapscreen';
import Mapscreenoffline from '@src/screens/app/Mapscreenoffline';
import BottomTabNavigator from './BottomTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const {isLoggedIn} = useSelector(({USER}: any) => USER);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="LoginSelector"
              component={LoginSelectorScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MapBoxScreen"
              component={MapBoxScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CodeVerification"
              component={CodeVerificationScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="SplashScreen"
              options={{headerShown: false}}
              component={SplashScreen}
            />
            <Stack.Screen
              name="HomeTab"
              options={{headerShown: false}}
              component={BottomTabNavigator}
            />
            <Stack.Screen
              name="AllTours"
              component={AllToursScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Categories"
              component={CategoriesScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MoreInfo"
              component={MoreInfoScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{
                title: '',
              }}
            />
            <Stack.Screen
              name="Mapscreenoffline"
              component={Mapscreenoffline}
              options={{
                title: '',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
