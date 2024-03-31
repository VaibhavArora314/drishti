import AsyncStorage from '@react-native-async-storage/async-storage';

// Storing data
const storeData = async (key, value) => {
  try {
    if (value == null) {
      removeData(key);
      return;
    }
    await AsyncStorage.setItem(key, value);
    console.log('Data stored successfully.');
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Retrieving data
const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('Data retrieved successfully:', value);
      return value;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};

// Removing data
const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('Data removed successfully.');
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

export {
    getData,
    storeData,
    removeData
}