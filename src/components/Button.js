import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const Button = ({title, onPress, Style, disabled}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, {...Style}]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 5,
    backgroundColor: '#2D8E99',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
