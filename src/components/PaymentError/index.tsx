import {View, Text, Modal} from 'react-native';
import React from 'react';

import styles from './styles';

export default function PaymentError(props: any) {
  return (
    <Modal animationType="slide" transparent={true} visible={props.error}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.heading}>Message</Text>
          <Text style={styles.modalText}>The payment has been canceled</Text>
          <View style={styles.button}>
            <Text onPress={props.onClose} style={styles.textStyle}>
              Ok
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
