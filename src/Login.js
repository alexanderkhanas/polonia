import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  AppState,
  Animated,
  Keyboard,
  Easing,
  AsyncStorage,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import { globalStyles, colors } from '../styles/global';
import { MainContext } from './store/MainState';
import Loader from './components/Loader';
import MainWrapper from './wrappers/MainWrapper';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';

export default class Login extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);
    this.state = {
      value: '+380',
      isToken: false,
      kbOpen: false,
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.pressHandler = this.pressHandler.bind(this);
    this.duration = 200;

    this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', e =>
      this.keyboardShowHandler(e),
    );
    this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', e =>
      this.keyboardHideHandler(e),
    );
  }

  keyboardShowHandler(e) {
    this.setState({ ...this.state, kbOpen: true });
  }
  keyboardHideHandler() {
    this.setState({ ...this.state, kbOpen: false });
  }
  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }
  async componentDidMount() {
    this.context.stack = this.props.navigation;
    this.context.setStack(this.props.navigation);
  }
  handleAppStateChange(appState) {
    if (appState === 'background') {
    }
  }

  pressHandler() {
    const number = /^(\+?38)?0(\d{9})$/;
    if (number.test(this.state.value)) {
      this.sendNumber(this.state.value.match(number)[2]);
    } else {
      alert('Номер введений не правильно');
    }
  }

  changeHandler(number) {
    this.setState({ value: number });
  }

  async sendNumber(phone_number) {
    this.context.setLoading(true);
    const { data } = await axios
      .post(this.context.url + '/wp-json/api/send_code', { phone_number })
      .catch(console.error);

    if (data.status === 'true') {
      this.props.navigation.navigate('SMS');
    } else {
      alert('Ваш номер не зареєстрований');
    }
    this.context.setLoading(false);
  }
  render() {
    return this.state.isToken ? (
      <Loader style={{ backgroundColor: '#ccc' }} isLoading={true} />
    ) : (
      <MainWrapper>
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: this.state.kbOpen ? 'flex-start' : 'center',
            marginTop: this.state.kbOpen ? hp(25) : 0,
            width: wp('100%'),
            flex: 1,
          }}
        >
          <View style={globalStyles.mainLoginContainer}>
            <Image source={require('../img/beer.png')} style={globalStyles.beerImage} />
            <AuthInput
              onChangeText={this.changeHandler}
              placeholder={this.state.value}
              value={this.state.value}
              placeholderTextColor={'#b2b2b2'}
              iconName={'user'}
              isValid={true}
              keyboardType="numeric"
            />
            <AuthButton
              text="Вхід"
              onPress={this.pressHandler}
              onLayout={event => {
                const layout = event.nativeEvent.layout;
                this.setState({ ...this.state, freeSpace: layout.y - layout.height });
              }}
            />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={{ marginTop: 10, color: colors.bg, fontSize: 16 }}>Реєстрація</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Loader />
      </MainWrapper>
    );
  }
}
