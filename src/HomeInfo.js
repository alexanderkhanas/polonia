import React, { Component, createRef } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Platform,
  BackHandler,
} from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import { MainContext } from './store/MainState';
import Loader from './components/Loader';
import { globalStyles, colors } from '../styles/global';
import { ScrollView } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MainWrapper from './wrappers/MainWrapper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default class Home extends Component {
  static contextType = MainContext;
  state = {
    modalVisible: false,
    torchMode: 'off',
    cameraType: 'back',
    user: {
      firstName: '',
      lastName: '',
      birthday: '',
      userPhone: '',
      polonNumber: '',
      notActivePolons: '',
    },
    isUpdateLoading: false,
    expoPushToken: '',
    notification: '',
  };

  setModalVisible(visible) {
    this.setState({ ...this.state, modalVisible: visible });
  }

  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.pressHandler = this.pressHandler.bind(this);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPressAndroid);
    this.modalInputRef = createRef();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonPressAndroid);
  }

  async pressHandler() {
    let number = /^[0-9]+$/;
    if (number.test(this.state.value) && this.state.value <= this.context.user.polonNumber) {
      this.setState({
        value: '',
        modalVisible: false,
      });
      this.context.setLoading(true);
      // set polons
      await this.setUncomingPolons();
      // get user
      await this.getUserByToken();
      // get history
      await this.getUserHistory();
      this.context.setLoading(false);
      this.setState({ ...this.state, modalVisible: false });
      this.props.navigation.navigate('code');
    } else {
      alert('Введіть коректну кількість Полонів');
    }
  }

  async activeButtonPressHandler() {
    this.context.setLoading(true);
    await this.getUserByToken();
    this.context.setLoading(false);
    this.setState({ ...this.state, modalVisible: false });
    this.props.navigation.navigate('code');
  }

  changeHandler(number) {
    this.setState({
      value: number,
    });
  }
  async setUncomingPolons() {
    await axios.post(this.context.url + '/wp-json/api/set_uncoming_user_polons', {
      token: this.context.token,
      polon_number: this.state.value,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    });
  }
  async getUserHistory() {
    const response = await axios.post(this.context.url + '/wp-json/api/get_user_polons', {
      token: this.context.token,
    });
    this.context.setUserHistory(response.data.user_polon);
  }

  async getUserByToken() {
    const { data } = await axios
      .post(this.context.url + '/wp-json/api/get_user_by_token', {
        token: this.context.token,
      })
      .catch(console.error);

    if (data.status === 'true') {
      this.context.setAppId(data.user_data.app_id);
      this.context.setUserParams({
        firstName: data.user_data.first_name,
        lastName: data.user_data.last_name,
        birthday: data.user_data.birth_day,
        userPhone: data.user_data.user_phone,
        polonNumber: data.user_data.polon_number,
        notActivePolons: data.user_data.polon_no_active,
        notActivePolonsInfo: data.user_data.polon_no_active_infi,
      });
    } else console.log('kms', data);
  }

  async componentDidMount() {
    if (!Object.keys(this.context.user).length) {
      this.context.setLoading(true);
      await this.getUserByToken();
      this.context.setLoading(false);
    }
  }

  async updateUserHandler() {
    this.setState({ ...this.state, isUpdateLoading: true });
    await this.getUserByToken();
    this.setState({ ...this.state, isUpdateLoading: false });
  }

  handleBackButtonPressAndroid() {
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.modalVisible === false && this.state.modalVisible === true) {
      setTimeout(() => this.modalInputRef.current.focus(), 456);
    }
  }

  render() {
    const fontSize = wp(80 / `${this.context.user.polonNumber}`.length);
    return (
      <MainWrapper>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ height: hp(90), paddingTop: 15 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isUpdateLoading}
              onRefresh={() => this.updateUserHandler()}
            />
          }
        >
          <View style={{ flexGrow: 1, alignItems: 'center' }}>
            <Loader />
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => this.setState({ modalVisible: false })}
            >
              <View style={styles.wrapModal}>
                <View style={styles.modalContent}>
                  <View style={styles.modalInput}>
                    <Text style={styles.modalLabel}>
                      Введіть кількість Полонів: {this.context.user.polonNumber}
                    </Text>
                    <TextInput
                      style={styles.customInput}
                      onChangeText={this.changeHandler}
                      value={this.state.value}
                      ref={this.modalInputRef}
                    />
                  </View>

                  <View style={styles.confirmInput}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                      <TouchableOpacity onPress={this.pressHandler}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#fff',
                            textAlign: 'center',
                            padding: 5,
                          }}
                        >
                          Використати
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>

                  <View style={styles.closeModal}>
                    <FontAwesome5Icon
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}
                      name={'times-circle'}
                      size={20}
                      color={colors.bg}
                    />
                  </View>
                </View>
              </View>
            </Modal>
            <View style={globalStyles.viewContainer}>
              <View style={{ width: '100%' }}>
                <View>
                  <View style={styles.title}>
                    <Text style={styles.titleText}>Баланс</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Історія')}
                  style={{ alignItems: 'center' }}
                >
                  <Text
                    style={{ ...styles.points, fontSize: fontSize > wp(30) ? wp(30) : fontSize }}
                  >
                    {this.context.user.polonNumber}
                  </Text>
                </TouchableOpacity>
                {this.context.user.notActivePolons && this.context.notActivePolons !== 0 ? (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Історія', { tab: 'inactivePolons' })
                      }
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.light,
                        width: wp(65),
                        alignSelf: 'center',
                        padding: 15,
                        flexDirection: 'row',
                        borderRadius: 15,
                      }}
                    >
                      <Text style={{ fontSize: wp(4), color: '#fff', fontWeight: 'bold' }}>
                        Не активні Полони:
                      </Text>
                      <Text style={{ marginLeft: 2, fontSize: wp(7) }}>
                        {this.context.user.notActivePolons}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text />
                )}
                <View style={styles.buttonsContainer}>
                  <Image source={require('../img/beer.png')} style={styles.buttonsImage} />
                  <View style={styles.buttons}>
                    <View style={styles.button}>
                      <Button
                        color={Platform.OS === 'android' ? '#724100' : '#fff'}
                        title="Використати"
                        style={{ fontSize: wp(4) }}
                        onPress={() => {
                          this.setState({ ...this.state, modalVisible: true });
                        }}
                      />
                    </View>

                    <TouchableOpacity
                      title="Активувати"
                      style={{
                        marginTop: 5,
                        width: '80%',
                        alignItems: 'center',
                        borderRadius: 25,
                        paddingVertical: 6,
                        backgroundColor: '#003300',
                      }}
                      onPress={() => this.activeButtonPressHandler()}
                    >
                      <Text style={{ color: '#fff', textTransform: 'uppercase' }}>Активувати</Text>
                    </TouchableOpacity>
                    <FontAwesome5Icon
                      name="user-plus"
                      size={40}
                      onPress={() => this.props.navigation.navigate('referral')}
                      style={{ alignSelf: 'center', marginTop: 5 }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </MainWrapper>
    );
  }
}

