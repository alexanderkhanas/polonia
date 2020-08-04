import axios from 'axios';
import { Alert } from 'react-native';

const handleErrors = e => {
  switch (e.message) {
    case 'Network Error':
      Alert.alert(
        'Пристрій не має доступу до мережі',
        "Під'єднайтесь до Wi-Fi або використайте стільникові дані",
      );
      break;
    default:
      break;
  }
};

export default {
  async post(url, data, options = {}) {
    const response = await axios.post(url, data, options).catch(handleErrors);
    return response;
  },
  async get(url, options = {}) {
    await axios.get(url, options).catch(handleErrors);
  },
};
