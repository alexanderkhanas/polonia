import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/global';

export default ({ onPress, text, isDisabled, onLayout }) => {
  return (
    <TouchableOpacity {...{ onPress }} {...{ onLayout }} style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: colors.brown,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    textTransform: 'uppercase',
    color: '#fff',
  },
});
