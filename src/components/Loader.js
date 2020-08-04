import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Bubbles } from 'react-native-loader';
import { MainContext } from '../store/MainState';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../../styles/global';

export default function Loader({ style, isLoading: isLoadingOverride }) {
  const { isLoading } = useContext(MainContext);

  return isLoadingOverride || isLoading ? (
    <View style={{ ...styles.loader, ...style }}>
      <Bubbles style={{ zIndex: 20 }} size={20} color={colors.brown} />
    </View>
  ) : (
    <Text />
  );
}

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    left: 0,
    zIndex: 100,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
