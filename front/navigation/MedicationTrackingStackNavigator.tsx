// src/navigation/MedicationTrackingStackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PendingApprovalScreen from "../screens/user/PendingApprovalScreen";
import ConnectToDeviceScreen from "../screens/device/ConnectToDeviceScreen";
import ViewRelativeDeviceScreen from "../screens/device/ViewRelativeDeviceScreen";

const Stack = createStackNavigator();

const MedicationTrackingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PendingApproval" component={PendingApprovalScreen} />
      <Stack.Screen name="ConnectToDevice" component={ConnectToDeviceScreen} />
      <Stack.Screen
        name="ViewRelativeDevice"
        component={ViewRelativeDeviceScreen}
      />
    </Stack.Navigator>
  );
};

export default MedicationTrackingStackNavigator;
