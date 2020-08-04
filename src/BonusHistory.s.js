import { StyleSheet } from 'react-native';
import { colors } from '../styles/global';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    paddingTop: '7.5%',
    marginHorizontal: 10,
  },
  title: { color: '#000', fontSize: 24, marginBottom: '5%' },
  nav: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
  },
  navItem: {
    backgroundColor: '#e1b38299',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  navItemA: {
    backgroundColor: '#e1b382',
    paddingVertical: 10,
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  navItemText: { fontSize: 17, color: colors.bg, textAlign: 'center', textAlignVertical: 'center' },
  list: {
    backgroundColor: '#e1b382',
    height: '83%',
    alignSelf: 'stretch',
    paddingTop: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  listContent: { alignItems: 'center' },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    backgroundColor: 'transparent',
    borderBottomColor: colors.bg,
    borderBottomWidth: 4,
    paddingVertical: 10,
  },
  historyItemNum: {
    alignItems: 'flex-end',
  },
  whiteText: { color: colors.bg, fontWeight: '700', fontSize: wp(4) < 20 ? 20 : wp(4) },
});
