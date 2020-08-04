import React, { Component } from 'react';
import { Text, View, ScrollView, RefreshControl, Platform, TouchableOpacity } from 'react-native';
import s from './BonusHistory.s';
import axios from 'axios';
import Loader from './components/Loader';
import { MainContext } from './store/MainState';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class BonusHistory extends Component {
  static contextType = MainContext;

  state = {
    allPolons: {},
    isUpdateLoading: false,
  };
  showAllHistoryPoints = type => {
    this.props.navigation.setParams({ tab: type });
  };
  async componentDidMount() {
    this.context.setLoading(true);
    await this.getUserHistory();
    this.context.setLoading(false);
  }
  async getUserHistory() {
    const response = await axios.post(this.context.url + '/wp-json/api/get_user_polons', {
      token: this.context.token,
    });
    this.context.setUserHistory(response.data.user_polon);
  }
  async updateUserHandler() {
    this.setState({ ...this.state, isUpdateLoading: true });
    await this.getUserHistory();
    this.setState({ ...this.state, isUpdateLoading: false });
  }

  getColor(type) {
    if (Platform.OS === 'ios') return '#fff';
    if (this.state.shownType === type) return '#995700';
    else return '#724100';
  }
  getItems(obj) {
    return Object.entries(obj)
      .map(([id, record]) =>
        Object.keys(record).reduce(
          (acc, cur) => ({
            ...acc,
            id,
            [cur.slice(6)]: obj[id][cur],
          }),
          {},
        ),
      )
      .sort((a, b) => b.id - a.id);
  }
  render() {
    let showType = this.props.route?.params?.tab || 'allPolons';
    const items = this.getItems(this.context.history[showType]);

    let renderItems = items.map(
      ({ id, noted, date, key, value, status }) =>
        status !== 'none' && (
          <View key={id} style={s.historyItem}>
            <Icon name="hryvnia" color="#fff" size={35} />
            <View style={s.historyItemText}>
              <Text style={s.whiteText}>{noted}</Text>
              <Text style={{ ...s.whiteText, fontSize: 14 }}>{date}</Text>
              {showType === 'inactivePolons' && (
                <Text style={{ ...s.whiteText, fontSize: 10 }}>
                  {noted === 'Реєстрація друга'
                    ? 'Друг не відвідав заклад'
                    : 'Ви не здійснили першу покупку'}
                </Text>
              )}
            </View>
            <View style={s.historyItemNum}>
              <Text style={s.whiteText}>
                {key === 'coming' ? '+' : '-'}
                {value}
              </Text>
              <Text style={s.whiteText}>полонів</Text>
            </View>
          </View>
        ),
    );
    if (renderItems.length === 0) {
      renderItems = <Text style={{ fontSize: 20, color: '#fff' }}>Тут поки пусто</Text>;
    }
    return (
      <>
        <Loader isLoading={this.context.isLoading} />
        <View style={s.container}>
          <Text style={s.title}>Історія Полонів</Text>
          <View style={s.nav}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={showType === 'allPolons' ? s.navItemA : s.navItem}
              onPress={() => this.showAllHistoryPoints('allPolons')}
            >
              <Text style={s.navItemText}>полони</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              style={showType === 'incomePolons' ? s.navItemA : s.navItem}
              onPress={() => this.showAllHistoryPoints('incomePolons')}
            >
              <Text style={s.navItemText}>прихід</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              style={showType === 'outcomePolons' ? s.navItemA : s.navItem}
              onPress={() => this.showAllHistoryPoints('outcomePolons')}
            >
              <Text style={s.navItemText}>розхід</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              style={showType === 'inactivePolons' ? s.navItemA : s.navItem}
              onPress={() => this.showAllHistoryPoints('inactivePolons')}
            >
              <Text style={s.navItemText}>неактивні</Text>
            </TouchableOpacity>
          </View>
          <View style={s.list}>
            <ScrollView
              contentContainerStyle={s.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isUpdateLoading}
                  onRefresh={() => this.updateUserHandler()}
                />
              }
            >
              {renderItems}
            </ScrollView>
          </View>
        </View>
      </>
    );
  }
}
