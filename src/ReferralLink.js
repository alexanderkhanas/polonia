import React, { Component, useContext } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  Animated,
  Clipboard,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { MainContext } from './store/MainState';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MainWrapper from './wrappers/MainWrapper';
import { colors } from '../styles/global';

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5Icon);

export default class UserId extends Component {
  static contextType = MainContext;
  constructor(props) {
    super(props);
    this.shareLink = this.shareLink.bind(this);
  }
  state = { animationNum: new Animated.Value(0) };

  async shareLink() {
    const result = await Share.share({
      message: `Моє реферальне посилання: ${this.context.referralLink.visibleLink}`,
    });
    if (result.action === Share.dismissedAction) {
      Alert.alert('Сталась помилка', 'Спробуйте ще раз');
    }
  }

  render() {
    return (
      <MainWrapper>
        <View style={s.container}>
          <View>
            <Text style={{ fontSize: 20, textAlign: 'center', color: '#5e5d5d' }}>
              Ваше реферальне посилання:
            </Text>
            <View style={s.linkContainer}>
              <Text style={s.link}>{this.context.referralLink.visibleLink}</Text>
              <AnimatedIcon
                name="share-square"
                onPress={this.shareLink}
                solid
                style={s.shareIcon}
                size={30}
              />
            </View>
          </View>
        </View>
      </MainWrapper>
    );
  }
}

const s = StyleSheet.create({
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: colors.light,
    borderRadius: 20,
    paddingLeft: 20,
    overflow: 'hidden',
  },
  link: {
    fontSize: 16,
    color: '#404040',
    fontWeight: 'bold',
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: { alignSelf: 'center', padding: 15, backgroundColor: colors.brown },
});
