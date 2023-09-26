// import React, {useEffect, useRef, useState} from 'react';
// import {
//   Alert,
//   Image,
//   Modal,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import Swiper from 'react-native-swiper';
// import TrackPlayer, {
//   Capability,
//   State,
//   usePlaybackState,
//   useProgress,
// } from 'react-native-track-player';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import Video from 'react-native-video';

// import Slider from '@react-native-community/slider';
// import {useNavigation, useRoute} from '@react-navigation/core';
// import {Loader, PaymentError} from '@src/components';
// import colors from '@src/constants/colors';
// import {useAppSelector} from '@src/hooks';
// import {
//   confirmPayment,
//   createPaymentIntent,
//   getNearistSpot,
//   LikePost,
// } from '@src/lib/api';
// import {PaymentSheetProps} from '@src/utilis/types';
// import {useStripe} from '@stripe/stripe-react-native';
// import Button from '@src/components/Button';

// export default function MoreInfoScreen({route}) {
//   const {token, onlineState} = useAppSelector(({USER}) => USER);

//   // const route = useRoute();
//   const {Element, search} = route.params;

//   console.log('My element', Element);

//   const [miles, setMiles] = useState(0);
//   const [playAudio, setPlayAudio] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isSoundPlaying, setIsSoundPlaying] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [position, setPosition] = useState(0);
//   const [spot, setSpot] = useState({});
//   const [isPurchased, setIsPurchased] = useState(Element?.is_purchased);
//   const [loader, setLoader] = useState(false);
//   const [isPaid, setIsPaid] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [isLiked, setIsLiked] = useState(Element?.is_like);
//   const [modalId, setmodalId] = useState(null);
//   const [payTour, setpayTour] = useState(false);
//   const navigation = useNavigation();
//   const {initPaymentSheet, presentPaymentSheet} = useStripe();
//   // console.log('My is purchase', isPurchased);
//   const playerRef = useRef(null);

//   const setupIfNecessary = async () => {
//     // if app was relaunched and music was already playing, we don't setup again.
//     await TrackPlayer.setupPlayer({});
//     await TrackPlayer.updateOptions({
//       stopWithApp: true,
//       capabilities: [
//         Capability.Play,
//         Capability.Pause,
//         Capability.SkipToNext,
//         Capability.SkipToPrevious,
//         Capability.Stop,
//       ],
//       compactCapabilities: [Capability.Play, Capability.Pause],
//     });

//     await TrackPlayer.add({
//       url: search === true ? Element?.voice : Element?.sound,
//       title: 'Pure (Demo)',
//       artist: 'David Chavez',
//       id: '1',
//     });
//   };

//   const togglePlayback = async (playbackState: State) => {
//     if (playbackState !== State.Playing) {
//       setIsPlaying(true);
//       await TrackPlayer.play();
//     } else {
//       setIsPlaying(false);
//       await TrackPlayer.pause();
//     }
//   };

//   // console.log("playbackStateplaybackState",playbackState)
//   const toggleSoundPlayback = async () => {
//     setIsSoundPlaying(!isSoundPlaying);
//     await TrackPlayer.pause();
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

//   const playbackState = usePlaybackState();
//   const progress = useProgress();

//   useEffect(() => {
//     setupIfNecessary();
//     cuRRentlocation();

//     return () => {
//       (async () => {
//         await TrackPlayer.stop();
//         setIsSoundPlaying(false);
//       })();
//     };
//   }, []);

//   // useEffect(() => {
//   //   const intervalId = setInterval(() => {
//   //     cuRRentlocation();
//   //   }, 15000);

//   //   return () => clearInterval(intervalId);
//   // }, []);

//   const cuRRentlocation = async () => {
//     await Geolocation.requestAuthorization('whenInUse');
//     Geolocation.getCurrentPosition(
//       position => {
//         // console.log('postions are here', position);
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

//   const closePlayerModal = async id => {
//     setmodalId(id);
//     setPlayAudio(false);
//     setIsSoundPlaying(false);
//     setDuration(0);
//     setPosition(0);
//   };

