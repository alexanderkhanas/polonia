import React from 'react';
import { View, StyleSheet } from 'react-native';

export default ({ children, style }) => {
  return <View style={{ ...s.container, ...style }}>{children}</View>;
};

const s = StyleSheet.create({
  container: {
    backgroundColor: '#FCF6F3',
    flex: 1,
  },
});
