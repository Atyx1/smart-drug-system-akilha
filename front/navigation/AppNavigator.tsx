import React from "react";

import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import AdminNavigator from "./AdminNavigator";
import ManagerNavigator from "./ManagerNavigator";
import UserNavigator from "./UserNavigator";

const AppNavigator = () => {
  const { isAuthenticated, user } = useAuth();

  console.log("isAuthenticatedz", isAuthenticated);
  console.log("userzzz", user);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (user) {
    switch (user.role) {
      case "ADMIN":
        return <AdminNavigator />;
      case "MANAGER":
        return <ManagerNavigator />;
      case "USER":
        return <UserNavigator />;
      default:
        return <AuthNavigator />;
    }
  }

  return <AuthNavigator />;
};

export default AppNavigator;