//   const _getNearistSpot = async coords => {
//     try {
//       const data = new FormData();
//       data.append('latitude', coords.latitude);
//       data.append('longitude', coords.longitude);
//       data.append('tour_id', Element.id);
//       const res: any = await getNearistSpot({token, data});
//       if (res && res.status === 'success' && res.spot) {
//         setSpot(res.spot);
//         setPlayAudio(true);
//       }
//     } catch (error) {}
//   };

//   // video controls
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

//   const _onPurchase = () => {
//     _createPaymentIntent();
//   };

//   //Payment setup start from here

//   useEffect(() => {
//     if (isPaid) {
//       _confirmPayment();
//     }
//   }, [isPaid]);

//   const initializePaymentSheet = async (res: PaymentSheetProps) => {
//     const {error} = await initPaymentSheet({
//       customerId: res.customer_id,
//       customerEphemeralKeySecret: res.ephemeralKey,
//       paymentIntentClientSecret: res.client_secret,
//       merchantDisplayName: 'AudioMe',
//       allowsDelayedPaymentMethods: true,
//       style: 'alwaysLight',
//     });
//     if (!error) {
//       openPaymentSheet();
//     }
//   };

//   const openPaymentSheet = async () => {
//     const {error} = await presentPaymentSheet();

//     if (error) {
//       // Alert.alert(`Error code: ${error.code}`, error.message);
//       setIsError(true);
//     } else {
//       setIsPaid(true);
//     }
//   };

//   const _createPaymentIntent = async () => {
//     // console.log('came here');
//     try {
//       const data = new FormData();
//       data.append('tour_id', Element.id);
//       setLoader(true);
//       const res: any = await createPaymentIntent({data, token});

//       // console.log('res of payment', res);
//       setLoader(false);
//       if (res && res.status === 'success') {
//         initializePaymentSheet(res);
//       }
//     } catch (error) {
//       // console.log('error i payment', error);
//       setLoader(false);
//     }
//   };

//   const _confirmPayment = async () => {
//     try {
//       const data = new FormData();
//       data.append('tour_id', Element.id);
//       const res: any = await confirmPayment({data, token});
//       // console.log('res of payment', res);
//       if (res && res.status === 'success') {
//         setIsPaid(false);
//         setIsPurchased(true);
//       }
//     } catch (error) {}
//   };

//   const _onLike = async (id: number) => {
//     try {
//       const data = {
//         tour_id: id,
//       };
//       await LikePost({token, data});
//     } catch (error) {}
//   };

//   // console.log('Eleemnt is purchase', Element.price);

//   return (
//     <SafeAreaView style={styles.main}>
//       {loader && <Loader loader={loader} />}
//       <View style={styles.top}>
//         <AntDesign
//           name="arrowleft"
//           onPress={() => navigation.goBack()}
//           size={25}
//           color={colors.black}
//         />
//         <Button title={'Review Us'} onPress={() => Alert.alert('Pending...')} />
//       </View>
//       <View style={styles.imgView}>
//         <Swiper
//           style={{backgroundColor: 'white', marginTop: 10}}
//           autoplay={true}
//           dotColor="white"
//           activeDotColor={colors.primary}
//           dotStyle={{height: 15, top: 50, width: 15, borderRadius: 10}}
//           activeDotStyle={{height: 15, top: 50, width: 15, borderRadius: 10}}>
//           <View style={{flex: 1}}>
//             <Image
//               source={{uri: Element.image}}
//               style={{width: '100%', height: '100%'}}
//             />
//           </View>
//           {/* <View style={{flex: 1}}>
//             <Image
//               resizeMode={'contain'}
//               source={require('@src/assets/logo.png')}
//               style={{width: '100%', height: '100%'}}
//             />
//           </View> */}
//         </Swiper>
//         <TouchableOpacity
//           style={{position: 'absolute', right: 5, bottom: -10}}
//           onPress={() => {
//             _onLike(Element.id);
//             setIsLiked(!isLiked);
//           }}>
//           <AntDesign
//             size={20}
//             color={colors.red}
//             name={isLiked == true ? 'heart' : 'hearto'}
//           />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         style={styles.info}
//         contentContainerStyle={{
//           alignItems: 'center',
//           paddingBottom: Element.image2 && Element.aboutus ? 400 : 0,
//         }}>
//         <View style={styles.space}>
//           <View style={styles.center}>
//             <Text>{Element.kilometer}</Text>
//             <Text>Kilometers</Text>
//           </View>
//           <View style={styles.center}>
//             <Text>{Element.minutes}</Text>
//             <Text>Minutes</Text>
//           </View>
//           <View style={styles.center}>
//             <Text>{Element.stops}</Text>
//             <Text>Audio Points</Text>
//           </View>
//         </View>

