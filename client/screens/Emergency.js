import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

const SOSLocation = ({ sosEmails }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSendLocation = () => {
    if (location) {
      const message = `SOS Alert: Current Location - Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
      // Now you can send the location message to the SOS contacts
      sendSOSAlert(message);
    } else {
      setErrorMsg('Location Not Available');
    }
  };

  const sendSOSAlert = (message) => {
    console.log('Sending SOS Alert:', message);
    // Here you would typically send the SOS alert via email or some other method
    // For simplicity, we are logging the message to the console
    setErrorMsg('SOS Alert Sent');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Send SOS Location
        </Text>
      </View>

      <View style={styles.infoContainer}>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          location && (
            <Text style={styles.locationText}>
              Latitude: {location.coords.latitude.toFixed(6)}, Longitude: {location.coords.longitude.toFixed(6)}
            </Text>
          )
        )}
      </View>

      <TouchableOpacity onPress={handleSendLocation}>
        <View style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Send SOS Alert</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  locationText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'red',
    textAlign: 'center',
  },
  sendBtn: {
    backgroundColor: '#ff0000',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignSelf: 'center',
  },
  sendBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SOSLocation;