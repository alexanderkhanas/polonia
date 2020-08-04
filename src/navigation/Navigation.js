import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeInfo from '../HomeInfo';
import { MainContext } from '../store/MainState';
import SmsConfirmation from '../SmsConfirmation';
import MyProfile from '../MyProfile';
import Sale from '../Sale';
import About from '../About';
import ReferralLink from '../ReferralLink';
import BonusHistory from '../BonusHistory';
import Login from '../Login';
import Register from '..//Register';
import CustomTabBar from './TabBar/TabBar';
import CodeActivation from '../CodeActivation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  const { isLoggedIn } = useContext(MainContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator initialRouteName="Головна" tabBar={props => <CustomTabBar {...props} />}>
          <Tab.Screen name="Головна" component={HomeInfo} />
          <Tab.Screen name="Профіль" component={MyProfile} />
          <Tab.Screen name="Історія" component={BonusHistory} />
          <Tab.Screen name="Акція" component={Sale} />
          <Tab.Screen name="Про нас" component={About} />
          <Tab.Screen name="code" component={CodeActivation} />
          <Tab.Screen name="referral" component={ReferralLink} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login" headerMode={{ headerVisible: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="SMS" component={SmsConfirmation} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default MainNavigation;
