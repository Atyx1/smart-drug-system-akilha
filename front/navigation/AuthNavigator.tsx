import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";

import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import MedicationRegisterScreen from "../screens/auth/RegisterScreen";

import RegistrationSuccessScreen from "../screens/auth/RegisterSuccessScreen";
import MedicationRegisterSuccessScreen from "../screens/auth/MedicationRegisterSuccessScreen";
import { AuthStackParamList } from "./navigation";

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen
        name="MedicationRegister"
        component={MedicationRegisterScreen}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="RegistrationSuccess"
        component={RegistrationSuccessScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="RegisterSuccess"
        component={MedicationRegisterSuccessScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
