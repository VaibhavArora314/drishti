import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function ProfilePage({ email, name, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.info}>{name}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{email}</Text>
      </View>
      <TouchableOpacity onPress={onLogout}>
        <View style={styles.logoutBtn}>
          <Text style={styles.btnText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8ecf4",
  },
  title: {
    fontSize: 31,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    marginRight: 10,
  },
  info: {
    fontWeight: "400",
  },
  logoutBtn: {
    backgroundColor: "#ff6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});