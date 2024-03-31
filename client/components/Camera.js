import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as Speech from "expo-speech";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { useFocusEffect, useIsFocused } from "@react-navigation/native"; // Import useFocusEffect and useIsFocused hooks
import { useAuth } from "../context/userContext";

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [snapshotExecution, setSnapshotExecution] = useState(false);
  const cameraRef = useRef(null);
  const user = useAuth();
  const isFocused = useIsFocused(); // Check if the screen is focused

  useEffect(() => {
    (async () => {
      const { status: camStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } =
        await Camera.requestMicrophonePermissionsAsync();

      setHasPermission(camStatus === "granted" && micStatus === "granted");
    })();
  }, [isFocused]);

  useEffect(() => {
    if (hasPermission && isCameraReady) {
      startVideoStreaming();

      return () => {
        stopVideoStreaming();
      };
    }
  }, [hasPermission, isCameraReady, isFocused]);

  useFocusEffect(() => {
    // Called when the component gains focus
    return () => {
      // Clean-up function when the component loses focus
      setSnapshotExecution(false);
    };
  });

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
      cameraRef.current.stopRecording();
    }
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const handlePressAnywhere = async () => {
    if (snapshotExecution) return;

    setSnapshotExecution(true);
    console.log("Pressed");

    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        console.log("Snapshot URI:", uri);

        const base64Image = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        try {
          const { data } = await axios.post("/predict", { image: base64Image });
          console.log(data);

          if (data.predictions && data.predictions.length > 0)
            Speech.speak(data.predictions);
        } catch (error) {
          console.log("Error while calling API:", error);
        }
      } catch (error) {
        console.error("Failed to take snapshot:", error);
      }
    }

    setSnapshotExecution(false);
  };

  if (!isFocused || hasPermission === null) {
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
