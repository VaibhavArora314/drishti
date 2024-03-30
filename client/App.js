import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/Login";
import SignUp from "./screens/Register";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProfileScreen from "./screens/Profile";
import SOSInput from "./screens/SOS_Input";
import CameraComponent from "./components/Camera";
import { AuthProvider, useAuth, AuthContext } from "./context/userContext";

const BottomTab = createBottomTabNavigator();
const AuthenticatedTabs = createBottomTabNavigator();

function Tabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#3c0a6b" },
        headerTintColor: "white",
      }}
    >
      <BottomTab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Register"
        component={SignUp}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="enter" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function AuthenticatedBottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#3c0a6b" },
        headerTintColor: "white",
      }}
    >
      <BottomTab.Screen name="Camera" component={CameraComponent} />

      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="SOS"
        component={SOSInput}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="help" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
export function App() {
  const user = useAuth();
  console.log(user);
  return (
    <>
      <NavigationContainer>
        {!user.isAuthenticated ? <Tabs /> :
        <AuthenticatedBottomTabs/>}
      </NavigationContainer>
    </>
  );
}

export default function Main() {
  return <AuthProvider>
    <App/>
  </AuthProvider>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});