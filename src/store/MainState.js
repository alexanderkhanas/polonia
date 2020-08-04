import React, { createContext, useReducer } from 'react';
import MainReducer from './MainReducer';
import { AsyncStorage } from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export const MainContext = createContext();

const initialState = {
  token: '',
  url: 'http://mefirst.lotemx.com',
  appId: '',
  isLoading: false,
  user: {},
  history: {
    incomePolons: {},
    outcomePolons: {},
    allPolons: {},
  },
  stack: null,
  isLoggedIn: false,
  referralLink: {},
};

export default function MainState({ children }) {
  const [state, dispatch] = useReducer(MainReducer, initialState);
  async function logout() {
    setToken(null);
    setUserParams({});
    await AsyncStorage.setItem('token', '');
    setLoggedIn(false);
  }
  function setStack(stack) {
    dispatch({ type: 'SET_STACK', payload: stack });
  }
  function setToken(idToken) {
    dispatch({ type: 'SET_TOKEN', payload: idToken });
  }
  async function setAppId(appId) {
    dispatch({ type: 'SET_ID', payload: appId });
    await setReferralLink(appId);
  }
  function setLoading(value) {
    dispatch({ type: 'SET_LOADING', payload: value });
  }
  function setLoggedIn(payload) {
    dispatch({ type: 'LOGIN', payload });
  }
  function setUserHistory(obj) {
    let incomeObj = {};
    let outcomeObj = {};
    let inactiveObj = {};
    Object.keys(obj).map((key, i) => {
      const el = obj[key];
      el.polon_key == 'coming' ? (incomeObj[key] = el) : (outcomeObj[key] = el);
      if (el.polon_status === 'inactive') inactiveObj[key] = el;
    });
    dispatch({
      type: 'HISTORY',
      payload: {
        incomePolons: incomeObj,
        outcomePolons: outcomeObj,
        inactivePolons: inactiveObj,
        allPolons: obj,
      },
    });
  }
  async function setReferralLink(appId) {
    const cachedDeepLink = await AsyncStorage.getItem('referralLink');
    const visibleLink = `polonia.com?invitedBy${appId}`;
    if (cachedDeepLink) {
      dispatch({ type: 'LINK', payload: { deepLink: cachedDeepLink, visibleLink } });
      return;
    }
    const deepLink = await dynamicLinks().buildLink({
      link: `https://polonia.com?invitedBy${appId}`,
      domainUriPrefix: 'https://jokerweb.page.link',
    });
    dispatch({ type: 'LINK', payload: { deepLink, visibleLink } });
    await AsyncStorage.setItem('referralLink', deepLink);
  }
  async function setUserParams(user) {
    dispatch({
      type: 'USER_DATA',
      payload: {
        ...user,
      },
    });
  }

  const { token, url, appId, isLoading, user, history, stack, isLoggedIn, referralLink } = state;
  console.log({ url });
  return (
    <MainContext.Provider
      value={{
        setToken,
        token,
        url,
        setAppId,
        appId,
        setLoading,
        isLoading,
        user,
        setUserParams,
        history,
        setUserHistory,
        stack,
        setStack,
        logout,
        isLoggedIn,
        setLoggedIn,
        setReferralLink,
        referralLink,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
