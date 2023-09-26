import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapboxGL, {Camera} from '@rnmapbox/maps';
import React, {useEffect, useRef, useState} from 'react';
import {getNearistSpot, getPlaces, searchTours} from '@src/lib/api';
import {useAppDispatch, useAppSelector} from '@src/hooks';

import AntDesign from 'react-native-vector-icons/AntDesign';
import BgTask from '@src/components/BgTask';
import Button from '@src/components/Button';
import Feather from 'react-native-vector-icons/Feather';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Entypo';
import MapViewDirections from 'react-native-maps-directions';
import Mapbox from '@rnmapbox/maps';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';
import colors from '@src/constants/colors';
import {lineString as makeLineString} from '@turf/helpers';

let heightHandle = false;
const accessToken =
  'pk.eyJ1IjoiYnNhY2swMyIsImEiOiJjbDRvcWMzcWgwNTUzM2JvZG81amhwcGxnIn0.Ukcedqq849MYzJoQfWV8cQ';
const directionsClient = MapboxDirectionsFactory({accessToken});
const index = ({route, navigation}) => {
  const dispatch = useAppDispatch();
  const {token} = useAppSelector(({USER}) => USER);
  const {allCities, userCity} = useAppSelector(({APPSTATE}) => APPSTATE);
  const {Element} = route.params;
  const [Ele, setEle] = useState('');
  const [isPurchased, setIsPurchased] = useState(Element.is_purchased);
  const [miles, setMiles] = useState(0);
  const [playAudio, setPlayAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const Id = Element.id;
  console.log('Elements of routess', Element.coordinates);
  const [bg, Setbg] = useState(false);
  // const camera = useRef(null);
  // useEffect(() => {
  //   camera.current?.setCamera({
  //     centerCoordinate: [Element.longitude, Element.latitude],
  //   });
  // }, []);
  const [isStart, setIsStart] = useState(false);
  // const [heightHandle, setheightHandle] = useState(false)
  const [OpenHand, setOpenHand] = useState(false);

  const [value, setValue] = useState(userCity.name);
  const [path, setPath] = useState([]);
  const [open2, setOpen2] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [spotsList, setSpotlist] = useState([]);
  const [Lat, setLatitude] = useState(Element.latitude);
  const [Lng, setlLongitude] = useState(Element.longitude);
  const [spot, setSpot] = useState({});
  const [modalId, setmodalId] = useState(null);
  const [PauseTour, setPauseTour] = useState(false);
  const [dontGet, setDontGet] = useState(true);
  const [Mycolors, Setcolors] = useState('1');
  const playerRef = useRef(null);
  const [intrupted, setIntrupted] = useState(false);
  // console.log('element in appsss', Element.id);
  // const progressListener = (offlineRegion, status) =>
  //   console.log('progressListener', offlineRegion, status);
  // const errorListener = (offlineRegion, err) =>
  //   console.log('error listner', offlineRegion, err);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsStart(!isStart);
  //   }, 3000);

  // }, []);
  // useEffect(() => {
  //   MapboxGL.offlineManager.createPack(
  //     {
  //       name: 'offlinePack',
  //       // styleURL: MapboxGL.StyleURL.Street,
  //       styleURL: 'mapbox://styles/bsack03/clah3mdu4000414lcxom7folt',
  //       minZoom: 14,
  //       maxZoom: 20,
  //       bounds: [
  //         [73.0479, 33.6844],
  //         [67.0011, 248607],
  //       ],
  //     },
  //     progressListener,
  //     errorListener,
  //   );
  // }, []);
  const routers = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: Element.coordinates,
          // coordinates: path,
          // coordinates: [
          //   [73.047673, 33.598177],
          //   [73.049329, 33.596909],
          //   [73.051436, 33.595324],
          //   [73.05318, 33.593947],
          //   [73.054901, 33.592593],
          //   [73.054827, 33.592524],
          //   [73.054744, 33.592585],
          //   [73.055621, 33.593383],
          //   [73.0573, 33.594864],
          //   [73.058667, 33.596053],
          //   [73.060243, 33.597469],
          //   [73.061024, 33.598161],
          //   // [JSON.parse(Element.longitude), JSON.parse(Element.latitude)],
          //   // [
          //   //   JSON.parse(Element.end_longitude),
          //   //   JSON.parse(Element.end_latitude),
          //   // ],
          // ],
        },
      },
    ],
  };
  const routes = {
    route: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [JSON.parse(Element.longitude), JSON.parse(Element.latitude)],
              [
                JSON.parse(Element.end_longitude),
                JSON.parse(Element.end_latitude),
              ],
            ],
          },
        },
      ],
    },
  };
  const id =
    'pk.eyJ1IjoiYnNhY2swMyIsImEiOiJjbDRvcWMzcWgwNTUzM2JvZG81amhwcGxnIn0.Ukcedqq849MYzJoQfWV8cQ';

  MapboxGL.setAccessToken(id);
  MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);
  // MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);
  const [value2, setValue2] = useState('');
  // const directionApi = async () => {
  //   console.log('id of app', id);
  //   const query = await fetch(
  //     `https://api.mapbox.com/directions/v5/mapbox/driving/${Element.longitude},${Element.latitude};${Element.end_longitude},${Element.end_latitude}?access_token=${id}`,
  //     {method: 'GET'},
  //   );
  //   const json = await query.json();

  //   const data = json.routes[0];
  //   const route = data.geometry.coordinates;
  //   const geojson = {
  //     type: 'Feature',
  //     properties: {},
  //     geometry: {
  //       type: 'LineString',
  //       coordinates: route,
  //     },
  //   };
  //   console.log('json', route);
  //   return geojson;
  // };
  // console.log('direction', directionApi());
  const startla = '33.5710';
  const startlo = '73.0830';
  const endla = '33.6491';
  const endlo = '73.0833';
  useEffect(() => {
    const fetchRoute = async () => {
      const reqOptions = {
        waypoints: [
          {
            coordinates: [
              JSON.parse(Element.longitude),
              JSON.parse(Element.latitude),
            ],
          },
          {
            coordinates: [
              JSON.parse(Element.end_longitude),
              JSON.parse(Element.end_latitude),
            ],
          },
          // {
          //   coordinates: [
          //     JSON.parse(startla),
          //     JSON.parse(startlo)],
          // },
          // {
          //   coordinates: [JSON.parse(endla), JSON.parse(endlo)],
          // },
        ],
        profile: 'walking',
        geometries: 'geojson',
      };
      const res = await directionsClient.getDirections(reqOptions).send();
      console.log('res of fetch api', res.body.routes[0].geometry.coordinates);

      setPath(res.body.routes[0].geometry.coordinates);
      console.log('route in fetch', res.body.routes[0].geometry.coordinates);
      // const newRoute = makeLineString(res.body.routes[0].geometry.coordinates);
      // setRoute(newRoute);
    };
    setTimeout(() => {
      fetchRoute();
    }, 5000);
  }, []);
  useEffect(() => {
    navigation.setOptions({
      title: Element.name,
      headerTitleStyle: {
        color: '#2D8E99',
      },
      headerBackTitle: '',
      headerTintColor: '#2D8E99',
    });
  }, []);

  useEffect(() => {
    getPlaces({token, Id})
      .then((res: any) => {
        if (res && res.status === 'success') {
          console.log('res of spots', res);
          setSpotlist(res.data);
        }
      })
      .catch(error => {});
  }, []);

  const closePlayerModal = async id => {
    // setheightHandle(true)
    heightHandle = true;

    setmodalId(id);
    setPlayAudio(false);
    setIsSoundPlaying(false);
    setDuration(0);
    setPosition(0);
  };
  const closePlayerModal1 = async id => {
    // setheightHandle(true)

    setmodalId(id);
    setPlayAudio(false);
    setIsSoundPlaying(false);
    setDuration(0);
    setPosition(0);
  };
  var data = [
    {
      code: '0001',
      lat: '1.28210155945393',
      lng: '103.81722480263163',
      location: 'Stop 1',
    },
    {
      code: '0003',
      lat: '1.2777380589964',
      lng: '103.83749709165197',
      location: 'Stop 2',
    },
    {
      code: '0002',
      lat: '1.27832046633393',
      lng: '103.83762574759974',
      location: 'Stop 3',
    },
  ];
  var poslat = 1.28210155945393;
  var poslng = 103.81722480263163;
  const distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  };
  const _getNearistSpot = async coords => {
    try {
      const data = new FormData();
      data.append('latitude', coords.latitude);
      data.append('longitude', coords.longitude);
      data.append('tour_id', Element.id);
      const res: any = await getNearistSpot({token, data});
      console.log('res of arish api1', res);
      if (res && res.status === 'success' && res.spot) {
        setSpot(res.spot);
        setPlayAudio(true);
        //setIsSoundPlaying(true);
      }
    } catch (error) {
      console.log('error in nearest', error.message.data);
    }
  };
  const _getNearistSpot2 = async coords => {
    try {
      const data = new FormData();
      data.append('latitude', coords.latitude);
      data.append('longitude', coords.longitude);
      data.append('tour_id', Element.id);
      const res: any = await getNearistSpot({token, data});
      console.log('res of arish api2', res);
      if (res && res.status === 'success' && res.spot) {
        setSpot(res.spot);
        setPlayAudio(true);
        //setIsSoundPlaying(false);
      }
    } catch (error) {}
  };
  // const watchLocation = async () => {
  //   await Geolocation.requestAuthorization('whenInUse');
  //   Geolocation.watchPosition(
  //     position => {
  //       console.log('postion of current location', position);
  //       // setLatitude(position.coords.latitude);
  //       // setlLongitude(position.coords.longitude);
  //       // // console.log('position 1', position.coords);
  //       // getDistance(position.coords);
  //       // checkPos(position.coords.latitude, position.coords.longitude);

  //       // _getNearistSpot(position.coords);
  //     },
  //     error => {},
  //     {
  //       enableHighAccuracy: true,
  //       // timeout: 15000,
  //       // maximumAge: 10000,
  //     },
  //   );
  // };
  // useEffect(() => {
  //   watchLocation();
  // }, []);
  useEffect(() => {
    // Alert.alert(Element.latitude, Lat);
    // Alert.alert(Lat);

    dontGet && cuRRentlocation();
    // setTimeout(() => {
    const myInterval = setInterval(() => {
      if (heightHandle) {
        setIsSoundPlaying(false);
      } else {
        if (!intrupted) {
          setIsSoundPlaying(true);
        }
      }
      {
        !heightHandle ? cuRRentlocation() : cuRRentlocation2();
      }
    }, 50000);
    return () => clearInterval(myInterval);
    // }, 1000);

    // return () => clearInterval(intervalId)
  }, [isSoundPlaying]);

  // setTimeout(() => {
  //   setIsSoundPlaying(false)
  // }, 1000);
  const cuRRentlocation = async () => {
    console.log('Curent 1...................');
    setDontGet(false);
    await Geolocation.requestAuthorization('whenInUse');
    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setlLongitude(position.coords.longitude);
        console.log('position', position.coords);
        getDistance(position.coords);
        _getNearistSpot(position.coords);
      },
      error => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };
  const cuRRentlocation2 = async () => {
    console.log('Curent 2...................');
    setIsSoundPlaying(false);
    await Geolocation.requestAuthorization('whenInUse');
    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setlLongitude(position.coords.longitude);
        getDistance(position.coords);
        _getNearistSpot2(position.coords);
      },
      error => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };
  async function getDistance(coords) {
    if (coords) {
      try {
        let ApiURL =
          'https://maps.googleapis.com/maps/api/distancematrix/json?';
        let params = `units=imperial&origins=${coords.latitude},${coords.longitude}&destinations=${Element.latitude},${Element.longitude}&key=AIzaSyBC2R0hGR9kjgysDNUsOWHWF_oU0jc6DIg`;
        let finalApiURL = `${ApiURL}${encodeURI(params)}`;
        let response = await fetch(finalApiURL);
        let res = await response.json();
        const meters = res.rows[0].elements[0].distance.value;
        const distance = meters / 1609.344;
        setMiles(parseFloat(miles) + parseFloat(distance));
      } catch (error) {}
    }
  }
  const onEnd = () => {
    setIsSoundPlaying(false);
    setPosition(0);
  };

  const onLoad = ({currentPosition, duration}) => {
    // setVideoLoading(false);
    setPosition(currentPosition);
    setDuration(duration);
  };

  const onProgress = ({currentTime}) => {
    setPosition(currentTime);
  };

  const onSeek = ({seekTime}) => {
    setPosition(seekTime);
  };
  const secondsToHHMMSS = (seconds: number | string) => {
    // credits - https://stackoverflow.com/a/37096512
    seconds = Number(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : '';
    const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:';
    const scnds = s > 0 ? (s < 10 ? `0${s}` : s) : '00';
    return `${hrs}${mins}${scnds}`;
  };
  const toggleSoundPlayback = async () => {
    setIsSoundPlaying(!isSoundPlaying);
    setIntrupted(true);
  };

  const colorHandle = id => {
    Setcolors(id);
  };
  // console.log('spotsList', spotsList);
  const Spotslist = () => {
    return spotsList.map((element: any) => {
      return (
        //   <View style={{borderColor: 'black', borderWidth: 0, width: 60}}>
        //   <Image
        //     resizeMode="contain"
        //     source={require('@src/assets/hostpot.png')}
        //     style={{height: 50, width: 50}}
        //   />
        // </View>
        <MapboxGL.PointAnnotation
          coordinate={[element.longitude, element.latitude]}
          id="pt-ann">
          <TouchableOpacity
            onPress={() => {
              setShowCard(true), setEle(element);
            }}
            style={{borderColor: 'black', borderWidth: 0, width: 60}}>
            <Image
              resizeMode="contain"
              source={require('@src/assets/hostpot.png')}
              style={{height: 50, width: 50}}
            />
          </TouchableOpacity>
        </MapboxGL.PointAnnotation>
        // <View>
        //   <Marker
        //     key={`marker-${element.id}`}
        //     coordinate={{
        //       latitude: parseFloat(element.latitude),
        //       longitude: parseFloat(element.longitude),
        //     }}
        //     onPress={() => {
        //       setShowCard(true), setEle(element);
        //     }}>
        //     <Image
        //       resizeMode="contain"
        //       source={require('@src/assets/hostpot.png')}
        //       style={{height: 50, width: 50}}
        //     />
        //   </Marker>
        // </View>
      );
    });
  };

  const Mark = () => {
    return (
      <View style={{flex: 1}}>
        <Marker
          style={{
            height: 100,
            width: 100,
          }}
          coordinate={{
            latitude: parseFloat(Lat),
            longitude: parseFloat(Lng),
          }}></Marker>
      </View>
    );
  };
  // const AnnotationContent = ({}) => (
  //   // <View style={styles.touchableContainer}>
  //   //   <Text>{title}</Text>
  //   //   <TouchableOpacity style={styles.touchable}>
  //   //     <Text style={styles.touchableText}>Btn</Text>
  //   //   </TouchableOpacity>
  //   // </View>

  // );
  console.log('ids', modalId, spot.id, Mycolors);
  return (
    <View
      style={{
        flex: 1,
      }}>
      {/* <MapView
        maxZoomLevel={100}
        ref={mapView}
        showsUserLocation={true}
        showsMyLocationButton={false}
        provider={PROVIDER_GOOGLE}
        // showsUserLocation

        style={{flex: 1}}
        initialRegion={{
          latitude: Element.latitude,
          longitude: Element.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>

        {/ {Mark()} /}
        {Spotslist()}

        {/ {value != null && value2 != null && list()} /}
      </MapView> */}
      {/* <MapboxGL.MapView
        style={{flex: 1}}
        onPress={event => console.log('event', event)}>
        <Camera centerCoordinate={[Lat, Lng]} zoomLevel={15} />
        <MapboxGL.UserLocation />

        <MapboxGL.PointAnnotation coordinate={[Lat, Lng]} id="pt-ann">
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

      </MapboxGL.MapView> */}

      <MapboxGL.MapView
        // styleURL="mapbox://styles/bsack03/clb6htcz6000015pkqmb4oyxv"
        style={{flex: 1}}>
        <Camera
          centerCoordinate={[
            JSON.parse(Element.longitude),
            JSON.parse(Element.latitude),
          ]}
          zoomLevel={12}
        />
        <MapboxGL.UserLocation />
        {path.length > 0 && (
          <MapboxGL.ShapeSource id="routeSource" shape={routers}>
            <MapboxGL.LineLayer
              id="routeFill"
              style={{
                lineColor: '#2D8E99',
                lineWidth: 3.2,
                lineCap: MapboxGL.LineJoin.Round,
                lineOpacity: 1.84,
              }}
              type="line"
              source="routes"
            />
          </MapboxGL.ShapeSource>
        )}

        {Spotslist()}
      </MapboxGL.MapView>

      {/* <ShapeSource id="idStreetLayer" shape={aLine}>
 <LineLayer id="idStreetLayer" /> */}

      {/* <MapboxGL.PointAnnotation
          coordinate={[-74.00597, 40.71427]}
          id="pt-ann">
          <AnnotationContent />
        </MapboxGL.PointAnnotation> */}
      {/* <MapboxGL.ShapeSource id="routeSource" shape={routes}>
          <MapboxGL.LineLayer id="routeFill" style={{lineColor: 'red'}} />
        </MapboxGL.ShapeSource> */}
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
      <View
        style={{
          flex: 1,
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          paddingHorizontal: 32,
          paddingBottom: 40,
        }}>
        <Button
          onPress={() => {
            colorHandle('1');
            // setPlayAudio(true);
          }}
          Style={{
            height: 40,
            backgroundColor: Mycolors === '1' ? '#2D8E99' : 'grey',
          }}
          title="Play Tour"
        />
        <Button
          title="Pause Tour"
          onPress={() => {
            setPlayAudio(false);

            // closePlayerModal(spot.id);
            // colorHandle('2');
            // Setbg(true);
          }}
          Style={{
            backgroundColor: Mycolors === '2' ? '#2D8E99' : 'grey',
            height: 40,
          }}
        />
      </View>

      {modalId === spot.id || Mycolors === '2' ? null : (
        <Modal
          animationType="slide"
          transparent={true}
          visible={playAudio}
          onRequestClose={() => {
            closePlayerModal(spot.id);
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: colors.primary,
                height: heightHandle == false ? 400 : null,
                borderRadius: 5,
                width: '95%',
                overflow: 'hidden',
              }}>
              <Image
                resizeMode="stretch"
                style={{
                  width: '100%',
                  height: heightHandle == false ? 250 : null,
                }}
                source={{
                  uri: spot.image,
                }}
              />

              <View
                style={{position: 'absolute', top: 10, right: 10, zIndex: 1}}>
                <AntDesign
                  onPress={() => {
                    setPlayAudio(false);
                    closePlayerModal1(spot.id);
                  }}
                  name="closesquare"
                  size={25}
                  color={colors.white}
                />
              </View>

              <Text
                style={{
                  color: colors.white,
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 10,
                }}>
                {spot.name}
              </Text>
              <Text
                onPress={() => {
                  closePlayerModal(spot.id);
                  setIsSoundPlaying(false);

                  // setheightHandle(!heightHandle)
                }}
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  paddingVertical: 4,
                  textAlign: 'center',
                  backgroundColor: 'white',
                  width: 120,
                  alignSelf: 'center',
                }}>
                {'SHOW MAP'}
              </Text>
              <View style={[styles.row1, {marginHorizontal: 20}]}>
                <Pressable
                  disabled={!isPurchased && Element.price > 0}
                  onPress={() => toggleSoundPlayback()}>
                  <Feather
                    name={isSoundPlaying ? 'pause' : 'play'}
                    size={25}
                    color={colors.white}
                  />
                </Pressable>
                <Video
                  ref={playerRef}
                  source={{
                    uri: '/var/mobile/Containers/Data/Application/BAC96BAD-0347-46CA-9AFE-E4B9E2D8B635/Documents/1681713074352.mp3',
                  }}
                  // source={{uri: spot.voice}}
                  paused={!isSoundPlaying}
                  onBuffer={() => {
                    // setVideoLoading(true);
                  }}
                  onEnd={onEnd}
                  onLoad={onLoad}
                  onProgress={onProgress}
                  onSeek={onSeek}
                  repeat={false}
                />
                <Slider
                  style={{width: '80%', height: 40}}
                  value={position}
                  minimumValue={0}
                  maximumValue={duration}
                  thumbTintColor={colors.white}
                  minimumTrackTintColor={colors.green}
                  maximumTrackTintColor={colors.white}
                  onSlidingComplete={value => {
                    playerRef.current?.seek(value);
                  }}
                />

                <Text style={{color: colors.white}}>
                  {secondsToHHMMSS(duration)}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {heightHandle == true ? (
        <View
          style={{
            alignItems: 'center',
            paddingBottom: 100,
            justifyContent: 'flex-end',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              backgroundColor: colors.primary,
              height: 120,
              borderRadius: 5,
              width: '95%',
              flexDirection: 'row',
              overflow: 'hidden',
            }}>
            <Image
              resizeMode="stretch"
              style={{
                width: '40%',
                height: 120,
              }}
              source={{
                uri: spot.image,
              }}
            />
            <View style={{position: 'absolute', top: 10, right: 10, zIndex: 1}}>
              <AntDesign
                onPress={() => {
                  closePlayerModal(spot.id);
                  // setheightHandle(false)
                  heightHandle = false;
                }}
                name="closesquare"
                size={25}
                color={colors.black}
              />
            </View>
            <View style={{marginTop: 50, flex: 1}}>
              <Pressable
                disabled={!isPurchased}
                onPress={() => toggleSoundPlayback()}>
                <Feather
                  name={isSoundPlaying ? 'pause' : 'play'}
                  size={25}
                  color={colors.white}
                />
              </Pressable>
              <Video
                ref={playerRef}
                source={{uri: spot.voice}}
                paused={!isSoundPlaying}
                onBuffer={() => {
                  // setVideoLoading(true);
                }}
                onEnd={onEnd}
                onLoad={onLoad}
                onProgress={onProgress}
                onSeek={onSeek}
                repeat={false}
                playInBackground={true}
                ignoreSilentSwitch="ignore"
              />
              <Slider
                style={{width: '60%', height: 25}}
                value={position}
                minimumValue={0}
                maximumValue={duration}
                thumbTintColor={colors.white}
                minimumTrackTintColor={colors.green}
                maximumTrackTintColor={colors.white}
                onSlidingComplete={value => {
                  playerRef.current?.seek(value);
                }}
              />

              <Text style={{color: colors.white}}>
                {secondsToHHMMSS(duration)}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                alignItems: 'flex-end',
                left: 180,
                top: -10,
              }}>
              <View>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 16,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  {spot.name}
                </Text>
                <Text
                  onPress={() => {
                    heightHandle = false;
                    setPlayAudio(true);
                    setmodalId(null);
                    // setheightHandle(false)
                    // setOpenHand(true)
                  }}
                  style={{
                    color: colors.primary,
                    fontSize: 16,
                    paddingVertical: 0,
                    textAlign: 'center',
                    backgroundColor: 'white',
                    width: 60,
                    alignSelf: 'center',
                  }}>
                  {'OPEN'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
// import {
//   Alert,
//   Image,
//   Modal,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import MapboxGL, {Camera} from '@rnmapbox/maps';
// import React, {useEffect, useRef, useState} from 'react';
// import {getNearistSpot, getPlaces, searchTours} from '@src/lib/api';
// import {useAppDispatch, useAppSelector} from '@src/hooks';

// import AntDesign from 'react-native-vector-icons/AntDesign';
// import BgTask from '@src/components/BgTask';
// import Button from '@src/components/Button';
// import Feather from 'react-native-vector-icons/Feather';
// import Geolocation from 'react-native-geolocation-service';
// import Icon from 'react-native-vector-icons/Entypo';
// import MapViewDirections from 'react-native-maps-directions';
// import Mapbox from '@rnmapbox/maps';
// import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
// import Slider from '@react-native-community/slider';
// import Video from 'react-native-video';
// import colors from '@src/constants/colors';
// import {lineString as makeLineString} from '@turf/helpers';

// let heightHandle = false;
// const accessToken =
//   'pk.eyJ1IjoiYnNhY2swMyIsImEiOiJjbDRvcWMzcWgwNTUzM2JvZG81amhwcGxnIn0.Ukcedqq849MYzJoQfWV8cQ';
// const directionsClient = MapboxDirectionsFactory({accessToken});
// const index = ({route, navigation}) => {
//   const dispatch = useAppDispatch();
//   const {token} = useAppSelector(({USER}) => USER);
//   const {allCities, userCity} = useAppSelector(({APPSTATE}) => APPSTATE);
//   const {Element} = route.params;
//   const [Ele, setEle] = useState('');
//   const [isPurchased, setIsPurchased] = useState(Element.is_purchased);
//   const [miles, setMiles] = useState(0);
//   const [playAudio, setPlayAudio] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isSoundPlaying, setIsSoundPlaying] = useState(true);
//   const [duration, setDuration] = useState(0);
//   const [position, setPosition] = useState(0);
//   const Id = Element.id;
//   console.log('Elements of routess', Element.coordinates);
//   const [bg, Setbg] = useState(false);
//   // const camera = useRef(null);
//   // useEffect(() => {
//   //   camera.current?.setCamera({
//   //     centerCoordinate: [Element.longitude, Element.latitude],
//   //   });
//   // }, []);
//   const [isStart, setIsStart] = useState(false);
//   // const [heightHandle, setheightHandle] = useState(false)
//   const [OpenHand, setOpenHand] = useState(false);

//   const [value, setValue] = useState(userCity.name);
//   const [path, setPath] = useState([]);
//   const [open2, setOpen2] = useState(false);
//   const [showCard, setShowCard] = useState(false);
//   const [spotsList, setSpotlist] = useState([]);
//   const [Lat, setLatitude] = useState(Element.latitude);
//   const [Lng, setlLongitude] = useState(Element.longitude);
//   const [spot, setSpot] = useState({});
//   const [modalId, setmodalId] = useState(null);
//   const [PauseTour, setPauseTour] = useState(false);
//   const [dontGet, setDontGet] = useState(true);
//   const [Mycolors, Setcolors] = useState('1');
//   const playerRef = useRef(null);
//   const [intrupted, setIntrupted] = useState(false);
//   // console.log('element in appsss', Element.id);
//   // const progressListener = (offlineRegion, status) =>
//   //   console.log('progressListener', offlineRegion, status);
//   // const errorListener = (offlineRegion, err) =>
//   //   console.log('error listner', offlineRegion, err);
//   // useEffect(() => {
//   //   setTimeout(() => {
//   //     setIsStart(!isStart);
//   //   }, 3000);

//   // }, []);
//   // useEffect(() => {
//   //   MapboxGL.offlineManager.createPack(
//   //     {
//   //       name: 'offlinePack',
//   //       // styleURL: MapboxGL.StyleURL.Street,
//   //       styleURL: 'mapbox://styles/bsack03/clah3mdu4000414lcxom7folt',
//   //       minZoom: 14,
//   //       maxZoom: 20,
//   //       bounds: [
//   //         [73.0479, 33.6844],
//   //         [67.0011, 248607],
//   //       ],
//   //     },
//   //     progressListener,
//   //     errorListener,
//   //   );
//   // }, []);
//   const routers = {
//     type: 'FeatureCollection',
//     features: [
//       {
//         type: 'Feature',
//         properties: {},
//         geometry: {
//           type: 'LineString',
//           coordinates: Element.coordinates,
//           // coordinates: path,
//           // coordinates: [
//           //   [73.047673, 33.598177],
//           //   [73.049329, 33.596909],
//           //   [73.051436, 33.595324],
//           //   [73.05318, 33.593947],
//           //   [73.054901, 33.592593],
//           //   [73.054827, 33.592524],
//           //   [73.054744, 33.592585],
//           //   [73.055621, 33.593383],
//           //   [73.0573, 33.594864],
//           //   [73.058667, 33.596053],
//           //   [73.060243, 33.597469],
//           //   [73.061024, 33.598161],
//           //   // [JSON.parse(Element.longitude), JSON.parse(Element.latitude)],
//           //   // [
//           //   //   JSON.parse(Element.end_longitude),
//           //   //   JSON.parse(Element.end_latitude),
//           //   // ],
//           // ],
//         },
//       },
//     ],
//   };
//   const routes = {
//     route: {
//       type: 'FeatureCollection',
//       features: [
//         {
//           type: 'Feature',
//           properties: {},
//           geometry: {
//             type: 'LineString',
//             coordinates: [
//               [JSON.parse(Element.longitude), JSON.parse(Element.latitude)],
//               [
//                 JSON.parse(Element.end_longitude),
//                 JSON.parse(Element.end_latitude),
//               ],
//             ],
//           },
//         },
//       ],
//     },
//   };
//   const id =
//     'pk.eyJ1IjoiYnNhY2swMyIsImEiOiJjbDRvcWMzcWgwNTUzM2JvZG81amhwcGxnIn0.Ukcedqq849MYzJoQfWV8cQ';

//   MapboxGL.setAccessToken(id);
//   MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);
//   // MapboxGL.setWellKnownTileServer(MapboxGL.TileServers.Mapbox);
//   const [value2, setValue2] = useState('');
//   // const directionApi = async () => {
//   //   console.log('id of app', id);
//   //   const query = await fetch(
//   //     `https://api.mapbox.com/directions/v5/mapbox/driving/${Element.longitude},${Element.latitude};${Element.end_longitude},${Element.end_latitude}?access_token=${id}`,
//   //     {method: 'GET'},
//   //   );
//   //   const json = await query.json();

//   //   const data = json.routes[0];
//   //   const route = data.geometry.coordinates;
//   //   const geojson = {
//   //     type: 'Feature',
//   //     properties: {},
//   //     geometry: {
//   //       type: 'LineString',
//   //       coordinates: route,
//   //     },
//   //   };
//   //   console.log('json', route);
//   //   return geojson;
//   // };
//   // console.log('direction', directionApi());
//   const startla = '33.5710';
//   const startlo = '73.0830';
//   const endla = '33.6491';
//   const endlo = '73.0833';
//   useEffect(() => {
//     const fetchRoute = async () => {
//       const reqOptions = {
//         waypoints: [
//           {
//             coordinates: [
//               JSON.parse(Element.longitude),
//               JSON.parse(Element.latitude),
//             ],
//           },
//           {
//             coordinates: [
//               JSON.parse(Element.end_longitude),
//               JSON.parse(Element.end_latitude),
//             ],
//           },
//           // {
//           //   coordinates: [
//           //     JSON.parse(startla),
//           //     JSON.parse(startlo)],
//           // },
//           // {
//           //   coordinates: [JSON.parse(endla), JSON.parse(endlo)],
//           // },
//         ],
//         profile: 'walking',
//         geometries: 'geojson',
//       };
//       const res = await directionsClient.getDirections(reqOptions).send();
//       console.log('res of fetch api', res.body.routes[0].geometry.coordinates);

//       setPath(res.body.routes[0].geometry.coordinates);
//       console.log('route in fetch', res.body.routes[0].geometry.coordinates);
//       // const newRoute = makeLineString(res.body.routes[0].geometry.coordinates);
//       // setRoute(newRoute);
//     };
//     setTimeout(() => {
//       fetchRoute();
//     }, 5000);
//   }, []);
//   useEffect(() => {
//     navigation.setOptions({
//       title: Element.name,
//       headerTitleStyle: {
//         color: '#2D8E99',
//       },
//       headerBackTitle: '',
//       headerTintColor: '#2D8E99',
//     });
//   }, []);

//   useEffect(() => {
//     getPlaces({token, Id})
//       .then((res: any) => {
//         if (res && res.status === 'success') {
//           console.log('res of spots', res);
//           setSpotlist(res.data);
//         }
//       })
//       .catch(error => {});
//   }, []);

//   const closePlayerModal = async id => {
//     // setheightHandle(true)
//     heightHandle = true;

//     setmodalId(id);
//     setPlayAudio(false);
//     setIsSoundPlaying(false);
//     setDuration(0);
//     setPosition(0);
//   };
//   const closePlayerModal1 = async id => {
//     // setheightHandle(true)

//     setmodalId(id);
//     setPlayAudio(false);
//     setIsSoundPlaying(false);
//     setDuration(0);
//     setPosition(0);
//   };
//   var data = [
//     {
//       code: '0001',
//       lat: '1.28210155945393',
//       lng: '103.81722480263163',
//       location: 'Stop 1',
//     },
//     {
//       code: '0003',
//       lat: '1.2777380589964',
//       lng: '103.83749709165197',
//       location: 'Stop 2',
//     },
//     {
//       code: '0002',
//       lat: '1.27832046633393',
//       lng: '103.83762574759974',
//       location: 'Stop 3',
//     },
//   ];
//   var poslat = 1.28210155945393;
//   var poslng = 103.81722480263163;
//   const distance = (lat1, lon1, lat2, lon2, unit) => {
//     var radlat1 = (Math.PI * lat1) / 180;
//     var radlat2 = (Math.PI * lat2) / 180;
//     var theta = lon1 - lon2;
//     var radtheta = (Math.PI * theta) / 180;
//     var dist =
//       Math.sin(radlat1) * Math.sin(radlat2) +
//       Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//     if (dist > 1) {
//       dist = 1;
//     }
//     dist = Math.acos(dist);
//     dist = (dist * 180) / Math.PI;
//     dist = dist * 60 * 1.1515;
//     if (unit == 'K') {
//       dist = dist * 1.609344;
//     }
//     if (unit == 'N') {
//       dist = dist * 0.8684;
//     }
//     return dist;
//   };
//   const _getNearistSpot = async coords => {
//     try {
//       const data = new FormData();
//       data.append('latitude', coords.latitude);
//       data.append('longitude', coords.longitude);
//       data.append('tour_id', Element.id);
//       const res: any = await getNearistSpot({token, data});
//       console.log('res of arish api1', res);
//       if (res && res.status === 'success' && res.spot) {
//         setSpot(res.spot);
//         setPlayAudio(true);
//         //setIsSoundPlaying(true);
//       }
//     } catch (error) {
//       console.log('error in nearest', error.message.data);
//     }
//   };
//   const _getNearistSpot2 = async coords => {
//     try {
//       const data = new FormData();
//       data.append('latitude', coords.latitude);
//       data.append('longitude', coords.longitude);
//       data.append('tour_id', Element.id);
//       const res: any = await getNearistSpot({token, data});
//       console.log('res of arish api2', res);
//       if (res && res.status === 'success' && res.spot) {
//         setSpot(res.spot);
//         setPlayAudio(true);
//         //setIsSoundPlaying(false);
//       }
//     } catch (error) {}
//   };
//   // const watchLocation = async () => {
//   //   await Geolocation.requestAuthorization('whenInUse');
//   //   Geolocation.watchPosition(
//   //     position => {
//   //       console.log('postion of current location', position);
//   //       // setLatitude(position.coords.latitude);
//   //       // setlLongitude(position.coords.longitude);
//   //       // // console.log('position 1', position.coords);
//   //       // getDistance(position.coords);
//   //       // checkPos(position.coords.latitude, position.coords.longitude);

//   //       // _getNearistSpot(position.coords);
//   //     },
//   //     error => {},
//   //     {
//   //       enableHighAccuracy: true,
//   //       // timeout: 15000,
//   //       // maximumAge: 10000,
//   //     },
//   //   );
//   // };
//   // useEffect(() => {
//   //   watchLocation();
//   // }, []);
//   useEffect(() => {
//     // Alert.alert(Element.latitude, Lat);
//     // Alert.alert(Lat);

//     dontGet && cuRRentlocation();
//     // setTimeout(() => {
//     const myInterval = setInterval(() => {
//       if (heightHandle) {
//         setIsSoundPlaying(false);
//       } else {
//         if (!intrupted) {
//           setIsSoundPlaying(true);
//         }
//       }
//       {
//         !heightHandle ? cuRRentlocation() : cuRRentlocation2();
//       }
//     }, 50000);
//     return () => clearInterval(myInterval);
//     // }, 1000);

//     // return () => clearInterval(intervalId)
//   }, [isSoundPlaying]);

//   // setTimeout(() => {
//   //   setIsSoundPlaying(false)
//   // }, 1000);
//   const cuRRentlocation = async () => {
//     console.log('Curent 1...................');
//     setDontGet(false);
//     await Geolocation.requestAuthorization('whenInUse');
//     Geolocation.getCurrentPosition(
//       position => {
//         setLatitude(position.coords.latitude);
//         setlLongitude(position.coords.longitude);
//         console.log('position', position.coords);
//         getDistance(position.coords);
//         _getNearistSpot(position.coords);
//       },
//       error => {},
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//       },
//     );
//   };
//   const cuRRentlocation2 = async () => {
//     console.log('Curent 2...................');
//     setIsSoundPlaying(false);
//     await Geolocation.requestAuthorization('whenInUse');
//     Geolocation.getCurrentPosition(
//       position => {
//         setLatitude(position.coords.latitude);
//         setlLongitude(position.coords.longitude);
//         getDistance(position.coords);
//         _getNearistSpot2(position.coords);
//       },
//       error => {},
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//       },
//     );
//   };
//   async function getDistance(coords) {
//     if (coords) {
//       try {
//         let ApiURL =
//           'https://maps.googleapis.com/maps/api/distancematrix/json?';
//         let params = `units=imperial&origins=${coords.latitude},${coords.longitude}&destinations=${Element.latitude},${Element.longitude}&key=AIzaSyBC2R0hGR9kjgysDNUsOWHWF_oU0jc6DIg`;
//         let finalApiURL = `${ApiURL}${encodeURI(params)}`;
//         let response = await fetch(finalApiURL);
//         let res = await response.json();
//         const meters = res.rows[0].elements[0].distance.value;
//         const distance = meters / 1609.344;
//         setMiles(parseFloat(miles) + parseFloat(distance));
//       } catch (error) {}
//     }
//   }
//   const onEnd = () => {
//     setIsSoundPlaying(false);
//     setPosition(0);
//   };

//   const onLoad = ({currentPosition, duration}) => {
//     // setVideoLoading(false);
//     setPosition(currentPosition);
//     setDuration(duration);
//   };

//   const onProgress = ({currentTime}) => {
//     setPosition(currentTime);
//   };

//   const onSeek = ({seekTime}) => {
//     setPosition(seekTime);
//   };
//   const secondsToHHMMSS = (seconds: number | string) => {
//     // credits - https://stackoverflow.com/a/37096512
//     seconds = Number(seconds);
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = Math.floor((seconds % 3600) % 60);

//     const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : '';
//     const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:';
//     const scnds = s > 0 ? (s < 10 ? `0${s}` : s) : '00';
//     return `${hrs}${mins}${scnds}`;
//   };
//   const toggleSoundPlayback = async () => {
//     setIsSoundPlaying(!isSoundPlaying);
//     setIntrupted(true);
//   };

//   const colorHandle = id => {
//     Setcolors(id);
//   };
//   // console.log('spotsList', spotsList);
//   const Spotslist = () => {
//     return spotsList.map((element: any) => {
//       return (
//         //   <View style={{borderColor: 'black', borderWidth: 0, width: 60}}>
//         //   <Image
//         //     resizeMode="contain"
//         //     source={require('@src/assets/hostpot.png')}
//         //     style={{height: 50, width: 50}}
//         //   />
//         // </View>
//         <MapboxGL.PointAnnotation
//           coordinate={[element.longitude, element.latitude]}
//           id="pt-ann">
//           <TouchableOpacity
//             onPress={() => {
//               setShowCard(true), setEle(element);
//             }}
//             style={{borderColor: 'black', borderWidth: 0, width: 60}}>
//             <Image
//               resizeMode="contain"
//               source={require('@src/assets/hostpot.png')}
//               style={{height: 50, width: 50}}
//             />
//           </TouchableOpacity>
//         </MapboxGL.PointAnnotation>
//         // <View>
//         //   <Marker
//         //     key={`marker-${element.id}`}
//         //     coordinate={{
//         //       latitude: parseFloat(element.latitude),
//         //       longitude: parseFloat(element.longitude),
//         //     }}
//         //     onPress={() => {
//         //       setShowCard(true), setEle(element);
//         //     }}>
//         //     <Image
//         //       resizeMode="contain"
//         //       source={require('@src/assets/hostpot.png')}
//         //       style={{height: 50, width: 50}}
//         //     />
//         //   </Marker>
//         // </View>
//       );
//     });
//   };

//   const Mark = () => {
//     return (
//       <View style={{flex: 1}}>
//         <Marker
//           style={{
//             height: 100,
//             width: 100,
//           }}
//           coordinate={{
//             latitude: parseFloat(Lat),
//             longitude: parseFloat(Lng),
//           }}></Marker>
//       </View>
//     );
//   };
//   // const AnnotationContent = ({}) => (
//   //   // <View style={styles.touchableContainer}>
//   //   //   <Text>{title}</Text>
//   //   //   <TouchableOpacity style={styles.touchable}>
//   //   //     <Text style={styles.touchableText}>Btn</Text>
//   //   //   </TouchableOpacity>
//   //   // </View>

//   // );
//   console.log('ids', modalId, spot.id, Mycolors);
//   return (
//     <View
//       style={{
//         flex: 1,
//       }}>

//       <MapboxGL.MapView
//         // styleURL="mapbox://styles/bsack03/clb6htcz6000015pkqmb4oyxv"
//         style={{flex: 1}}>
//         <Camera
//           centerCoordinate={[
//             JSON.parse(Element.longitude),
//             JSON.parse(Element.latitude),
//           ]}
//           zoomLevel={12}
//         />
//         <MapboxGL.UserLocation />
//         {path.length > 0 && (
//           <MapboxGL.ShapeSource id="routeSource" shape={routers}>
//             <MapboxGL.LineLayer
//               id="routeFill"
//               style={{
//                 lineColor: '#2D8E99',
//                 lineWidth: 3.2,
//                 lineCap: MapboxGL.LineJoin.Round,
//                 lineOpacity: 1.84,
//               }}
//               type="line"
//               source="routes"
//             />
//           </MapboxGL.ShapeSource>
//         )}

//         {Spotslist()}
//       </MapboxGL.MapView>

//       <View
//         style={{
//           flex: 1,
//           position: 'absolute',
//           bottom: 0,
//           flexDirection: 'row',
//           justifyContent: 'space-around',
//           width: '100%',
//           paddingHorizontal: 32,
//           paddingBottom: 40,
//         }}>
//         <Button
//           onPress={() => {
//             colorHandle('1');
//             // setPlayAudio(true);
//           }}
//           Style={{
//             height: 40,
//             backgroundColor: Mycolors === '1' ? '#2D8E99' : 'grey',
//           }}
//           title="Play Tour"
//         />
//         <Button
//           title="Pause Tour"
//           onPress={() => {
//             setPlayAudio(false);

//             // closePlayerModal(spot.id);
//             // colorHandle('2');
//             // Setbg(true);
//           }}
//           Style={{
//             backgroundColor: Mycolors === '2' ? '#2D8E99' : 'grey',
//             height: 40,
//           }}
//         />
//       </View>

//       {modalId === spot.id || Mycolors === '2' ? null : (
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={playAudio}
//           onRequestClose={() => {
//             closePlayerModal(spot.id);
//           }}>
//           <View
//             style={{
//               flex: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <View
//               style={{
//                 backgroundColor: colors.primary,
//                 height: heightHandle == false ? 400 : null,
//                 borderRadius: 5,
//                 width: '95%',
//                 overflow: 'hidden',
//               }}>
//               <Image
//                 resizeMode="stretch"
//                 style={{
//                   width: '100%',
//                   height: heightHandle == false ? 250 : null,
//                 }}
//                 source={{
//                   uri: spot.image,
//                 }}
//               />

//               <View
//                 style={{position: 'absolute', top: 10, right: 10, zIndex: 1}}>
//                 <AntDesign
//                   onPress={() => {
//                     setPlayAudio(false);
//                     closePlayerModal1(spot.id);
//                   }}
//                   name="closesquare"
//                   size={25}
//                   color={colors.white}
//                 />
//               </View>

//               <Text
//                 style={{
//                   color: colors.white,
//                   fontSize: 16,
//                   textAlign: 'center',
//                   marginTop: 10,
//                 }}>
//                 {spot.name}
//               </Text>
//               <Text
//                 onPress={() => {
//                   closePlayerModal(spot.id);
//                   setIsSoundPlaying(false);

//                   // setheightHandle(!heightHandle)
//                 }}
//                 style={{
//                   color: colors.primary,
//                   fontSize: 16,
//                   paddingVertical: 4,
//                   textAlign: 'center',
//                   backgroundColor: 'white',
//                   width: 120,
//                   alignSelf: 'center',
//                 }}>
//                 {'SHOW MAP'}
//               </Text>
//               <View style={[styles.row1, {marginHorizontal: 20}]}>
//                 <Pressable
//                   disabled={!isPurchased && Element.price > 0}
//                   onPress={() => toggleSoundPlayback()}>
//                   <Feather
//                     name={isSoundPlaying ? 'pause' : 'play'}
//                     size={25}
//                     color={colors.white}
//                   />
//                 </Pressable>
//                 <Video
//                   ref={playerRef}
//                   source={{uri: spot.voice}}
//                   paused={!isSoundPlaying}
//                   onBuffer={() => {
//                     // setVideoLoading(true);
//                   }}
//                   onEnd={onEnd}
//                   onLoad={onLoad}
//                   onProgress={onProgress}
//                   onSeek={onSeek}
//                   repeat={false}
//                 />
//                 <Slider
//                   style={{width: '80%', height: 40}}
//                   value={position}
//                   minimumValue={0}
//                   maximumValue={duration}
//                   thumbTintColor={colors.white}
//                   minimumTrackTintColor={colors.green}
//                   maximumTrackTintColor={colors.white}
//                   onSlidingComplete={value => {
//                     playerRef.current?.seek(value);
//                   }}
//                 />

//                 <Text style={{color: colors.white}}>
//                   {secondsToHHMMSS(duration)}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       )}

//       {heightHandle == true ? (
//         <View
//           style={{
//             alignItems: 'center',
//             paddingBottom: 100,
//             justifyContent: 'flex-end',
//             backgroundColor: 'transparent',
//           }}>
//           <View
//             style={{
//               backgroundColor: colors.primary,
//               height: 120,
//               borderRadius: 5,
//               width: '95%',
//               flexDirection: 'row',
//               overflow: 'hidden',
//             }}>
//             <Image
//               resizeMode="stretch"
//               style={{
//                 width: '40%',
//                 height: 120,
//               }}
//               source={{
//                 uri: spot.image,
//               }}
//             />
//             <View style={{position: 'absolute', top: 10, right: 10, zIndex: 1}}>
//               <AntDesign
//                 onPress={() => {
//                   closePlayerModal(spot.id);
//                   // setheightHandle(false)
//                   heightHandle = false;
//                 }}
//                 name="closesquare"
//                 size={25}
//                 color={colors.black}
//               />
//             </View>
//             <View style={{marginTop: 50, flex: 1}}>
//               <Pressable
//                 disabled={!isPurchased}
//                 onPress={() => toggleSoundPlayback()}>
//                 <Feather
//                   name={isSoundPlaying ? 'pause' : 'play'}
//                   size={25}
//                   color={colors.white}
//                 />
//               </Pressable>
//               <Video
//                 ref={playerRef}
//                 source={{uri: spot.voice}}
//                 paused={!isSoundPlaying}
//                 onBuffer={() => {
//                   // setVideoLoading(true);
//                 }}
//                 onEnd={onEnd}
//                 onLoad={onLoad}
//                 onProgress={onProgress}
//                 onSeek={onSeek}
//                 repeat={false}
//                 playInBackground={true}
//                 ignoreSilentSwitch="ignore"
//               />
//               <Slider
//                 style={{width: '60%', height: 25}}
//                 value={position}
//                 minimumValue={0}
//                 maximumValue={duration}
//                 thumbTintColor={colors.white}
//                 minimumTrackTintColor={colors.green}
//                 maximumTrackTintColor={colors.white}
//                 onSlidingComplete={value => {
//                   playerRef.current?.seek(value);
//                 }}
//               />

//               <Text style={{color: colors.white}}>
//                 {secondsToHHMMSS(duration)}
//               </Text>
//             </View>
//             <View
//               style={{
//                 position: 'absolute',
//                 alignItems: 'flex-end',
//                 left: 180,
//                 top: -10,
//               }}>
//               <View>
//                 <Text
//                   style={{
//                     color: colors.white,
//                     fontSize: 16,
//                     textAlign: 'center',
//                     marginTop: 10,
//                   }}>
//                   {spot.name}
//                 </Text>
//                 <Text
//                   onPress={() => {
//                     heightHandle = false;
//                     setPlayAudio(true);
//                     setmodalId(null);
//                     // setheightHandle(false)
//                     // setOpenHand(true)
//                   }}
//                   style={{
//                     color: colors.primary,
//                     fontSize: 16,
//                     paddingVertical: 0,
//                     textAlign: 'center',
//                     backgroundColor: 'white',
//                     width: 60,
//                     alignSelf: 'center',
//                   }}>
//                   {'OPEN'}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       ) : null}
//     </View>
//   );
// };

// export default index;

// const styles = StyleSheet.create({});