//         <View>
//           <Text style={styles.text}>{Element.name}</Text>
//         </View>
//         <View style={styles.row}>
//           {/* <View style={styles.center}>
//             <Text>{Element.kilometer}</Text>
//             <Text>Kilometers</Text>
//           </View> */}
//           {Element.price > 0 ? (
//             <TouchableOpacity
//               onPress={_onPurchase}
//               disabled={isPurchased}
//               style={{
//                 backgroundColor: colors.primary,
//                 borderRadius: 5,
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignItems: 'center',
//                 paddingHorizontal: 12,
//                 paddingVertical: 5,
//                 marginLeft: 10,
//               }}>
//               {isPurchased ? (
//                 <Text style={{color: colors.white}}>Purchased</Text>
//               ) : (
//                 <Text style={{color: colors.white}}>Buy Now</Text>
//               )}
//             </TouchableOpacity>
//           ) : null}
//         </View>
//         <View style={{alignSelf: 'flex-start'}}>
//           <Text style={[styles.text, {fontSize: 14}]}>Highlights: </Text>
//           <Text> {Element.highlights}</Text>
//         </View>

//         <View style={styles.bottomOne}>
//           <View style={styles.innder}>
//             <Text style={{color: 'white', top: 10, fontSize: 16}}>
//               {Element.description}
//             </Text>

//             {/* <Text style={{color: 'white', fontSize: 16}}>Tour Overview</Text> */}
//           </View>

//           <View style={styles.row1}>
//             <Pressable
//               disabled={Element.price > 0 && !isPurchased}
//               onPress={() => togglePlayback(playbackState)}>
//               <Feather
//                 name={isPlaying ? 'pause' : 'play'}
//                 size={25}
//                 color="white"
//               />
//             </Pressable>
//             <Slider
//               style={{width: 250, height: 40}}
//               value={progress.position}
//               minimumValue={0}
//               maximumValue={progress.duration}
//               thumbTintColor={colors.white}
//               minimumTrackTintColor={colors.green}
//               maximumTrackTintColor={colors.white}
//               onSlidingComplete={async value => {
//                 await TrackPlayer.seekTo(value);
//               }}
//             />

//             <Text style={{color: 'white'}}>
//               {secondsToHHMMSS(progress.duration)}
//             </Text>
//           </View>
//         </View>
//         <View
//           style={{
//             flexDirection: 'row',
//             paddingVertical: 10,
//             width: '100%',
//           }}>
//           <Button
//             Style={{height: 35}}
//             onPress={() => {
//               if (!isPurchased && Element.price > 0) {
//                 setpayTour(true);
//                 toggleSoundPlayback();
//                 setIsPlaying(false);
//               } else {
//                 toggleSoundPlayback();
//                 setIsPlaying(false);
//                 if (onlineState) {
//                   navigation.navigate('Map', {Element});
//                 } else {
//                   navigation.navigate('Mapscreenoffline', {Element});
//                 }
//               }
//             }}
//             title="Start Tour"
//             disabled={false}
//             // disabled={Element.is_purchased != true ? true : false}
//           />
//         </View>
//         {Element.image2 ? (
//           <Image
//             source={{uri: Element.image2}}
//             style={{width: '100%', height: '70%'}}
//           />
//         ) : null}
//         {Element.aboutus ? (
//           <View style={{width: '100%'}}>
//             <Text style={[styles.text, {fontSize: 18}]}>About Tour</Text>
//             <Text style={{marginTop: 10}}>{Element.aboutus}</Text>
//           </View>
//         ) : null}
//       </ScrollView>
//       {/* {modalId === spot.id && Element.is_purchased != true ? null : (
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
//                 height: 400,
//                 borderRadius: 5,
//                 width: '95%',
//                 overflow: 'hidden',
//               }}>
//               <Image
//                 resizeMode="stretch"
//                 style={{
//                   width: '100%',
//                   height: 300,
//                 }}
//                 source={{
//                   uri: spot.image,
//                 }}
//               />

