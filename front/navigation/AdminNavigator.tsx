import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, Platform, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "@/localization/i18n";
import { lightColors as colors } from "../constant/theme";

import ProfileScreen from "../screens/common/ProfileScreen";
import SettingsScreen from "../screens/common/SettingsScreen";
import ChangePasswordScreen from "../screens/common/ChangePasswordScreen";
import PrivacyScreen from "../screens/common/PrivacyScreen";
import AboutScreen from "../screens/common/AboutScreen";
import HomeScreen from "../screens/manager/HomeScreen";
import ActivityLogsScreen from "../screens/manager/ActivityLogsScreen";
import CompartmentUsageScreen from "../screens/manager/compartment/CompartmentUsageScreen";

import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Profile Stack Navigator - Profile and settings
const AdminProfileStackNavigator = () => {
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

// Admin UserStack - handles HomeScreen and CompartmentUsage navigation
const AdminUserStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: t("home"),
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
const AdminActivityLogsStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ActivityLogs"
        component={ActivityLogsScreen}
        options={{
          title: t("activity_logs"),
        }}
      />
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
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
          name="AdminHome"
          component={AdminUserStack}
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
          name="ActivityLogs"
          component={AdminActivityLogsStack}
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
                  name="calendar-clock"
                  size={wp("8%")}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="AdminSettings"
          component={AdminProfileStackNavigator}
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
  headerRightButton: {
    marginRight: wp("4%"),
    width: wp("10%"),
    height: wp("10%"),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("5%"),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerIcon: {
    transform: [{ rotate: "0deg" }],
  },
  tabBar: {
    backgroundColor: colors.background.primary,
    elevation: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    height: Platform.OS === "ios" ? hp("9%") : hp("8%"),
    paddingTop: hp("0.5%"),
    paddingBottom: Platform.OS === "ios" ? hp("1.5%") : hp("1%"),
  },
  tabBarLabel: {
    fontSize: wp("3%"),
    fontWeight: "500",
  },
});

export default AdminNavigator;
