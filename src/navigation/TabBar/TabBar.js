import React from 'react';
import s from './TabBar.s';
import { View, TouchableOpacity, Text } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../styles/global';

const iconObj = {
  Головна: 'home',
  'Про нас': 'info-circle',
  Профіль: 'user',
  Акція: 'newspaper',
  Історія: 'history',
};

const invisibleRoutes = ['code', 'referral'];

export default ({ state, descriptors, navigation }) => {
  return (
    <View style={s.container}>
      {state.routes.map((el, index) => {
        if (invisibleRoutes.includes(el.name)) return;
        const active = state.index === index;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(el.name)}
            style={s.button}
          >
            <FontAwesome5Icon
              name={iconObj[el.name]}
              solid={active ? true : false}
              color={active ? colors.light : '#444444'}
              size={35}
            />
            {/* <Text style={s.buttonText}>{el.name}</Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
