import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Icon } from 'native-base';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Barcode from 'react-native-barcode-builder';
import { globalStyles, colors } from '../styles/global';
import { MainContext } from './store/MainState';
import GestureRecognizer from 'react-native-swipe-gestures';
import MainWrapper from './wrappers/MainWrapper';

export default class CodeActivation extends Component {
  state = {
    barcodeValue: '',
  };
  static contextType = MainContext;
  setBarcodeValue(appId, time) {
    this.setState({ ...this.state, barcodeValue: '' });
    let code = '29' + appId + time;
    let controlValue = this.getLastBarcodeNumber(code);
    this.setState({
      ...this.state,
      barcodeValue: `${code}${controlValue}`,
    });
  }
  getLastBarcodeNumber(code) {
    let even = 0;
    let odd = 0;
    for (let i = 0; i < code.length; i++) {
      i % 2 === 0 ? (even += +code[i]) : (odd += +code[i]);
    }
    let sum = `${+even + +odd * 3}`;
    if (sum[sum.length - 1] === '0') {
      return 0;
    } else {
      return 10 - +sum[sum.length - 1];
    }
  }
  getTimeForBarcode() {
    const date = new Date();
    let hours = `${date.getHours()}`;
    let minutes = `${date.getMinutes()}`;
    if (minutes.length === 1) {
      minutes = '0' + minutes;
    }
    if (hours.length === 1) {
      hours = '0' + hours;
    }
    return hours + minutes;
  }
  async componentDidMount() {
    this.setBarcodeValue(this.context.appId, 10000 - +this.getTimeForBarcode());
  }

  render() {
    return (
      <MainWrapper>
        <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <View>
              <Text style={styles.title}>Зіскануйте штрих код</Text>
            </View>
            <View
              style={{
                ...styles.wrapBarCode,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {this.state.barcodeValue.length === 13 ? (
                <Barcode
                  value={this.state.barcodeValue}
                  format="EAN13"
                  height={120}
                  flat
                  background="transparent"
                  lineColor="#32100D"
                />
              ) : (
                <Text />
              )}
            </View>
          </View>
        </View>
      </MainWrapper>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: colors.dark,
    marginTop: 30,
  },
  wrapBarCode: {
    marginTop: 20,
    marginLeft: '5%',
    width: '90%',
  },
});
