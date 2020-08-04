import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Keyboard,
  Animated,
} from 'react-native';
import { globalStyles, colors } from '../styles/global';
import { MainContext } from './store/MainState';
import Loader from './components/Loader';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import MainWrapper from './wrappers/MainWrapper';
import messaging from '@react-native-firebase/messaging';
import SmsListener from 'react-native-android-sms-listener';

export default class SmsConfirmation extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);
    this.state = { value: '', kbOpen: false };
    this.pressHandler = this.pressHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.duration = 200;

    this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', e =>
      this.keyboardShowHandler(e),
    );
    this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', e =>
      this.keyboardHideHandler(e),
    );
  }
  keyboardShowHandler(e) {
    this.setState({ kbOpen: true });
  }
  keyboardHideHandler() {
    this.setState({ kbOpen: false });
  }
  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
    this.subscription.remove();
  }
  pressHandler() {
    this.checkCode();
  }

  changeHandler(code) {
    this.setState({
      value: code,
    });
  }

  async checkCode() {
    if (this.state.value.length !== 4) return alert('Код має бути 4-ох значним');

    this.context.setLoading(true);

    const notificationToken = await messaging().getToken();
    const { data } = await axios.post(this.context.url + '/wp-json/api/check_code', {
      code: this.state.value,
      notificationToken,
    });

    this.context.setLoading(false);

    if (data.status === 'true') {
      await AsyncStorage.setItem('token', data.verified_user.user_token);
      this.context.setToken(data.verified_user.user_token);
      this.context.setLoggedIn(true);
    } else {
      alert('Невірний код');
    }
  }

  componentDidMount() {
    this.subscription = SmsListener.addListener(({ originatingAddress: sender, body }) => {
      const codeRegex = /^(\d{4}) - кoд підтвердження$/;
      const test = body.match(codeRegex);

      if (test) {
        console.log('success');
        this.setState({ value: test[1] }, () => this.checkCode());
      } else console.log('wtf? ', { sender, body });
    });
  }

  render() {
    return (
      <MainWrapper>
        <Loader isLoading={this.context.isLoading} />

        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: this.state.kbOpen ? 'flex-start' : 'center',
            marginTop: this.state.kbOpen ? hp(17.5) : 0,
            width: wp('100%'),
            flex: 1,
          }}
        >
          <View style={globalStyles.mainLoginContainer}>
            <Image source={require('../img/beer.png')} style={globalStyles.beerImage} />
            <AuthInput
              onChangeText={this.changeHandler}
              iconName={'key'}
              placeholder="Введіть код підтвердження з SMS"
              placeholderTextColor={'#b2b2b2'}
              onChangeText={this.changeHandler}
              value={this.state.value}
              isValid={true}
              keyboardType="numeric"
            />
            <AuthButton
              onPress={this.pressHandler}
              text={'Підтвердити'}
              onLayout={event => {
                const layout = event.nativeEvent.layout;
                this.setState({ ...this.state, freeSpace: layout.y - layout.height });
              }}
            />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={{ marginTop: 10, color: colors.bg, fontSize: 16 }}>Реєстрація</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={{ marginTop: 10, color: colors.bg, fontSize: 16 }}>Вхід</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </MainWrapper>
    );
  }
}
