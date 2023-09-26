import React from 'react';
import {Text} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '@src/constants/colors';
import {
  HomeScreen,
  MoreScreen,
  MyToursScreen,
  ProfileScreen,
  SearchScreen,
} from '@src/screens';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grey,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? colors.primary : colors.grey,
                fontSize: 12,
              }}>
              Browse
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <Entypo
              name="home"
              color={focused ? colors.primary : colors.grey}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? colors.primary : colors.grey,
                fontSize: 12,
              }}>
              Search
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <FontAwesome
              name="search"
              color={focused ? colors.primary : colors.grey}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyTours"
        component={MyToursScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? colors.primary : colors.grey,
                fontSize: 12,
              }}>
              My Tours
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="download"
              color={focused ? colors.primary : colors.grey}
              size={25}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? colors.primary : colors.grey,
                fontSize: 12,
              }}>
              My Account{' '}
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="person"
              color={focused ? colors.primary : colors.grey}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: focused ? colors.primary : colors.grey,
                fontSize: 12,
              }}>
              More
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name="more"
              color={focused ? colors.primary : colors.grey}
              size={25}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
