import React, { createContext, useState, useContext, useEffect } from "react";
import { getData, storeData } from "../helpers/store";

const AuthContext = createContext();

function useAuth() {
  const value = useContext(AuthContext);
  return value;
}

const UserDataKey = "user",
  TokenDataKey = "token",
  SosEmailsKey = "emails";

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [sosEmails, setSosEmails] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = getData(UserDataKey);
    setUserDetails(userData ? userData : null);

    const token = getData(TokenDataKey);
    setUserToken(token ? token : null);

    const emailsList = getData(SosEmailsKey);
    setSosEmails(emailsList);

    if (userDetails && userDetails._id)
      setIsAuthenticated(true);
  },[]);

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        setUserDetails,
        userToken,
        setUserToken,
        isAuthenticated,setIsAuthenticated,
        sosEmails,
        setSosEmails,
        logout: () => {
          storeData(UserDataKey,null);
          setUserDetails(null);

          storeData(TokenDataKey,null);
          setUserToken(null);

          storeData(SosEmailsKey,null);
          setSosEmails([]);

          setIsAuthenticated(false);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, useAuth }; 