import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Linking } from 'react-native';
import { Icon } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors } from '../styles/global';
import GestureRecognizer from 'react-native-swipe-gestures';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainWrapper from './wrappers/MainWrapper';

export default class About extends Component {
  static navigationOptions = {
    drawerIcon: <FontAwesome5Icon name={'info-circle'} size={wp(6)} color={'#fff'} />,
  };
  redirectToWebsite() {
    Linking.openURL('https://fastandclever.com/');
  }

  render() {
    return (
      <MainWrapper>
        <GestureRecognizer
          style={{
            ...globalStyles.gestureContainer,
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 26,
                color: '#404040',
              }}
            >
              Про нас
            </Text>
            <View style={styles.wrapperImages}>
              <Image source={require('../img/logo.png')} style={styles.imageLogo} />
              <View style={styles.wrapperTextAbout}>
                <Text style={styles.text}>
                  ПОЛОНІЯ - ПАБ КРАФТОВОГО ПИВА{'\n'}
                  Перший справжній бар крафтового пива в Тернополі.{'\n\n'}
                  Усі цінителі справжнього пива точно на це чекали!{'\n\n'}
                  Для вас:{'\n'}
                  60 видів справжнього крафтового пива найкращих пивоварень України. Затишна
                  атмосфера в самому центрі Тернополя.{'\n'}
                  вул. Грушевського 1{'\n'}
                  Смачні страви та закуски!
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={this.redirectToWebsite}>
              <Text style={styles.tag}>Розроблено FNC group</Text>
            </TouchableOpacity>
          </View>
        </GestureRecognizer>
      </MainWrapper>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperImages: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLogo: {
    zIndex: 50,
    width: wp(35),
    height: wp(35),
    resizeMode: 'stretch',
    marginBottom: 25,
    marginTop: 40,
  },
  wrapperTextAbout: {
    marginHorizontal: 15,
    padding: 20,
    backgroundColor: colors.light + '90',
    borderRadius: 25,
  },
  text: { color: colors.dark, fontSize: 16, textAlign: 'center' },
  tag: { marginTop: 20 },
});
