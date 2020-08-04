import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { MainContext } from './store/MainState';
import { globalStyles, colors } from '../styles/global';
import axios from 'axios';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import MainWrapper from './wrappers/MainWrapper';

export default class Registration extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      lastName: '',
      number: '+380',
      date: '',
      parentId: '',
      kbOpen: false,
    };
    this.duration = 200;

    this.registerHandler = this.registerHandler.bind(this);
    this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', e => {
      this.keyboardShowHandler(e);
    });
    this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', e => {
      this.keyboardHideHandler(e);
    });
  }

  registerHandler() {
    const { name, lastName, date, number } = this.state;
    let dateCheck = /([0-2]\d|3[01])\.(0\d|1[012])\.(\d{4})/;
    let numberCheck = /^((\+3|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{11}$/;
    if (name === '') {
      alert("Заповніть ім'я");
    } else if (lastName === '') {
      alert('Заповніть прізвище');
    } else if (!numberCheck.test(number)) {
      alert('Заповніть номер');
    } else if (!dateCheck.test(date)) {
      alert('Заповніть дату');
    } else {
      this.registerUser();
    }
  }
  keyboardShowHandler(e) {
    this.setState({ ...this.state, kbOpen: true });
  }
  keyboardHideHandler() {
    this.setState({ ...this.state, kbOpen: false });
  }
  async registerUser() {
    let {
      number: phone_number,
      name: first_name,
      lastName: last_name,
      date: birth_day,
      parentId: parent_id,
    } = this.state;

    const number = /^(\+?38)?0(\d{9})$/;
    if (number.test(phone_number)) {
      phone_number = phone_number.match(number)[2];
    } else {
      return alert('Номер введений не правильно');
    }
    const body = {
      phone_number,
      first_name,
      last_name,
      birth_day,
    };
    console.log('body', body);
    console.log(this.context.url + '/wp-json/api/create_user_app');

    const { data } = await axios
      .post(this.context.url + '/wp-json/api/create_user_app', body)
      .catch(console.error);
    console.log('data', data);
    if (data.status === 'true') {
      this.props.navigation.navigate('SMS');
    }
    // else {
    //   const { error } = data;
    //   console.error('error', error);
    //   // if (error.includes('parent_id')) alert('Користувача за таким кодом не існує');
    //   // else alert(error);
    // }
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  render() {
    return (
      <MainWrapper>
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: this.state.kbOpen ? 'flex-start' : 'center',
            marginTop: this.state.kbOpen ? hp(1) : 0,
            flex: 1,
            width: wp('100%'),
          }}
        >
          <View
            style={{
              ...globalStyles.mainLoginContainer,
              paddingTop: this.state.kbOpen ? hp(4) : hp(12),
            }}
            onLayout={event => {
              const layout = event.nativeEvent.layout;
              this.setState({
                ...this.state,
                freeSpace: Dimensions.get('window').height - layout.y - layout.height,
              });
            }}
          >
            <Image
              source={require('../img/beer.png')}
              style={{ ...globalStyles.beerImage, opacity: this.state.kbOpen ? 0 : 1 }}
            />
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <AuthInput
                onChangeText={value => this.setState({ name: value })}
                placeholderTextColor={'#b2b2b2'}
                placeholder="Ім'я"
                iconName={'user'}
                isValid={true}
                containerStyle={{ flex: 1, marginRight: 5 }}
              />
              <AuthInput
                onChangeText={value => this.setState({ lastName: value })}
                placeholderTextColor={'#b2b2b2'}
                placeholder="Прізвище"
                iconName={'user'}
                isValid={true}
                containerStyle={{ flex: 1, marginLeft: 5 }}
              />
            </View>
            <AuthInput
              onChangeText={value => this.setState({ number: value })}
              placeholder={this.state.number}
              value={this.state.number}
              placeholderTextColor={'#b2b2b2'}
              iconName={'phone'}
              keyboardType="numeric"
            />
            <AuthInput
              onChangeText={value => this.setState({ date: value })}
              placeholder="01.01.1996"
              placeholderTextColor={'#b2b2b2'}
              iconName={'calendar'}
              keyboardType="numeric"
            />
            <AuthButton text="Зареєструватись" onPress={this.registerHandler} />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={{ marginTop: 10, color: colors.bg, fontSize: 16 }}>Вхід</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </MainWrapper>
    );
  }
}
