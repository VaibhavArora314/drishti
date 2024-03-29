import React, { useRef, useState, useEffect } from "react";
import { View, Text, Button, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as Speech from 'expo-speech'; // Import speech from expo-speech
import axios from "axios";
import * as FileSystem from 'expo-file-system';

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

        // Convert image URI to base64 string
        const base64Image = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        // Make API call with image data
        try {
          const {data} = await axios.post("http://192.168.246.3:3000/predict", {
            image: base64Image // Pass image data as 'image' field in the request body
          });
          console.log(data);

          if (data.predictions && data.predictions.length > 0) 
            Speech.speak(data.predictions[0]);
        } catch (error) {
          console.log("Error while calling API:", error);
        }

      } catch (error) {
        console.error("Failed to take snapshot:", error);
      }
    }

    // Speech.speak("Hello, I am speaking some dummy text.");
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
