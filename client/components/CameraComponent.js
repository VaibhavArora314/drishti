import React from 'react';
import { View } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraComponent() {
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} />
    </View>
  );
}
