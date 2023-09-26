import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useNavigation} from '@react-navigation/native';
import {shadow} from '@src/lib';

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const data = [
    {id: 1, name: 'Historic'},
    {id: 2, name: 'Fun Date'},
    {id: 3, name: 'Challenge'},
    {id: 4, name: 'Treasure Hunt'},
    {id: 5, name: 'Race'},
    {id: 6, name: 'Family'},
  ];
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.row}>
        <AntDesign
          name="arrowleft"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.left}>Category List</Text>
      </View>
      <View style={styles.mapOuter}>
        {data.map(item => (
          <View style={styles.inner} key={item.id + 'a'}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 15,
  },
  mapOuter: {
    marginHorizontal: 15,
    backgroundColor: 'white',
    marginTop: 20,
    paddingTop: 15,
    paddingLeft: 15,
    borderRadius: 5,
    paddingRight: 15,
    ...shadow,
  },
  inner: {
    marginBottom: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  text: {
    marginBottom: 5,
  },
  left: {
    marginLeft: 20,
    fontSize: 20,
  },
});