//               <View
//                 style={{position: 'absolute', top: 10, right: 10, zIndex: 1}}>
//                 <AntDesign
//                   onPress={() => closePlayerModal(spot.id)}
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
//               <View style={[styles.row1, {marginHorizontal: 20}]}>
//                 <Pressable
//                   disabled={!isPurchased}
//                   onPress={() => toggleSoundPlayback()}>
//                   <Feather
//                     name={isSoundPlaying ? 'pause' : 'play'}
//                     size={25}
//                     color={colors.white}
//                   />
//                 </Pressable>
//                 {search != true ? (
//                   <Video
//                     ref={playerRef}
//                     source={{uri: spot.voice}}
//                     paused={!isSoundPlaying}
//                     onBuffer={() => {
//                       // setVideoLoading(true);
//                     }}
//                     onEnd={onEnd}
//                     onLoad={onLoad}
//                     onProgress={onProgress}
//                     onSeek={onSeek}
//                     repeat={false}
//                   />
//                 ) : (
//                   <Video
//                     ref={playerRef}
//                     source={{uri: Element.voice}}
//                     paused={!isSoundPlaying}
//                     onBuffer={() => {
//                       // setVideoLoading(true);
//                     }}
//                     onEnd={onEnd}
//                     onLoad={onLoad}
//                     onProgress={onProgress}
//                     onSeek={onSeek}
//                     repeat={false}
//                   />
//                 )}
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
//       )} */}
//       <Modal animationType="slide" transparent={true} visible={payTour}>
//         <View style={{flex: 1, padding: 12, justifyContent: 'center'}}>
//           <View
//             style={{
//               height: 120,
//               alignItems: 'center',
//               justifyContent: 'center',
//               backgroundColor: 'white',
//               borderRadius: 10,
//               elevation: 10,
//             }}>
//             <Text style={{fontSize: 18}}>Must purchase tour to start</Text>
//             <View style={{height: 20}} />
//             <Button title="Ok" onPress={() => setpayTour(false)} />
//           </View>
//         </View>
//       </Modal>
//       <PaymentError error={isError} onClose={() => setIsError(false)} />
//     </SafeAreaView>
//   );
// }
// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//   },
//   top: {
//     // marginLeft: 15,
//     paddingHorizontal: 12,
//     marginTop: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   imgView: {
//     flex: 1,
//   },
//   row1: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   round: {
//     height: 15,
//     marginLeft: 5,
//     width: 15,
//     borderRadius: 10,
//     backgroundColor: 'green',
//   },
//   innder: {
//     alignItems: 'center',
//     width: '100%',
//   },
//   buy: {
//     backgroundColor: '#2D8E99',
//     height: 30,
//     width: 100,

//     marginLeft: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 5,
//   },
//   bottomOne: {
//     marginTop: 20,
//     backgroundColor: '#2D8E99',
//     paddingHorizontal: 20,
//     paddingVertical: 0,
//     borderRadius: 5,
//     width: '100%',
//   },
//   round1: {
//     height: 15,
//     marginLeft: 5,
//     width: 15,
//     borderRadius: 10,
//     backgroundColor: 'white',
//   },
//   space: {
//     flexDirection: 'row',
//     width: '100%',
//     marginTop: 10,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   text: {
//     marginTop: 15,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   center: {
//     alignItems: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   info: {
//     flex: 1,
//     marginTop: 25,

