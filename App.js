import React, { useEffect, useContext } from 'react';
import MainState, { MainContext } from './src/store/MainState';
import { StatusBar, NativeModules, Platform, AsyncStorage } from 'react-native';
import Navigation from './src/navigation/Navigation';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import SplashScreen from 'react-native-splash-screen';
import AXIOS from './src/utils/AXIOS';

async function registerAppWithFCM() {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
}

const StateWrapper = () => (
  <MainState>
    <App />
  </MainState>
);

const App = () => {
  const handleDynamicLink = link => {
    console.log(link);
  };

  const state = useContext(MainContext);
  useEffect(() => {
    (async () => {
      try {
        // const url = await firebase.links().getInitialLink();
        // console.log('incoming url', url);
        StatusBar.setHidden(true);
        registerAppWithFCM();
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

        const token = await AsyncStorage.getItem('token');
        if (token) {
          const { data } = await AXIOS.post(state.url + '/wp-json/api/get_user_by_token', {
            token,
          });

          if (data.status === 'true') {
            const { user_data } = data;
            state.setToken(token);
            state.setAppId(user_data.app_id);
            state.setUserParams({
              firstName: user_data.first_name,
              lastName: user_data.last_name,
              birthday: user_data.birth_day,
              userPhone: user_data.user_phone,
              polonNumber: user_data.polon_number,
              notActivePolons: user_data.polon_no_active,
              notActivePolonsInfo: user_data.polon_no_active_infi,
            });
            await state.setReferralLink(user_data.app_id);
            state.setLoggedIn(true);
          }
        }
        SplashScreen.hide();
        return unsubscribe;
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return <Navigation />;
};

export default StateWrapper;
