import React, { Component, createRef } from 'react';
import {
  Button,
  StyleSheet,
  Modal,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Platform,
  Animated,
  Easing,
  Keyboard,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icon, Thumbnail } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors } from '../styles/global';
import { MainContext } from './store/MainState';
import GestureRecognizer from 'react-native-swipe-gestures';
import axios from 'axios';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import Loader from './components/Loader';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MainWrapper from './wrappers/MainWrapper';
import ProfileInput from './components/ProfileInput';

export default class BonusHistory extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);
    this.duration = 200;
    this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', e =>
      this.keyboardShowHandler(e),
    );
    this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', e =>
      this.keyboardHideHandler(e),
    );
    this.modalInputRef = createRef();
    this.openDrawer = this.openDrawer.bind(this);
  }
  state = {
    newUserData: {},
    keyboardHeight: 0,
    freeSpace: 0,
    inputValidation: {
      userPhone: true,
      firstName: true,
      lastName: true,
      birthday: true,
    },
    opacity: new Animated.Value(1),
    top: new Animated.Value(hp(-20)),
    smsValue: '',
    smsConfirmationModal: false,
  };
  keyboardShowHandler(e) {
    this.setState({
      ...this.state,
      keyboardHeight: e.endCoordinates.height,
    });
    Animated.parallel([
      Animated.timing(this.state.top, {
        toValue: hp(3),
        duration: this.duration,
        easing: Easing.ease,
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: this.duration,
        easing: Easing.ease,
      }),
    ]).start();
  }
  keyboardHideHandler(e) {
    this.setState({ ...this.state, keyboardHeight: e.endCoordinates.height });
    Animated.parallel([
      Animated.timing(this.state.top, {
        toValue: hp(-20),
        duration: this.duration,
        easing: Easing.ease,
      }),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: this.duration,
        easing: Easing.ease,
      }),
    ]).start();
  }
  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }
  componentDidMount() {
    this.setState({
      ...this.state,
      newUserData: {
        ...this.context.user,
      },
    });
  }

  dataInputHandler(type, text) {
    const validation = {
      firstName: /^[a-zA-Zа-яіА-ЯІ]+$/iu,
      lastName: /^[a-zA-Zа-яіА-ЯІ]+$/iu,
      birthday: /^(((0[1-9]|[12]\d|3[01])\.(0[13578]|1[02])\.((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\.(0[13456789]|1[012])\.((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\.02\.((19|[2-9]\d)\d{2}))|(29\.02\.((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/,
      userPhone: /^(\+?38)?0(\d{9})$/,
    };
    let newUserDataCopy = { ...this.state.newUserData };
    newUserDataCopy[type] = text;
    let validationStateCopy = { ...this.state.inputValidation };
    validationStateCopy[type] = validation[type].test(text);

    this.setState({
      ...this.state,
      inputValidation: {
        ...validationStateCopy,
      },
      newUserData: { ...newUserDataCopy },
    });
  }
  async updateDataHandler() {
    Keyboard.dismiss();
    this.context.setLoading(true);

    let phone = /^(\+?38)?0(\d{9})$/;
    const [fullNumber, , phone_number] = this.state.newUserData.userPhone.match(phone);
    const { data } = await axios.post(this.context.url + '/wp-json/api/update_user_data', {
      first_name: this.state.newUserData.firstName,
      last_name: this.state.newUserData.lastName,
      phone_number,
      token: this.context.token,
    });

    this.context.setLoading(false);

    if (data.user_code === 'code send') {
      this.setState({ ...this.state, smsConfirmationModal: true });
    } else if (data.error === 'number is busy') {
      Alert.alert('Номер вже використано!', `Номер ${fullNumber} вже зареєстрований`);
      this.setState({
        ...this.state,
        newUserData: {
          ...this.state.newUserData,
          userPhone: this.context.user.userPhone,
        },
      });
    }
  }
  async smsConfirmationHandler() {
    const { data } = await axios.post(this.context.url + '/wp-json/api/update_check_code', {
      code: this.state.smsValue,
      token: this.context.token,
    });
    this.setState({ ...this.state, smsConfirmationModal: false });
  }
  checkInputsValidation() {
    let checker = true;
    const validation = this.state.inputValidation;
    Object.keys(this.state.inputValidation).map(el => {
      if (!validation[el]) {
        checker = false;
      }
    });
    return checker;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.smsConfirmationModal === false && this.state.smsConfirmationModal === true) {
      setTimeout(() => this.modalInputRef.current.focus(), 456);
    }
  }

  openDrawer() {
    this.props.navigation.openDrawer();
  }
  pressHandler() {
    Alert.alert('Вихід', 'Ви точно хочете вийти?', [
      { text: 'Так', onPress: this.context.logout },
      { text: 'Ні' },
    ]);
  }
  render() {
    return (
      <MainWrapper>
        <Loader />
        <Animated.View
          style={{
            position: 'absolute',
            top: this.state.top,
            alignSelf: 'center',
            width: 50,
            height: 50,
            zIndex: 100,
          }}
        >
          <FontAwesome5Icon
            onPress={!this.checkInputsValidation() ? () => {} : () => this.updateDataHandler()}
            name={'save'}
            size={50}
            color={colors.dark}
          />
        </Animated.View>
        <View
          style={{
            ...globalStyles.gestureContainer,
            opacity: this.state.smsConfirmationModal ? 0.7 : 1,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Animated.View
              style={{
                ...styles.wrapTitleProfile,
                opacity: this.state.opacity,
              }}
            >
              <Text style={styles.title}>Мій профіль</Text>
              <FontAwesome5Icon
                name={'sign-out-alt'}
                onPress={() => this.pressHandler()}
                size={30}
                style={{ position: 'absolute', right: 0 }}
              />
            </Animated.View>
            <View style={{ ...styles.wrapProfileContent }}>
              <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <ProfileInput
                  onChangeText={text => this.dataInputHandler('firstName', text)}
                  placeholder={"Введіть ім'я"}
                  value={this.state.newUserData.firstName}
                  isValid={this.state.inputValidation.firstName}
                  isFirst={true}
                  autoCapitalize={'words'}
                  iconName={'address-book'}
                />
                <ProfileInput
                  onChangeText={text => this.dataInputHandler('lastName', text)}
                  placeholder="Введіть прізвище"
                  value={this.state.newUserData.lastName}
                  isValid={this.state.inputValidation.lastName}
                  autoCapitalize={'words'}
                  iconName={'address-book'}
                />
                <ProfileInput
                  onChangeText={text => this.dataInputHandler('userPhone', text)}
                  placeholder=" Введіть номер телефону"
                  value={this.state.newUserData.userPhone}
                  isValid={this.state.inputValidation.userPhone}
                  iconName={'phone'}
                />
                <ProfileInput
                  value={this.state.newUserData.birthday}
                  isDisabled={true}
                  iconName={'gift'}
                  isValid={true}
                />
              </ScrollView>
              <FontAwesome5Icon
                onPress={!this.checkInputsValidation() ? () => {} : () => this.updateDataHandler()}
                name={'save'}
                size={50}
                color={colors.bg}
              />
            </View>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.smsConfirmationModal}
          onRequestClose={() => {
            this.setState({ smsConfirmationModal: false });
          }}
        >
          <View style={styles.smsModalContainer}>
            <View style={styles.smsModal}>
              <View style={styles.modalClose}>
                <FontAwesome5Icon
                  onPress={() =>
                    this.setState({
                      ...this.state,
                      smsConfirmationModal: false,
                    })
                  }
                  name={'times-circle'}
                  size={20}
                  color={colors.bg}
                />
              </View>
              <View style={styles.wrapModalInput}>
                <Text style={styles.modalInputLabel}>Введіть код з SMS</Text>
                <TextInput
                  ref={this.modalInputRef}
                  placeholderTextColor={'rgb(186, 186, 186)'}
                  style={styles.modalInput}
                  placeholder={'Код'}
                  onChangeText={text => this.setState({ ...this.state, smsValue: text })}
                />
              </View>
              <FontAwesome5Icon
                onPress={() => {
                  this.smsConfirmationHandler();
                }}
                style={{ alignSelf: 'center' }}
                name={'save'}
                size={50}
                color={colors.bg}
              />
            </View>
          </View>
        </Modal>
      </MainWrapper>
    );
  }
}

const styles = StyleSheet.create({
  wrapTitleProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    width: wp(85),
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  smsModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('100%'),
    opacity: 1,
  },
  smsModal: {
    flex: 1,
    paddingVertical: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    width: '50%',
    marginLeft: '25%',
  },
  modalInputLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
  modalInput: {
    marginVertical: 15,
    paddingVertical: 8,
    color: '#fff',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  smsModal: {
    zIndex: 100000,
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderRadius: 7,
    width: wp('70%'),
    opacity: 1,
    backgroundColor: colors.brown,
  },

  title: {
    textAlign: 'center',
    fontSize: hp('3%'),
    color: '#32100D',
  },
  wrapProfileContent: {
    width: '90%',
    backgroundColor: colors.light,
    borderRadius: 20,
    position: 'relative',
    paddingVertical: 20,
    height: hp(75),
    flexGrow: 0,
    alignItems: 'center',
  },
  unicCodeText: {
    color: '#32100D',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
