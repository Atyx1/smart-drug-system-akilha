import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "@/localization/i18n";
import { CommonActions } from "@react-navigation/native";

// Common Screens
import ProfileScreen from "../screens/common/ProfileScreen";

import SettingsScreen from "../screens/common/SettingsScreen";
import CompartmentScreen from "@/screens/manager/compartment/CompartmentScreen";
import CompartmentStack from "@/navigation/CompartmentStack";
import CompartmentUsageScreen from "@/screens/manager/compartment/CompartmentUsageScreen";
import DeviceNavigator from "@/navigation/DeviceNavigator";

import ChangePasswordScreen from "../screens/common/ChangePasswordScreen";
import PrivacyScreen from "../screens/common/PrivacyScreen";
import AboutScreen from "../screens/common/AboutScreen";

// Custom Drawer
import CustomDrawerContent from "./CustomDraverContent";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import HomeScreen from "@/screens/manager/HomeScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { FONTS, lightColors } from "@/constant/theme";

import { lightColors as colors } from "../constant/theme";

import { SafeAreaView } from "react-native-safe-area-context";
import ActivityLogsScreen from "@/screens/manager/ActivityLogsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Settings Stack Navigator - Medication tracking system settings
const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MedicationSettings" component={SettingsScreen} />
      <Stack.Screen name="SecuritySettings" component={ChangePasswordScreen} />
      <Stack.Screen name="PatientPrivacy" component={PrivacyScreen} />
      <Stack.Screen name="AboutMedTracker" component={AboutScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator - Profile and settings
const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  );
};

const ProfileDrawerNavigator = () => {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          width: wp("70%"),
        },
        drawerItemStyle: {
          marginVertical: hp("1%"),
          borderRadius: wp("2%"),
          marginHorizontal: wp("2%"),
          paddingVertical: hp("1.5%"),
        },
        drawerLabelStyle: {
          marginLeft: -wp("2%"),
          fontSize: wp("4%"),
          fontWeight: "500",
        },
        drawerPosition: "right",
        drawerActiveBackgroundColor: "#E8F1F8",
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text.secondary,
        headerShown: false,
      })}
    >
      <Drawer.Screen
        name="DoctorProfile"
        component={ProfileScreen}
        options={{
          title: t("doctor_profile"),
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="doctor"
              size={wp("6%")}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="DeviceSettings"
        component={SettingsStackNavigator}
        options={{
          title: t("device_settings"),
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="pill" size={wp("6%")} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const UserStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: lightColors.primary,
        },
        headerTintColor: lightColors.text.inverse,
        headerTitleStyle: {
          fontWeight: FONTS.weight.bold as any,
        },
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: t("home"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CompartmentUsage"
        component={CompartmentUsageScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

// ActivityLogs Stack Navigator
const ActivityLogsStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: lightColors.primary,
        },
        headerTintColor: lightColors.text.inverse,
        headerTitleStyle: {
          fontWeight: FONTS.weight.bold as any,
        },
      }}
    >
      <Stack.Screen
        name="MedicationLogs"
        component={ActivityLogsScreen}
        options={{
          title: t("medication_logs"),
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

// Doctor Dashboard Stack Navigator
const ManagerTasksStackNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorDashboard" component={HomeScreen} />
    </Stack.Navigator>
  );
};

// Main Navigator
const ManagerNavigator = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.primary,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: hp("1%"),
            paddingBottom: hp("1%"),
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={UserStack}
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: -hp("1%"),
                }}
              >
                <MaterialCommunityIcons
                  name="home"
                  size={wp("8%")}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Compartments"
          component={CompartmentStack}
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: -hp("1%"),
                }}
              >
                <MaterialCommunityIcons
                  name="pill"
                  size={wp("8%")}
                  color={color}
                />
              </View>
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();

              // Reset the stack to the initial route
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Compartments" }],
                })
              );
            },
          })}
        />

        <Tab.Screen
          name="DeviceManagement"
          component={DeviceNavigator}
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: -hp("1%"),
                }}
              >
                <MaterialCommunityIcons
                  name="devices"
                  size={wp("8%")}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="MedicationHistory"
          component={ActivityLogsStack}
          options={{
            headerShown: false,
            tabBarLabel: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: -hp("1%"),
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={wp("8%")}
                  color={color}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="DoctorSettings"
          component={ProfileStackNavigator}
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: -hp("1%"),
                }}
              >
                <MaterialCommunityIcons
                  name="account"
                  size={wp("8%")}
                  color={color}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    height: Platform.OS === "ios" ? hp("11%") : hp("9%"),
    paddingBottom: Platform.OS === "ios" ? hp("2%") : hp("1%"),
    paddingTop: hp("1%"),
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  tabBarLabel: {
    fontSize: wp("4%"),
    fontWeight: "500",
  },
});

export default ManagerNavigator;
