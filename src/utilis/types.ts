import {TextInputProps, ViewStyle} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {store} from '@src/redux/store';

export type RootStackParamList = {
  SplashScreen: undefined;
  LoginSelector: undefined;
  SignUp: undefined;
  Login: undefined;
  CodeVerification: {
    PhoneNum: string;
  };
  AllTours: {
    title: string;
    isPopular: boolean;
    isBestRated: boolean;
    isNearBy: boolean;
  };
  HomeTab: undefined;
  Home: undefined;
  Search: undefined;
  MapBoxScreen: undefined;
  MyTours: undefined;
  Profile: undefined;
  More: undefined;
  Categories: undefined;
  MoreInfo: {Element: any};
  EditProfile: undefined;
};

export type SignUpNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

export type CodeVerificationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CodeVerification'
>;
export type CodeVerificationRouteProp = RouteProp<
  RootStackParamList,
  'CodeVerification'
>;

export type HomeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type AllToursNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AllTours'
>;
export type AllToursRouteProp = RouteProp<RootStackParamList, 'AllTours'>;

export type MoreNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'More'
>;

export type MoreInfoNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MoreInfo'
>;

export type ProfileNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

export interface InputProps extends TextInputProps {
  style?: ViewStyle;
  inputStyle?: TextInputProps;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ITourProps {
  name?: string;
  description?: string;
  image: string;
  rating?: number;
  // item: object;
  isPopular?: boolean;
  isBestRated?: boolean;
  search?: boolean;
  isNearBy?: boolean;
}

export interface ITopButtonProps {
  isSelected: boolean;
  title: string;
  onSelect: () => void;
}

export interface IMyTourProps {
  id: number;
  image: string;
  name: string;
  description: string;
  is_purchased: boolean;
  minutes: string;
  onPurchase: () => void;
  onPress: () => void;
}

export type SocialUserData = {
  email: string;
  id: string;
  image: string;
  name: string;
  loginVia: string;
};

export interface ITourTopTab {
  id: string;
  title: string;
}

export type PaymentSheetProps = {
  customer_id: string;
  ephemeralKey: string;
  client_secret: string;
};
