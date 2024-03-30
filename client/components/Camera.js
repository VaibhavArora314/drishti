import React, { useRef, useState, useEffect } from "react";
import { View, Text, Button, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as Speech from 'expo-speech'; // Import speech from expo-speech
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect hook
import { useAuth } from "../context/userContext";

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [snapshotExecution, setSnapshotExecution] = useState(false);
  const [lastTap, setLastTap] = useState(null);
  const cameraRef = useRef(null);
  const user = useAuth();

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
  
  // const getLocation = async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== 'granted') {
  //       setErrorMsg('Permission to access location was denied');
  //       return null;
  //     }

  //    return await Location.getCurrentPositionAsync({});
  // }

  const handlePressAnywhere = async () => {
    // const now = new Date().getTime();
    // const DOUBLE_PRESS_DELAY = 300; // Adjust this delay as needed

    // if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
    //   // Double tap detected
    //   console.log("Double tapped");

    //   const location = await getLocation();
    //   let latitude = null;
    //   let longitude = null;
    //   if (location) {
    //     latitude = location.coords.latitude;
    //     longitude = location.coords.longitude;
    //   }

    //   const response = await axios.post(`/api/user/sos-detected/${longitude}/${latitude}`)

    //   setLastTap(null);
    //   return;
    // }

    // setLastTap(now);

    if (snapshotExecution)
      return;

    setSnapshotExecution(true);
    console.log("Pressed");

    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        console.log("Snapshot URI:", uri);

        const base64Image = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        try {
          const { data } = await axios.post("/predict", {
            image: base64Image
          });
          console.log(data);

          if (data.predictions && data.predictions.length > 0)
            Speech.speak(data.predictions);
            // Speech.speak(data.predictions[0]);
        } catch (error) {
          console.log("Error while calling API:", error);
        }

      } catch (error) {
        console.error("Failed to take snapshot:", error);
      }
    }

    // Speech.speak("Hello, I am speaking some dummy text.");
    setSnapshotExecution(false);
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