import React, { useEffect, useState } from 'react';
import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        setHasPermission(cameraPermission === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }
  console.log('i am here')
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} />
    </View>
  );
}
