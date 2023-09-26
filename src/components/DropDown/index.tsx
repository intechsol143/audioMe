import {useFocusEffect} from '@react-navigation/native';
import {useAppSelector} from '@src/hooks';

import React, {useEffect, useState, useLayoutEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface IDropDownProps {
  value: string;
  setValue: (value: string) => void;
}

export default function DropDown(props: IDropDownProps) {
  const {token} = useAppSelector(({USER}) => USER);

  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      open={open}
      value={props.value}
      items={props.items}
      setOpen={setOpen}
      setValue={props.setValue}
      setItems={props.setItems}
      placeholder="Select City"
      searchPlaceholderTextColor="gray"
      containerStyle={{
        borderWidth: 0,
        height: 45,
        width: '95%',
        alignSelf: 'center',
      }}
      style={{borderWidth: 0, height: 50}}
    />
  );
}
