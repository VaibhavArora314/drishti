import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as Speech from 'expo-speech';

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();

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
        await cameraRef.current.recordAsync();
      } catch (error) {
        console.error("Failed to start recording:", error);
      }
    }
  };

  const stopVideoStreaming = async () => {
    if (cameraRef.current) {
      await cameraRef.current.stopRecording();
    }
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const handlePress = async () => {
    console.log("Pressed");

    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        console.log("Snapshot URI:", uri);
        
        // Now you can send the image to a dummy API
        // await sendImageToAPI(uri);
      } catch (error) {
        console.error("Failed to take snapshot:", error);
      }
    }

    Speech.speak("Hello, I am speaking some dummy text.");
  };

  const sendImageToAPI = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: 'image/jpeg', // adjust the image type based on your requirement
        name: 'image.jpg', // adjust the file name based on your requirement
      });

      const response = await fetch("YOUR_DUMMY_API_ENDPOINT", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          // Add any other required headers here
        },
      });

      if (response.ok) {
        console.log("Image sent successfully!");
        // Handle success response from the API
      } else {
        console.error("Failed to send image:", response.statusText);
        // Handle error response from the API
      }
    } catch (error) {
      console.error("Failed to send image:", error.message);
      // Handle network errors or other exceptions
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        onCameraReady={handleCameraReady}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={handlePress} />
      </Camera>
    </View>
  );
}
