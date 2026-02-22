import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useTranslation } from "@/localization/i18n";


const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={wp("20%")} color="#3B6790" />
        </View>
        <Text style={styles.userName}>{user?.fullName}</Text>
        <Text style={styles.userRole}>
          {user?.role === "ADMIN" && t("admin")}
          {user?.role === "MANAGER" && t("store_manager")}
          {user?.role === "USER" && t("user")}
        </Text>
        {user?.storeName && (
          <Text style={styles.storeName}>{user.storeName}</Text>
        )}
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  userSection: {
    padding: wp("5%"),
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  avatarContainer: {
    marginBottom: hp("3%"),
  },
  userName: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    color: "#3B6790",
    marginBottom: hp("0.5%"),
  },
  userRole: {
    fontSize: wp("3.5%"),
    color: "#4C7B8B",
    marginBottom: hp("0.5%"),
  },
  storeName: {
    fontSize: wp("3.5%"),
    color: "#666",
  },
  logoutText: {
    color: "#FF3B30",
  },
});

export default CustomDrawerContent;