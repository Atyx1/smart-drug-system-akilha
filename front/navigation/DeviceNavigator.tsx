import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useTranslation } from "@/localization/i18n";
import { useTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

// Import screens
import DeviceRequestsScreen from "@/screens/manager/DeviceRequestsScreen";
import ApprovedUsersScreen from "@/screens/manager/ApprovedUsersScreen";

const Tab = createMaterialTopTabNavigator();

const DeviceNavigator = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const TabBarLabel = ({
    focused,
    iconName,
  }: {
    focused: boolean;
    iconName: any;
  }) => (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <MaterialCommunityIcons
        name={iconName}
        size={wp("7%")}
        color={focused ? colors.primary : colors.text.secondary}
      />
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.primary,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
          height: 3,
        },
        tabBarLabelStyle: {
          fontSize: wp("3.5%"),
          fontWeight: "600",
          textTransform: "none",
        },
        tabBarPressColor: colors.primary,
      }}
    >
      <Tab.Screen
        name="DeviceRequests"
        component={DeviceRequestsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} iconName="file-document-outline" />
          ),
        }}
      />
      <Tab.Screen
        name="ApprovedUsers"
        component={ApprovedUsersScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} iconName="account-check" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DeviceNavigator;
