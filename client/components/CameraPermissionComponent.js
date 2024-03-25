import React, { useRef, useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Camera } from "expo-camera";

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const startVideoStreaming = async () => {
    if (cameraRef.current) {
      try {
        const videoStream = await cameraRef.current.recordAsync();
        console.log("Video URI:", videoStream.uri);
      } catch (error) {
        console.error("Failed to start recording:", error);
      }
    }
  };

  const stopVideoStreaming = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Camera
        style={{ flex: 1, width: "100%" }}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
      />

      <Button title="Start Streaming" onPress={startVideoStreaming} />
      <Button title="Stop Streaming" onPress={stopVideoStreaming} />
    </View>
  );
}
