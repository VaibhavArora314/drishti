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

  useEffect(() => {
    const userData = getData(UserDataKey);
    setUserDetails(userData ? userData : null);

    const token = getData(TokenDataKey);
    setUserToken(token ? token : null);

    const emailsList = getData(SosEmailsKey);
    setSosEmails(emailsList);
  },[]);

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        setUserDetails: (data) => {
          if (data) storeData(UserDataKey,data);
          setUserDetails(data ? data : null);
        },
        userToken,
        setUserToken: (data) => {
          if (data) storeData(TokenDataKey,data);
          setUserToken(data ? data : null);
        },
        isAuthenticated: () => {
          return (userDetails && userDetails._id) ? true : false;
        },
        sosEmails,
        setSosEmails: (data) => {
          storeData(SosEmailsKey, data ? data : []);
          setSosEmails(data ? data : []);
        },
        logout: () => {
          storeData(UserDataKey,null);
          setUserDetails(null);

          storeData(TokenDataKey,null);
          setUserToken(null);

          storeData(SosEmailsKey,null);
          setSosEmails([]);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, useAuth }; 