const styles = StyleSheet.create({
  wrapModal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
  modalContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.brown,
    width: 210,
    height: 210,
    borderRadius: 15,
    padding: 21,
    borderWidth: 1,
    borderColor: '#C1C1C1',
  },
  closeModal: {
    position: 'absolute',
    top: 6,
    right: 12,
  },
  modalInput: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  inactivePolonContainer: {
    borderRadius: 10,
    backgroundColor: colors.light,
    alignSelf: 'center',
  },
  customInput: {
    backgroundColor: colors.light,
    color: '#32100D',
    fontSize: 20,
    fontWeight: 'bold',
    borderRadius: 15,
    width: 80,
    padding: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  confirmInput: {
    overflow: 'hidden',
    width: '72%',
    margin: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C1C1C1',
    shadowColor: '#fff',
    shadowOffset: {
      width: 1,
      height: 10,
    },
    backgroundColor: '#724100',
    shadowOpacity: 1,
    shadowRadius: 1.0,
    elevation: 10,
  },
  hello: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    marginTop: '5%',
  },
  loader: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    left: 0,
    zIndex: 20,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignItems: 'center',
  },
  titleText: { fontSize: wp(7), color: '#404040' },
  points: {
    fontSize: 100,
    color: '#404040',
    textAlign: 'center',
    width: '70%',
    includeFontPadding: false,
  },
  buttonsContainer: {
    marginHorizontal: 10,
    position: 'relative',
    alignItems: 'center',
  },
  buttons: {
    width: '100%',
    backgroundColor: colors.light,
    paddingHorizontal: '5%',
    paddingVertical: 30,
    borderRadius: 25,
    alignItems: 'center',
    transform: [{ translateY: -50 }],
  },
  buttonsImage: {
    transform: [{ scale: 0.8 }],
    zIndex: 10,
  },
  button: {
    overflow: 'hidden',
    width: '80%',
    marginTop: '5%',
    borderRadius: 20,
    backgroundColor: '#724100',
  },
});
