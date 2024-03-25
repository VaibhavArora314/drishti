import React, { useRef, useState, useEffect } from "react";
import { View, Text, Button, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as Speech from 'expo-speech'; // Import speech from expo-speech

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status: camStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } =
        await Camera.requestMicrophonePermissionsAsync();

      setHasPermission(camStatus === "granted" && micStatus === "granted");
    })();
  }, []);

  useEffect(() => {
    if (hasPermission && isCameraReady) {
      startVideoStreaming();

      return () => {
        stopVideoStreaming();
      };
    }
  }, [hasPermission, isCameraReady]);

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

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const handlePressAnywhere = async () => {
    console.log("Pressed");

    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        console.log("Snapshot URI:", uri);
        // Now you can do something with the snapshot URI, such as display it or process it further
      } catch (error) {
        console.error("Failed to take snapshot:", error);
      }
    }

    Speech.speak("Hello, I am speaking some dummy text.");
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
        onCameraReady={handleCameraReady}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={handlePressAnywhere} />
      </Camera>
    </View>
  );
}