//     paddingHorizontal: 15,
//   },
//   img: {
//     height: '100%',
//     marginTop: 10,
//     width: '100%',
//     borderRadius: 10,
//   },
// });
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  LikePost,
  confirmPayment,
  createPaymentIntent,
  getNearistSpot,
} from '@src/lib/api';
import {Loader, PaymentError} from '@src/components';
import React, {useEffect, useRef, useState} from 'react';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import {useNavigation, useRoute} from '@react-navigation/core';
import RNFetchBlob from 'rn-fetch-blob';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '@src/components/Button';
import Feather from 'react-native-vector-icons/Feather';
import Geolocation from 'react-native-geolocation-service';
import {PaymentSheetProps} from '@src/utilis/types';
import Slider from '@react-native-community/slider';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import colors from '@src/constants/colors';
import {useAppSelector} from '@src/hooks';
import {downloadTour, checkTour} from '@src/lib/api';
import {useStripe} from '@stripe/stripe-react-native';
export default function MoreInfoScreen({route}) {
  const {token, onlineState} = useAppSelector(({USER}) => USER);

  // const route = useRoute();
  const {Element, search} = route.params;

  console.log('My element', Element.id);

  const [miles, setMiles] = useState(0);
  const [playAudio, setPlayAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [spot, setSpot] = useState({});
  const [isPurchased, setIsPurchased] = useState(Element.is_purchased);
  const [loader, setLoader] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLiked, setIsLiked] = useState(Element.is_like);
  const [modalId, setmodalId] = useState(null);
  const [payTour, setpayTour] = useState(false);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  // console.log('My is purchase', isPurchased);
  const playerRef = useRef(null);

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
  const toggleSoundPlayback = async () => {
    setIsSoundPlaying(!isSoundPlaying);
    // setIntrupted(true);
  };
  const toggleSoundPlaybacks = async () => {
    setIsSoundPlaying(false);
    // setIntrupted(true);
  };
  const setupIfNecessary = async () => {
    // if app was relaunched and music was already playing, we don't setup again.
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });

    await TrackPlayer.add({
      url: search === true ? Element.voice : Element.sound,
      title: 'Pure (Demo)',
      artist: 'David Chavez',
      id: '1',
    });
  };

  const togglePlayback = async (playbackState: State) => {
    if (playbackState !== State.Playing) {
      setIsPlaying(true);
      await TrackPlayer.play();
    } else {
      setIsPlaying(false);
      await TrackPlayer.pause();
    }
  };

  // console.log("playbackStateplaybackState",playbackState)
  // const toggleSoundPlayback = async () => {
  //   setIsSoundPlaying(!isSoundPlaying);
  //   await TrackPlayer.pause();
  // };

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

  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    setupIfNecessary();
    cuRRentlocation();

    // return () => {
    //   (async () => {
    //     await TrackPlayer.stop();
    //     setIsSoundPlaying(false);
    //   })();
    // };
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     cuRRentlocation();
  //   }, 15000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const cuRRentlocation = async () => {
    await Geolocation.requestAuthorization('whenInUse');
    Geolocation.getCurrentPosition(
      position => {
        // console.log('postions are here', position);
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

  const closePlayerModal = async id => {
    setmodalId(id);
    setPlayAudio(false);
    setIsSoundPlaying(false);
    setDuration(0);
    setPosition(0);
  };

  const _getNearistSpot = async coords => {
    try {
      const data = new FormData();
      data.append('latitude', coords.latitude);
      data.append('longitude', coords.longitude);
      data.append('tour_id', Element.id);
      const res: any = await getNearistSpot({token, data});
      if (res && res.status === 'success' && res.spot) {
        setSpot(res.spot);
        setPlayAudio(true);
      }
    } catch (error) {}
  };

  // video controls
  // const onEnd = () => {
  //   setIsSoundPlaying(false);
  //   setPosition(0);
  // };

  // const onLoad = ({currentPosition, duration}) => {
  //   // setVideoLoading(false);
  //   setPosition(currentPosition);
  //   setDuration(duration);
  // };

  // const onProgress = ({currentTime}) => {
  //   setPosition(currentTime);
  // };

  // const onSeek = ({seekTime}) => {
  //   setPosition(seekTime);
  // };

  const _onPurchase = () => {
    _createPaymentIntent();
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
  useEffect(() => {
    checkTour({token, tour_id: Element.id})
      .then(res => {
        console.log('res of tour', res);
        if (res.status == 'success') {
          setShow(false);
        }
      })
      .catch(err => {
        console.log('error in tour', err.response.data);
        if (err.response.data.message == 'Not download') {
          setShow(true);
        }
      });
  }, [show]);
  const hitPath = path => {
    downloadTour({token, tour_id: Element.id, local_path: path}).then(res => {
      console.log('res of download tour credentials send', res);
    });
  };
  const downloadFile = async (voice, index) => {
    const {
      dirs: {DownloadDir, DocumentDir},
    } = RNFetchBlob.fs;
    const {config} = RNFetchBlob;
    const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
    hitPath(aPath);
    const fPath = aPath + '/' + voice;
    console.log('aPath', DocumentDir);
    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        notification: true,
      },

      android: {
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: fPath,
          description: 'Downloading xlsx...',
        },
      },
    });
    config(configOptions)
      .fetch('GET', voice)
      .then(res => {
        console.log('res of download data', res.path());
        if (index + 1 == Element.post.length) {
          Alert.alert('Tour downloaded');
        }
        setTimeout(() => {}, 300);
      });
  };

  const downloadImage = async image => {
    const {
      dirs: {DownloadDir, DocumentDir},
    } = RNFetchBlob.fs;
    const {config} = RNFetchBlob;
    const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
    const fPath = aPath + '/' + image;

    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        notification: true,
      },

      android: {
        fileCache: false,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: fPath,
          description: 'Downloading xlsx...',
        },
      },
    });
    config(configOptions)
      .fetch('GET', image)
      .then(res => {
        console.log('res of download data', res.path());
        // if (index + 1 == Element.post.length) {
        //   Alert.alert('Tour downloaded');
        // }
        setTimeout(() => {}, 300);
      });
  };
  const downloadFiles = () => {
    Element.post.map((item, index) => {
      downloadFile(item.voice, index);
    });
  };
  const downloadImages = () => {
    Element.post.map(item => {
      downloadImage(item.image);
    });
  };

  const _createPaymentIntent = async () => {
    // console.log('came here');
    try {
      const data = new FormData();
      data.append('tour_id', Element.id);
      setLoader(true);
      const res: any = await createPaymentIntent({data, token});

      // console.log('res of payment', res);
      setLoader(false);
      if (res && res.status === 'success') {
        initializePaymentSheet(res);
      }
    } catch (error) {
      // console.log('error i payment', error);
      setLoader(false);
    }
  };

  const _confirmPayment = async () => {
    try {
      const data = new FormData();
      data.append('tour_id', Element.id);
      const res: any = await confirmPayment({data, token});
      // console.log('res of payment', res);
      if (res && res.status === 'success') {
        setIsPaid(false);
        setIsPurchased(true);
      }
    } catch (error) {}
  };

  const _onLike = async (id: number) => {
    try {
      const data = {
        tour_id: id,
      };
      await LikePost({token, data});
    } catch (error) {}
  };

  // console.log('Eleemnt is purchase', Element.price);

  return (
    <SafeAreaView style={styles.main}>
      {loader && <Loader loader={loader} />}
      <View style={styles.top}>
        <AntDesign
          name="arrowleft"
          onPress={() => navigation.goBack()}
          size={25}
          color={colors.black}
        />
        <Button title={'Review Us'} onPress={() => Alert.alert('Pending...')} />
      </View>
      <View style={styles.imgView}>
        <Swiper
          style={{backgroundColor: 'white', marginTop: 10}}
          autoplay={true}
          dotColor="white"
          activeDotColor={colors.primary}
          dotStyle={{height: 15, top: 50, width: 15, borderRadius: 10}}
          activeDotStyle={{height: 15, top: 50, width: 15, borderRadius: 10}}>
          <View style={{flex: 1}}>
            <Image
              source={{uri: Element.image}}
              style={{width: '100%', height: '100%'}}
            />
          </View>
          {/* <View style={{flex: 1}}>
            <Image
              resizeMode={'contain'}
              source={require('@src/assets/logo.png')}
              style={{width: '100%', height: '100%'}}
            />
          </View> */}
        </Swiper>
        <TouchableOpacity
          style={{position: 'absolute', right: 5, bottom: -10}}
          onPress={() => {
            _onLike(Element.id);
            setIsLiked(!isLiked);
          }}>
          <AntDesign
            size={20}
            color={colors.red}
            name={isLiked == true ? 'heart' : 'hearto'}
          />
        </TouchableOpacity>
        {show && (
          <TouchableOpacity
            style={{position: 'absolute', left: 10, bottom: -10}}
            onPress={() => {
              downloadImages();
              downloadFiles();
              setShow(false);
            }}>
            <AntDesign size={20} color={colors.primary} name={'download'} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.info}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: Element.image2 && Element.aboutus ? 400 : 0,
        }}>
        <View style={styles.space}>
          <View style={styles.center}>
            <Text>{Element.kilometer}</Text>
            <Text>Kilometers</Text>
          </View>
          <View style={styles.center}>
            <Text>{Element.minutes}</Text>
            <Text>Minutes</Text>
          </View>
          <View style={styles.center}>
            <Text>{Element.stops}</Text>
            <Text>Audio Points</Text>
          </View>
        </View>

        <View>
          {/* <Image
            style={{width: 50, height: 50}}
            source={{
              uri: 'file:///var/mobile/Containers/Data/Application/277EDB10-9F95-4F95-BC62-4A6BC6B03F10/Documents/https://audiome.ca/app/public/post/image/1681802811.png',
            }}
          /> */}
          <Text style={styles.text}>{Element.name}</Text>
        </View>
        <View style={styles.row}>
          {/* <View style={styles.center}>
            <Text>{Element.kilometer}</Text>
            <Text>Kilometers</Text>
          </View> */}
          {/* <TextInput
            placeholder="Promo Code"
            placeholderTextColor={'grey'}
            style={{
              height: 50,
              width: '65%',
              borderRadius: 10,
              paddingHorizontal: 10,
              marginRight: 5,
              color: 'black',
              borderColor: 'grey',
              borderWidth: 1,
            }}
          /> */}
          {Element.price > 0 && Element.is_payment ? (
            <TouchableOpacity
              onPress={_onPurchase}
              disabled={isPurchased}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 5,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 5,
                marginLeft: 10,
              }}>
              {isPurchased ? (
                <Text style={{color: colors.white}}>Purchased</Text>
              ) : (
                <Text style={{color: colors.white}}>Buy Now</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{alignSelf: 'flex-start'}}>
          <Text style={[styles.text, {fontSize: 14}]}>Highlights: </Text>
          <Text> {Element.highlights}</Text>
        </View>

        <View style={styles.bottomOne}>
          <View style={styles.innder}>
            <Text style={{color: 'white', top: 10, fontSize: 16}}>
              {Element.description}
            </Text>

            {/* <Text style={{color: 'white', fontSize: 16}}>Tour Overview</Text>  */}
          </View>

          <View style={styles.row1}>
            <Pressable
              // disabled={Element.price > 0 && !isPurchased}
              onPress={() => toggleSoundPlayback()}>
              <Feather
                name={isSoundPlaying ? 'pause' : 'play'}
                size={25}
                color="white"
              />
            </Pressable>

            <Video
              ref={playerRef}
              source={{uri: search === true ? Element.voice : Element.sound}}
              paused={!isSoundPlaying}
              onEnd={onEnd}
              onLoad={onLoad}
              onProgress={onProgress}
              onSeek={onSeek}
            />
            <Slider
              style={{width: 250, height: 40}}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              thumbTintColor={colors.white}
              minimumTrackTintColor={colors.green}
              maximumTrackTintColor={colors.white}
              onSlidingComplete={async value => {
                playerRef.current.seek(value);
              }}
            />

            <Text style={{color: 'white'}}>{secondsToHHMMSS(duration)}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            width: '100%',
          }}>
          <Button
            Style={{height: 35}}
            onPress={() => {
              if (!Element.is_payment) {
                toggleSoundPlaybacks();
                setIsPlaying(false);
                if (onlineState) {
                  navigation.navigate('Map', {Element});
                } else {
                  navigation.navigate('Mapscreenoffline', {Element});
                }
              } else if (!isPurchased && Element.price > 0) {
                setpayTour(true);
                toggleSoundPlaybacks();
                setIsPlaying(false);
              } else {
                toggleSoundPlaybacks();
                setIsPlaying(false);
                if (onlineState) {
                  navigation.navigate('Map', {Element});
                } else {
                  navigation.navigate('Mapscreenoffline', {Element});
                }
              }
            }}
            title="Start Tour"
            disabled={false}
            // disabled={Element.is_purchased != true ? true : false}
          />
        </View>
        {Element.image2 ? (
          <Image
            source={{uri: Element.image2}}
            style={{width: '100%', height: '70%'}}
          />
        ) : null}
        {Element.aboutus ? (
          <View style={{width: '100%'}}>
            <Text style={[styles.text, {fontSize: 18}]}>About Tour</Text>
            <Text style={{marginTop: 10}}>{Element.aboutus}</Text>
          </View>
        ) : null}
      </ScrollView>
      {/* {modalId === spot.id && Element.is_purchased != true ? null : (
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
                height: 400,
                borderRadius: 5,
                width: '95%',
                overflow: 'hidden',
              }}>
              <Image
                resizeMode="stretch"
                style={{
                  width: '100%',
                  height: 300,
                }}
                source={{
                  uri: spot.image,
                }}
              />

              <View
                style={{position: 'absolute', top: 10, right: 10, zIndex: 1}}>
                <AntDesign
                  onPress={() => closePlayerModal(spot.id)}
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
              <View style={[styles.row1, {marginHorizontal: 20}]}>
                <Pressable
                  disabled={!isPurchased}
                  onPress={() => toggleSoundPlayback()}>
                  <Feather
                    name={isSoundPlaying ? 'pause' : 'play'}
                    size={25}
                    color={colors.white}
                  />
                </Pressable>
                {search != true ? (
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
                  />
                ) : (
                  <Video
                    ref={playerRef}
                    source={{uri: Element.voice}}
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
                )}
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
      )} */}
      <Modal animationType="slide" transparent={true} visible={payTour}>
        <View style={{flex: 1, padding: 12, justifyContent: 'center'}}>
          <View
            style={{
              height: 120,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
              elevation: 10,
            }}>
            <Text style={{fontSize: 18}}>Must purchase tour to start</Text>
            <View style={{height: 20}} />
            <Button title="Ok" onPress={() => setpayTour(false)} />
          </View>
        </View>
      </Modal>
      <PaymentError error={isError} onClose={() => setIsError(false)} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  top: {
    // marginLeft: 15,
    paddingHorizontal: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgView: {
    flex: 1,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  round: {
    height: 15,
    marginLeft: 5,
    width: 15,
    borderRadius: 10,
    backgroundColor: 'green',
  },
  innder: {
    alignItems: 'center',
    width: '100%',
  },
  buy: {
    backgroundColor: '#2D8E99',
    height: 30,
    width: 100,

    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  bottomOne: {
    marginTop: 20,
    backgroundColor: '#2D8E99',
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderRadius: 5,
    width: '100%',
  },
  round1: {
    height: 15,
    marginLeft: 5,
    width: 15,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  space: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  info: {
    flex: 1,
    marginTop: 25,

    paddingHorizontal: 15,
  },
  img: {
    height: '100%',
    marginTop: 10,
    width: '100%',
    borderRadius: 10,
  },
});
