import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { colors } from '../../styles/global';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default ({
  isValid,
  onChangeText,
  placeholderTextColor = '#404040',
  placeholder,
  value,
  isFirst,
  autoCapitalize = 'none',
  iconName,
  isDisabled = false,
}) => {
  const marginTop = isFirst ? 0 : hp(4);
  const style = isValid
    ? { ...styles.container, marginTop }
    : { ...styles.container, marginTop, borderColor: '#E70000' };
  return (
    <View {...{ style }}>
      <FontAwesome5Icon
        name={iconName}
        size={40}
        color={isValid ? '#fff' : '#E70000'}
        style={{ zIndex: 100 }}
      />
      {!isDisabled ? (
        <TextInput
          style={styles.input}
          {...{ onChangeText }}
          {...{ placeholder }}
          {...{ placeholderTextColor }}
          {...{ value }}
          {...{ autoCapitalize }}
        />
      ) : (
        <Text style={styles.input}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
    position: 'relative',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  input: {
    fontSize: hp('3%'),
    fontWeight: '300',
    textAlign: 'center',
    color: colors.bg,
    flex: 1,
  },
  errorInput: {
    backgroundColor: '#E70000',
  },
});
