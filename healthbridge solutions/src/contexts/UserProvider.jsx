import { useState } from "react";
import PropTypes from "prop-types";
import UserContext from "./UserContext";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    userType: null,
    userId: null,
  });

  const login = (userType, userId) => {
    setUser({
      isAuthenticated: true,
      userType,
      userId,
    });
  };

  const logout = () => {
    setUser({
      isAuthenticated: false,
      userType: null,
      userId: null,
    });
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
