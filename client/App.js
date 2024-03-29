import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CameraComponent from './components/Camera';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <CameraComponent/>
      {/* <Text>12!</Text> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "100%"
  },
});
