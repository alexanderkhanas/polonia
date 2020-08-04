import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default ({
  isValid,
  onChangeText,
  placeholderTextColor = '#404040',
  placeholder,
  value,
  autoCapitalize = 'none',
  iconName,
  containerStyle = {},
  ...rest
}) => {
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <TextInput
        style={styles.input}
        {...{ onChangeText }}
        {...{ placeholder }}
        {...{ placeholderTextColor }}
        {...{ value }}
        {...{ autoCapitalize }}
        {...rest}
      />
      <View style={styles.iconContainer}>
        <FontAwesome5Icon name={iconName} size={30} color={'#404040'} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingLeft: 20,
    flex: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingRight: 10,
  },
});
