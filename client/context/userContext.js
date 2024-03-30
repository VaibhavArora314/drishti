import React, { createContext, useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native"; // Import AsyncStorage

const AuthContext = createContext();

function useAuth() {
  const value = useContext(AuthContext);
  return value;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sosEmails, setSosEmails] = useState([]);

  useEffect(() => {
    // Load data from AsyncStorage when component mounts
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const { user, isAuthenticated, sosEmails } = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(isAuthenticated);
          setSosEmails(sosEmails);
        }
      } catch (error) {
        console.error("Error loading user data from AsyncStorage:", error);
      }
    };
    loadUserData();
  }, []);

  const saveUserData = async () => {
    try {
      const userData = JSON.stringify({ user, isAuthenticated, sosEmails });
      await AsyncStorage.setItem("userData", userData);
    } catch (error) {
      console.error("Error saving user data to AsyncStorage:", error);
    }
  };

  useEffect(() => {
    // Save data to AsyncStorage whenever user, isAuthenticated, or sosEmails change
    saveUserData();
  }, [user, isAuthenticated, sosEmails]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        sosEmails,
        setSosEmails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, useAuth };
