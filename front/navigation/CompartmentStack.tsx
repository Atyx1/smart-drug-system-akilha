import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CompartmentScreen from "@/screens/manager/compartment/CompartmentScreen";
import AddCompartmentScreen from "@/screens/manager/compartment/AddCompartmentScreen";

export type CompartmentStackParamList = {
  Compartments: undefined;
  AddMedicine: { compartmentId: number };
};

const Stack = createStackNavigator<CompartmentStackParamList>();

const CompartmentStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Compartments" component={CompartmentScreen} />
      <Stack.Screen name="AddMedicine" component={AddCompartmentScreen} />
    </Stack.Navigator>
  );
};

export default CompartmentStack;
