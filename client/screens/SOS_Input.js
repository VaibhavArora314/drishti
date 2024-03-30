import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SOSInput = () => {
  const [emails, setEmails] = useState(["", "", "", ""]);
  const [editing, setEditing] = useState(false);

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = () => {
    // Handle submission of SOS emails
  };

  const handleEdit = () => {
    setEditing(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            alt="SOS Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={{
              uri: "https://assets.withfra.me/SignIn.2.png",
            }}
          />
          <Text style={styles.title}>Set Up SOS Contacts</Text>
        </View>

        <View style={styles.form}>
          {emails.map((email, index) => (
            <View style={styles.inputContainer} key={index}>
              <Text style={styles.inputLabel}>Email Address {index + 1}</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(value) => handleEmailChange(index, value)}
                placeholder="Enter email address"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={email}
                editable={editing}
              />
            </View>
          ))}

          {editing ? (
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Save SOS Contacts</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEdit}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Edit</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 31,
    fontWeight: "700",
    color: "#1D2A32",
    marginTop: 20,
    marginBottom: 40,
    textAlign: "center",
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 36,
  },
  form: {},
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#075eec",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});

export default SOSInput;