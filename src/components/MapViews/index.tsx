import React from 'react';
import {View, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export default function MapViewsComp(props) {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <MapView
        // showsUserLocation
        style={{flex: 1}}
        initialRegion={props.region}
        onRegionChangeComplete={props.onRegionChange}
        // initialRegion={{
        //   latitude: props.latitude,
        //   longitude: props.longitude,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(props.latitude),
            longitude: parseFloat(props.longitude),
          }}>
          <Image
            resizeMode="contain"
            source={require('@src/assets/logo.png')}
            style={{height: 50, width: 50}}
          />
        </Marker>
      </MapView>
    </View>
  );
}
