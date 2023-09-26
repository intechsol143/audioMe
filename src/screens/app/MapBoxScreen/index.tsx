import React, {useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MapboxGL, {Camera} from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/Entypo';
// import {MapView} from 'react-native-mapbox-direction';
// import Marker from '@rnmapbox/maps';
const id =
  'pk.eyJ1IjoiYnNhY2swMyIsImEiOiJjbDRvcWMzcWgwNTUzM2JvZG81amhwcGxnIn0.Ukcedqq849MYzJoQfWV8cQ';
MapboxGL.setAccessToken(id);

const MapBoxScreen = () => {
  const aLine = {
    type: 'LineString',
    coordinates: [
      [-74.00597, 40.71427],
      [-74.00697, 40.71527],
    ],
  };
  const [show, setShow] = useState(false);
  const [routes, setRoutes] = useState({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.00597, 41.71427],
            [-74.00597, 40.71427],
          ],
        },
      },
    ],
  });
  const coordinates = [-73.98330688476561, 40.76975180901395];
  const coordinat = [-73.00597, 41.71427];
  const AnnotationContent = ({}) => (
    // <View style={styles.touchableContainer}>
    //   <Text>{title}</Text>
    //   <TouchableOpacity style={styles.touchable}>
    //     <Text style={styles.touchableText}>Btn</Text>
    //   </TouchableOpacity>
    // </View>

    <View style={styles.touchableContainer}>
      <Icon name="location-pin" size={20} color="black" />
    </View>
  );
  const route = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [-73.00597, 41.71427],
            [-74.00597, 40.71427],
          ],
        },
      },
    ],
  };
  const getDirection = async () => {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${coordinates[0]},${coordinates[1]};${coordinat[0]},${coordinat[1]}?steps=true&geometries=geojson&access_token=${id}`,
      {method: 'GET'},
    );
    const json = await query.json();
    console.log('json data', json);
    setRoutes(json.routes);
    setTimeout(function () {
      setShow(true);
    }, 1000);
  };
  useEffect(() => {
    // getDirection();
  }, []);
  return (
    <View style={{flex: 1}}>
      {/* {show && ( */}
      <MapboxGL.MapView
        styleURL="mapbox://styles/bsack03/clb6htcz6000015pkqmb4oyxv"
        style={styles.map}
        onPress={event => console.log('event', event)}>
        <Camera centerCoordinate={[-74.00597, 40.71427]} zoomLevel={12} />
        {/* <ShapeSource id="idStreetLayer" shape={aLine}>
        <LineLayer id="idStreetLayer" /> */}
        <MapboxGL.PointAnnotation
          coordinate={[-73.00597, 41.71427]}
          id="pt-ann">
          <AnnotationContent />
        </MapboxGL.PointAnnotation>
        <MapboxGL.PointAnnotation
          coordinate={[-74.00597, 40.71427]}
          id="pt-ann">
          <AnnotationContent />
        </MapboxGL.PointAnnotation>
        <MapboxGL.ShapeSource id="routeSource" shape={route}>
          <MapboxGL.LineLayer id="routeFill" style={{lineColor: 'red'}} />
        </MapboxGL.ShapeSource>
        {/* <MapboxGL.LineLayer
            coordinate={[-74.00597, 40.71427]}
            id="routeFill"
            style={{
              lineColor: '#ff8109',
              lineWidth: 3.2,
              lineCap: MapboxGL.LineJoin.Round,
              lineOpacity: 1.84,
            }}
          /> */}
      </MapboxGL.MapView>
      {/* )} */}
      {/* <MapboxGL.MarkerView coordinate={[-73.00597, 41.71427]}>
        <AnnotationContent title={'this is a marker view'} />
      </MapboxGL.MarkerView>
      <MapboxGL.MarkerView coordinate={[-74.00597, 40.71427]}>
        <AnnotationContent title={'this is a marker view'} />
      </MapboxGL.MarkerView> */}
      {/* <MapboxGL.PointAnnotation
          key={'id'}
          id={'id'}
          title="Test"
          coordinate={[-74.00597, 40.71427]}>
          <Image
            source={require('../../../assets/dp.png')}
            style={{flex: 1, resizeMode: 'contain', width: 25, height: 25}}
          />
        </MapboxGL.PointAnnotation> */}
      {/* <MapboxGL.MarkerView coordinate={[-74.00597, 40.71427]} /> */}
      {/* </ShapeSource> */}
    </View>

    // <MapView
    //   mapBoxApiKey={id}
    //   navigationMode="Course" // Or "Global"
    //   // ref={instance => this.mapRef = instance}
    //   startingPoint={{
    //     latitude: 48.857908,
    //     longitude: 2.302661,
    //   }}
    //   endingPoint={{
    //     latitude: 48.858192,
    //     longitude: 2.294981,
    //   }}
    //   color="green"
    // />
  );
};
export default MapBoxScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
  },
  touchableContainer: {borderColor: 'black', borderWidth: 0, width: 60},
  touchable: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
