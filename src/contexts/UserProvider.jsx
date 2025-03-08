import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserContext from "./UserContext";
import { fetchUserData } from "../api/api";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    userType: null,
    userId: null,
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (userType, userId) => {
    setLoading(true);
    setError(null);
    
    setUser({
      isAuthenticated: true,
      userType,
      userId,
    });
    
    // Fetch and store user data
    try {
      const response = await fetchUserData(
        { isAuthenticated: true, userType, userId },
        setUserData,
        setLoading,
        setError
      );
      console.log(`${userType} data loaded:`, response?.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
    }
  };

  const logout = () => {
    setUser({
      isAuthenticated: false,
      userType: null,
      userId: null,
    });
    setUserData(null);
    setError(null);
  };

  const updateUserData = (newData) => {
    setUserData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        userData, 
        loading, 
        error, 
        login, 
        logout,
        updateUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
