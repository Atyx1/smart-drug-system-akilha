import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "@/localization/i18n";

const AdminProfileScreen = () => {
  const { user, checkUserUpdate, logout } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  useEffect(() => {
    checkUserUpdate();
  }, []);

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case "PENDING":
        return t("status_pending");
      case "APPROVED":
        return t("status_approved");
      case "REJECTED":
        return t("status_rejected");
      default:
        return user?.active ? t("status_active") : t("status_inactive");
    }
  };

  const getStatusColor = () => {
    if (!user?.active) return colors.error;
    switch (user?.status as string) {
      case "PENDING":
        return colors.warning;
      case "APPROVED":
        return colors.success;
      case "REJECTED":
        return colors.error;
      default:
        return colors.success;
    }
  };

  const renderInfoItem = (
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    label: string,
    value: string | undefined,
    showBorder: boolean = true
  ) => (
    <View style={[styles.infoItem, showBorder && styles.borderBottom]}>
      <MaterialCommunityIcons
        name={icon}
        size={wp("6%")}
        color={colors.primary}
      />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "-"}</Text>
      </View>
    </View>
  );

  const renderActionItem = (
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    label: string,
    onPress: () => void,
    showBorder: boolean = true,
    isDestructive: boolean = false
  ) => (
    <TouchableOpacity
      style={[styles.actionItem, showBorder && styles.borderBottom]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={icon}
        size={wp("6%")}
        color={isDestructive ? colors.error : colors.primary}
      />
      <View style={styles.infoTextContainer}>
        <Text
          style={[styles.actionLabel, isDestructive && { color: colors.error }]}
        >
          {label}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={wp("5%")}
        color={colors.text.tertiary}
      />
    </TouchableOpacity>
  );

  const getRoleText = (role: string | undefined) => {
    switch (role) {
      case "ADMIN":
        return t("admin");
      case "MANAGER":
        return t("manager");
      case "USER":
        return t("user");
      default:
        return "-";
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t("end_admin_session"),
      "Oturumunuzu sonlandırmak istediğinizden emin misiniz?",
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("yes"),
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const handleSystemSettings = () => {
    // Navigate to system settings
    console.log("System settings pressed");
  };

  const handleChangePassword = () => {
    // Navigate to change password
    console.log("Change password pressed");
  };

  const handlePrivacySettings = () => {
    // Navigate to privacy settings
    console.log("Privacy settings pressed");
  };

  const handleAbout = () => {
    // Navigate to about
    console.log("About pressed");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons
            name="shield-account"
            size={wp("30%")}
            color={colors.primary}
          />
        </View>

        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.roleText}>
          {getRoleText(user?.role)} - {t("admin_dashboard")}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("personal_info")}</Text>
        {renderInfoItem(
          "account-circle-outline",
          t("full_name"),
          user?.fullName
        )}
        {renderInfoItem("email-outline", t("email"), user?.email)}
        {renderInfoItem("account-outline", t("username"), user?.username)}
        {renderInfoItem(
          "shield-outline",
          "Rol",
          getRoleText(user?.role),
          false
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("system_settings")}</Text>
        {renderActionItem(
          "cog-outline",
          "Sistem Ayarları",
          handleSystemSettings
        )}
        {renderActionItem(
          "key-outline",
          "Şifre Değiştir",
          handleChangePassword
        )}
        {renderActionItem(
          "shield-check-outline",
          "Gizlilik Ayarları",
          handlePrivacySettings
        )}
        {renderActionItem(
          "information-outline",
          "Hakkında",
          handleAbout,
          false
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Oturum</Text>
        {renderActionItem(
          "logout",
          t("end_admin_session"),
          handleLogout,
          false,
          true
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: typeof import("@/constant/theme").lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
    header: {
      alignItems: "center",
      padding: wp("5%"),
      backgroundColor: colors.background.primary,
      borderBottomLeftRadius: wp("5%"),
      borderBottomRightRadius: wp("5%"),
      ...Platform.select({
        ios: {
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    avatarContainer: {
      marginBottom: hp("2%"),
      padding: wp("2%"),
      width: wp("40%"),
      height: wp("40%"),
      justifyContent: "center",
      alignItems: "center",
    },
    name: {
      fontSize: wp("6%"),
      fontWeight: "bold",
      color: colors.text.primary,
      marginBottom: hp("0.5%"),
    },
    roleText: {
      fontSize: wp("4%"),
      color: colors.text.secondary,
      fontWeight: "500",
    },
    card: {
      backgroundColor: colors.background.primary,
      margin: wp("4%"),
      borderRadius: wp("4%"),
      padding: wp("4%"),
      ...Platform.select({
        ios: {
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    sectionTitle: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: colors.text.secondary,
      marginBottom: hp("2%"),
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: hp("1.5%"),
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: hp("1.5%"),
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    infoTextContainer: {
      marginLeft: wp("4%"),
      flex: 1,
    },
    infoLabel: {
      fontSize: wp("3.5%"),
      color: colors.text.tertiary,
    },
    infoValue: {
      fontSize: wp("4%"),
      color: colors.text.primary,
      fontWeight: "500",
      marginTop: hp("0.5%"),
      flexWrap: "wrap",
      flex: 1,
    },
    actionLabel: {
      fontSize: wp("4%"),
      color: colors.text.primary,
      fontWeight: "500",
    },
  });

export default AdminProfileScreen;
