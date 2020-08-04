import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  Animated,
  Share,
} from 'react-native';
import { colors } from '../styles/global';
import axios from 'axios';
import { MainContext } from './store/MainState';
import Loader from './components/Loader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MainWrapper from './wrappers/MainWrapper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const unescapeHTML = input => input.replace(/&#(\d+);/g, (match, p1) => String.fromCharCode(p1));

export default class BonusHistory extends Component {
  state = {
    items: {},
    isLoaded: false,
    isUpdateLoading: false,
    itemsHeight: {},
  };
  scrollView = React.createRef();
  static contextType = MainContext;

  async componentDidMount() {
    this.context.setLoading(true);
    await this.updateNewsHandler();
    this.context.setLoading(false);
  }
  async updateNewsHandler() {
    const { data } = await axios.post(this.context.url + '/wp-json/api/get_last_posts');
    // Object.keys(data).forEach(async key => {
    //   const item = data[key];
    //   console.log(item.post_thumbnail);
    //   const imageResponse = await axios.get(item.post_thumbnail);
    //   console.log('imgres', typeof imageResponse.data, imageResponse.data.length);
    // });
    const itemsHeight = { ...this.state.itemsHeight };
    const newKeys = Object.keys(data).filter(newKey => !Object.keys(itemsHeight).includes(newKey));
    newKeys.forEach(key => {
      itemsHeight[key] = {
        min: null,
        max: null,
        current: null,
        isExpanded: false,
        deg: new Animated.Value(0),
      };
    });
    this.setState({ ...this.state, isLoaded: true, items: data, itemsHeight });
  }
  async updateUserHandler() {
    this.setState({ ...this.state, isUpdateLoading: true });
    await this.updateNewsHandler();
    this.setState({ ...this.state, isUpdateLoading: false });
  }
  setMinHeight(e, id) {
    const itemsHeightCopy = { ...this.state.itemsHeight };
    itemsHeightCopy[id].min = e.nativeEvent.layout.height + 40;
    itemsHeightCopy[id].current = new Animated.Value(itemsHeightCopy[id].min);
    this.setState({
      ...this.state,
      itemsHeight: itemsHeightCopy,
    });
  }
  setMaxHeight(e, id) {
    const itemsHeightCopy = { ...this.state.itemsHeight };
    itemsHeightCopy[id].max = e.nativeEvent.layout.height + 20;
    itemsHeightCopy[id].y = e.nativeEvent.layout.y;
    this.setState({
      ...this.state,
      itemsHeight: itemsHeightCopy,
    });
  }
  onItemPress(id) {
    const { min, max, isExpanded, current, deg, y } = this.state.itemsHeight[id];
    const minMax = min + max;
    const min1 = min;
    this.setState({
      ...this.state,
      itemsHeight: {
        ...this.state.itemsHeight,
        [id]: { ...this.state.itemsHeight[id], isExpanded: !isExpanded },
      },
    });

    const idIndex =
      Object.keys(this.state.itemsHeight)
        .sort((a, b) => b - a)
        .indexOf(id) + 1;

    Animated.parallel([
      Animated.timing(current, {
        toValue: !isExpanded ? minMax : min1,
        duration: 300,
      }),
      Animated.timing(deg, {
        toValue: !isExpanded ? 1 : 0,
        duration: 300,
      }),
    ]).start(() => {
      if (!isExpanded) this.scrollView.current.scrollTo({ y: (minMax / 2) * idIndex });
    });
  }
  render() {
    return (
      <MainWrapper>
        <Loader />
        <ScrollView
          ref={this.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isUpdateLoading}
              onRefresh={() => this.updateUserHandler()}
            />
          }
        >
          <View style={{ flex: 1, width: '100%' }}>
            <View>
              <View style={{ marginVertical: 10 }}>
                <Text style={styles.title}>Акції</Text>
              </View>

              {this.state.isLoaded &&
                Object.entries(this.state.items)
                  .sort(([idA], [idB]) => idB - idA)
                  .map(([id, { post_title, post_date, post_excerpt, post_thumbnail }]) => {
                    const { min, max, isExpanded, current, deg } = this.state.itemsHeight[id];
                    let stylesAnimate = !current
                      ? { ...styles.saleItemContainer, opacity: 0 }
                      : { ...styles.saleItemContainer, height: current };
                    const spin = deg.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['90deg', '270deg'],
                    });
                    return (
                      <Animated.View style={stylesAnimate} key={id}>
                        <TouchableOpacity onPress={() => this.onItemPress(id)}>
                          <View style={styles.blockSale} onLayout={e => this.setMinHeight(e, id)}>
                            <View>
                              <Image
                                style={{ width: wp(13), height: wp(13), borderRadius: 2 }}
                                source={{
                                  uri: post_thumbnail,
                                }}
                              />
                              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{post_date}</Text>
                            </View>
                            <Text style={styles.titleSale}>{unescapeHTML(post_title)}</Text>
                            <Animated.Image
                              style={{ transform: [{ rotate: spin }], width: 20, height: 20 }}
                              source={require('../img/triangle.png')}
                            ></Animated.Image>
                          </View>
                          <View
                            style={styles.itemDescription}
                            onLayout={e => this.setMaxHeight(e, id)}
                          >
                            <Text style={{ fontWeight: '500' }}>{unescapeHTML(post_excerpt)}</Text>
                          </View>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
            </View>
          </View>
        </ScrollView>
      </MainWrapper>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 26,
    color: colors.dark,
    marginBottom: 10,
  },
  wrapBlockSales: {
    width: '100%',
    height: '55%',
  },
  itemDescription: {
    marginTop: 20,
  },
  saleItemContainer: {
    overflow: 'hidden',
    backgroundColor: colors.light,
    marginBottom: 10,
    marginHorizontal: 9,
    padding: 10,
    borderRadius: 20,
  },
  blockSale: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '3%',
  },
  titleSale: {
    fontSize: 15,
    fontWeight: 'bold',
    width: '60%',
  },
});
