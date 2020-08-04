import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export const colors = {
  light: '#e1b382',
  bg: '#FCF6F3',
  dark: '#444444',
  brown: '#8F5112',
};
export const globalStyles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  container: {
    flex: 1,
    backgroundColor: '#32100D',
    minHeight: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },

  signInRegisterWrapper: {
    width: wp(100),
    maxWidth: 350,
    display: 'flex',
  },

  signIn: {
    width: 150,
    textAlign: 'center',
    fontSize: 30,
    color: '#F7C077',
    borderBottomColor: '#F7C077',
    borderBottomWidth: 3,
    paddingBottom: 7,
  },

  signInWhite: {
    width: 150,
    fontSize: 30,
    color: '#EEEEEE',
    textAlign: 'center',
  },

  register: {
    width: 170,
    fontSize: 30,
    color: '#EEEEEE',
    textAlign: 'center',
  },

  registerBorder: {
    width: 170,
    textAlign: 'center',
    fontSize: 30,
    color: '#F7C077',
    borderBottomColor: '#F7C077',
    borderBottomWidth: 3,
    paddingBottom: 7,
  },

  sms: {
    marginBottom: 20,
  },

  textInput: {
    fontSize: 18,
    marginTop: 60,
    marginBottom: 50,
    width: 337,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    textAlign: 'center',
    color: '#EEEEEE',
    paddingBottom: 10,
  },

  nameWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  gestureContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    fontWeight: 'bold',
  },
  nameInput: {
    fontSize: hp('2.5%'),
    width: 125,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    textAlign: 'center',
    color: '#EEEEEE',
    paddingBottom: hp('1%'),
  },

  codeInput: {
    fontSize: hp('2.5%'),
    width: '100%',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    textAlign: 'center',
    color: '#EEEEEE',
    marginTop: 25,
    paddingBottom: hp('1%'),
  },

  numberDateInput: {
    fontSize: hp('2.5%'),
    width: '100%',
    paddingBottom: hp('1%'),
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    textAlign: 'center',
    color: '#EEEEEE',
    marginTop: 25,
  },

  parentIdInput: {
    fontSize: hp('2.5%'),
    width: '100%',
    paddingBottom: hp('1%'),
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    textAlign: 'center',
    color: '#EEEEEE',
    marginTop: 25,
  },

  logoImg: {
    marginTop: 0,
    width: hp('20%'),
    height: hp('20%'),
  },

  btnSignIn: {
    maxWidth: 337,
    width: wp(100),
    height: 63,
    backgroundColor: '#F7C077',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  registerBtnContainer: {
    marginTop: 10,
  },

  registerBtnWrapper: {
    width: wp(100),
    height: 63,
    maxWidth: 337,
    backgroundColor: '#F7C077',
    marginTop: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textBtn: {
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  registerBtn: {
    fontSize: hp('3.5'),
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  wrapperHamburg: {
    zIndex: 10000000,
    position: 'absolute',
    left: 20,
    top: 20,
  },
  hamburg: {
    color: '#fff',
    fontSize: 40,
    zIndex: 10000000,
  },
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  mainLoginContainer: {
    backgroundColor: colors.light,
    padding: 20,
    width: wp(95),
    borderRadius: 24,
    position: 'relative',
    height: hp(30),
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(8),
  },
  beerImage: {
    position: 'absolute',
    top: -hp(9),
  },
});
