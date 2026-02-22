import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, Platform, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "@/localization/i18n";
import { lightColors as colors } from "../constant/theme";

import PendingApprovalScreen from "../screens/user/PendingApprovalScreen"; // Will represent medication tracking dashboard
import ProfileScreen from "../screens/common/ProfileScreen";
import SettingsScreen from "../screens/common/SettingsScreen";
import ChangePasswordScreen from "../screens/common/ChangePasswordScreen";
import CustomDrawerContent from "./CustomDraverContent";

import { SafeAreaView } from "react-native-safe-area-context";
import PrivacyScreen from "../screens/common/PrivacyScreen";
import AboutScreen from "../screens/common/AboutScreen";
import MedicationTrackingStackNavigator from "./MedicationTrackingStackNavigator";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Profile Stack Navigator - Profile and settings
const UserProfileStackNavigator = () => {
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

// Settings Stack Navigator - Device and application settings
const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeviceSettings" component={SettingsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="DataPrivacy" component={PrivacyScreen} />
      <Stack.Screen name="AboutMedTracker" component={AboutScreen} />
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
        name="PatientProfile"
        component={ProfileScreen}
        options={{
          title: t("patient_profile"),
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
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
            <MaterialCommunityIcons
              name="medical-bag"
              size={wp("6%")}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Ana Tab Navigator
const UserNavigator = () => {
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
          name="MedicationTracking"
          component={MedicationTrackingStackNavigator}
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
        />
        <Tab.Screen
          name="PatientData"
          component={UserProfileStackNavigator}
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

export default UserNavigator;
