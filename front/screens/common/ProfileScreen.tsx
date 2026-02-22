import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Switch,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "@/localization/i18n";
import {
  addConnectionStatusListener,
  getConnectionStatus,
} from "@/api/ConnectWebSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const { user, checkUserUpdate, logout } = useAuth();
  const { colors, theme, setTheme, activeColorScheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState(true);
  const [wsConnectionStatus, setWsConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");

  useEffect(() => {
    checkUserUpdate();
    loadNotificationSettings();
  }, []);

  // WebSocket bağlantı durumunu takip et
  useEffect(() => {
    const unsubscribe = addConnectionStatusListener(setWsConnectionStatus);
    return unsubscribe;
  }, []);

  // Bildirim ayarlarını yükle
  const loadNotificationSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem(
        "notifications_enabled"
      );
      if (savedNotifications !== null) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error("Bildirim ayarları yüklenirken hata:", error);
    }
  };

  // Bildirim ayarlarını kaydet
  const saveNotificationSettings = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(
        "notifications_enabled",
        JSON.stringify(enabled)
      );
      setNotifications(enabled);
      console.log("🔔 [PROFILE] Bildirim ayarları kaydedildi:", enabled);
    } catch (error) {
      console.error(
        "🔔 [PROFILE] Bildirim ayarları kaydedilirken hata:",
        error
      );
    }
  };

  const getThemeIconName = () => {
    if (theme === "light") return "weather-sunny";
    if (theme === "dark") return "weather-night";
    return "theme-light-dark";
  };

  const getThemeText = () => {
    if (theme === "light") return "Açık Tema";
    if (theme === "dark") return "Koyu Tema";
    return (
      "Sistem Teması" +
      " (" +
      (activeColorScheme === "light" ? "Açık" : "Koyu") +
      ")"
    );
  };

  const getLanguageFlag = () => {
    return language === "tr" ? "🇹🇷" : "🇬🇧";
  };

  const getLanguageText = () => {
    return language === "tr" ? "Türkçe" : "English";
  };

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

  const StatusBadge = () => {
    const statusColor = getStatusColor();
    return (
      <View
        style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}
      >
        <MaterialCommunityIcons
          name={user?.active ? "check-circle" : "alert-circle"}
          size={wp("4%")}
          color={statusColor}
        />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {getStatusText(user?.status)}
        </Text>
      </View>
    );
  };

  const renderInfoItem = (
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    label: string,
    value: string | undefined
  ) => (
    <View style={styles.infoItem}>
      <MaterialCommunityIcons
        name={icon}
        size={wp("5%")}
        color={colors.primary}
      />
      <View style={styles.infoTextContainer}>
        <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: colors.text.primary }]}>
          {value || "-"}
        </Text>
      </View>
    </View>
  );

  const getRoleText = (role: string | undefined) => {
    switch (role) {
      case "ADMIN":
        return "Ebeveyn/Yakın";
      case "MANAGER":
        return "Cihaz Sahibi";
      case "USER":
        return "Kullanıcı";
      default:
        return "-";
    }
  };

  const renderActionItem = (
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    label: string,
    onPress: () => void,
    isDestructive: boolean = false
  ) => (
    <TouchableOpacity
      style={[
        styles.actionItem,
        isDestructive && { backgroundColor: `${colors.error}10` },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={icon}
        size={wp("5%")}
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
        size={wp("4.5%")}
        color={colors.text.secondary}
      />
    </TouchableOpacity>
  );

  const renderSettingItem = (
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    label: string,
    rightComponent: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <MaterialCommunityIcons
        name={icon}
        size={wp("5%")}
        color={colors.primary}
      />
      <View style={styles.infoTextContainer}>
        <Text style={[styles.actionLabel, { color: colors.text.primary }]}>
          {label}
        </Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const handleLogout = () => {
    const sessionText =
      user?.role === "ADMIN"
        ? "Ebeveyn Oturumunu Sonlandır"
        : "Cihaz Sahibi Oturumunu Sonlandır";
    Alert.alert(
      sessionText,
      "Oturumunuzu sonlandırmak istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Evet",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const handleSettings = () => {
    // DeviceManagement tab'ına yönlendir
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate("DeviceManagement");
    }
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePasswordScreen" as never);
  };

  const handlePrivacy = () => {
    navigation.navigate("PrivacyScreen" as never);
  };

  const handleAbout = () => {
    navigation.navigate("AboutScreen" as never);
  };

  const getConnectionStatusInfo = () => {
    switch (wsConnectionStatus) {
      case "connected":
        return {
          icon: "wifi" as const,
          text: "Bağlı",
          color: colors.success,
          bgColor: `${colors.success}15`,
          description: "Cihaz ile bağlantı aktif",
        };
      case "connecting":
        return {
          icon: "wifi-strength-1" as const,
          text: "Bağlanıyor",
          color: colors.warning,
          bgColor: `${colors.warning}15`,
          description: "Cihaza bağlanmaya çalışılıyor",
        };
      case "error":
        return {
          icon: "wifi-strength-alert-outline" as const,
          text: "Hata",
          color: colors.error,
          bgColor: `${colors.error}15`,
          description: "Bağlantı hatası oluştu",
        };
      default:
        return {
          icon: "wifi-off" as const,
          text: "Bağlı Değil",
          color: colors.text.secondary,
          bgColor: `${colors.text.secondary}15`,
          description: "Cihaz ile bağlantı yok",
        };
    }
  };

  const handleConnectionPress = () => {
    // Kullanıcı rolüne göre doğru navigation
    const parentNavigator = navigation.getParent();
    if (parentNavigator) {
      if (user?.role === "ADMIN") {
        // Admin için ActivityLogs
        parentNavigator.navigate("ActivityLogs");
      } else {
        // Manager için MedicationHistory
        parentNavigator.navigate("MedicationHistory");
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatarBackground,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
        </View>

        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.roleContainer,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            <MaterialCommunityIcons
              name={
                user?.role === "ADMIN"
                  ? "shield-crown"
                  : user?.role === "MANAGER"
                  ? "account-tie"
                  : "account"
              }
              size={wp("4%")}
              color={colors.primary}
            />
            <Text style={[styles.role, { color: colors.primary }]}>
              {getRoleText(user?.role)}
            </Text>
          </View>
          <StatusBadge />
        </View>
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
        {renderInfoItem("shield-outline", "Rol", getRoleText(user?.role))}
      </View>

      {user?.role === "MANAGER" && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cihaz Yönetimi</Text>
          {renderActionItem("account-multiple-check", "Yakın İstekleri", () => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate("DeviceManagement", { screen: "DeviceRequests" });
            }
          })}
          {renderActionItem("account-group", "Onaylı Yakınlar", () => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate("DeviceManagement", { screen: "ApprovedUsers" });
            }
          })}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Görünüm</Text>

        {renderSettingItem(
          getThemeIconName(),
          getThemeText(),
          <View style={styles.themeOptions}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                theme === "light" && styles.themeOptionSelected,
              ]}
              onPress={() => setTheme("light")}
            >
              <MaterialCommunityIcons
                name="weather-sunny"
                size={wp("4%")}
                color={
                  theme === "light" ? colors.primary : colors.text.secondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                theme === "dark" && styles.themeOptionSelected,
              ]}
              onPress={() => setTheme("dark")}
            >
              <MaterialCommunityIcons
                name="weather-night"
                size={wp("4%")}
                color={
                  theme === "dark" ? colors.primary : colors.text.secondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                theme === "system" && styles.themeOptionSelected,
              ]}
              onPress={() => setTheme("system")}
            >
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={wp("4%")}
                color={
                  theme === "system" ? colors.primary : colors.text.secondary
                }
              />
            </TouchableOpacity>
          </View>
        )}

        {renderSettingItem(
          "translate",
          getLanguageText(),
          <View style={styles.languageSelector}>
            <Text style={styles.languageFlag}>{getLanguageFlag()}</Text>
            <TouchableOpacity
              style={[
                styles.themeOption,
                language === "tr" && styles.themeOptionSelected,
              ]}
              onPress={() => setLanguage("tr")}
            >
              <Text
                style={
                  language === "tr"
                    ? styles.selectedLanguageText
                    : styles.languageText
                }
              >
                TR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                language === "en" && styles.themeOptionSelected,
              ]}
              onPress={() => setLanguage("en")}
            >
              <Text
                style={
                  language === "en"
                    ? styles.selectedLanguageText
                    : styles.languageText
                }
              >
                EN
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {renderSettingItem(
          "bell",
          "Bildirimler",
          <Switch
            value={notifications}
            onValueChange={saveNotificationSettings}
            trackColor={{
              false: colors.border.primary,
              true: colors.success,
            }}
            thumbColor={colors.background.primary}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Cihaz Bağlantısı</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleConnectionPress}
        >
          <View style={styles.settingLeft}>
            <View
              style={[
                styles.connectionIconContainer,
                { backgroundColor: getConnectionStatusInfo().bgColor },
              ]}
            >
              <MaterialCommunityIcons
                name={getConnectionStatusInfo().icon}
                size={wp("5%")}
                color={getConnectionStatusInfo().color}
              />
            </View>
            <View style={styles.connectionTextContainer}>
              <Text style={styles.settingText}>Cihaz Durumu</Text>
              <Text style={styles.connectionDescription}>
                {getConnectionStatusInfo().description}
              </Text>
            </View>
          </View>
          <View style={styles.connectionStatusContainer}>
            <View
              style={[
                styles.connectionStatusDot,
                { backgroundColor: getConnectionStatusInfo().color },
              ]}
            />
            <Text
              style={[
                styles.connectionStatusText,
                { color: getConnectionStatusInfo().color },
              ]}
            >
              {getConnectionStatusInfo().text}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={wp("5%")}
              color={colors.text.secondary}
              style={{ marginLeft: wp("2%") }}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hesap</Text>
        {renderActionItem(
          "key-outline",
          "Şifre Değiştir",
          handleChangePassword
        )}
        {renderActionItem(
          "shield-check-outline",
          "Gizlilik Ayarları",
          handlePrivacy
        )}
        {renderActionItem("information-outline", "Hakkında", handleAbout)}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Oturum</Text>
        {renderActionItem(
          "logout",
          user?.role === "ADMIN"
            ? "Ebeveyn Oturumunu Sonlandır"
            : "Cihaz Sahibi Oturumunu Sonlandır",
          handleLogout,
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
      justifyContent: "center",
      alignItems: "center",
    },
    avatarBackground: {
      width: wp("25%"),
      height: wp("25%"),
      borderRadius: wp("12.5%"),
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    avatarText: {
      fontSize: wp("10%"),
      fontWeight: "700",
    },
    settingsIcon: {
      position: "absolute",
      top: hp("2%"),
      right: wp("4%"),
      backgroundColor: colors.background.primary,
      padding: wp("2.5%"),
      borderRadius: wp("5%"),
      shadowColor: colors.text.primary,
      shadowOffset: { width: 2, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      elevation: 3,
    },
    name: {
      fontSize: wp("6%"),
      fontWeight: "bold",
      color: colors.text.primary,
      marginBottom: hp("0.5%"),
    },
    email: {
      fontSize: wp("4%"),
      color: colors.text.secondary,
      marginBottom: hp("2%"),
    },
    badgeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp("2%"),
    },
    roleContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.primary}15`,
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("0.5%"),
      borderRadius: wp("5%"),
    },
    role: {
      fontSize: wp("4%"),
      color: colors.text.secondary,
      marginLeft: wp("2%"),
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp("3%"),
      paddingVertical: hp("0.5%"),
      borderRadius: wp("5%"),
    },
    statusText: {
      fontSize: wp("3.5%"),
      marginLeft: wp("1%"),
      fontWeight: "500",
    },
    card: {
      backgroundColor: colors.background.primary,
      marginHorizontal: wp("4%"),
      marginVertical: hp("1%"),
      borderRadius: wp("5%"),
      padding: wp("5%"),
      ...Platform.select({
        ios: {
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    sectionTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "700",
      color: colors.text.primary,
      marginBottom: hp("2.5%"),
      letterSpacing: 0.5,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: hp("2%"),
      backgroundColor: `${colors.background.secondary}40`,
      marginVertical: hp("0.5%"),
      borderRadius: wp("3%"),
      paddingHorizontal: wp("4%"),
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: hp("2%"),
      backgroundColor: `${colors.background.secondary}20`,
      marginVertical: hp("0.5%"),
      borderRadius: wp("3%"),
      paddingHorizontal: wp("4%"),
    },
    borderBottom: {
      // Artık kullanılmıyor, modern tasarım için kaldırıldı
    },
    infoTextContainer: {
      marginLeft: wp("4%"),
      flex: 1,
    },
    infoLabel: {
      fontSize: wp("3.2%"),
      color: colors.text.secondary,
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    infoValue: {
      fontSize: wp("4.2%"),
      color: colors.text.primary,
      fontWeight: "600",
      marginTop: hp("0.3%"),
      flexWrap: "wrap",
      flex: 1,
    },
    actionLabel: {
      fontSize: wp("4.2%"),
      color: colors.text.primary,
      fontWeight: "600",
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: hp("2%"),
      backgroundColor: `${colors.background.secondary}20`,
      marginVertical: hp("0.5%"),
      borderRadius: wp("3%"),
      paddingHorizontal: wp("4%"),
    },
    themeOptions: {
      flexDirection: "row",
      alignItems: "center",
    },
    themeOption: {
      width: wp("8%"),
      height: wp("8%"),
      justifyContent: "center",
      alignItems: "center",
      marginLeft: wp("1%"),
      borderRadius: wp("4%"),
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    themeOptionSelected: {
      backgroundColor: `${colors.primary}15`,
      borderColor: colors.primary,
    },
    languageSelector: {
      flexDirection: "row",
      alignItems: "center",
    },
    languageFlag: {
      fontSize: wp("5%"),
      marginRight: wp("2%"),
    },
    selectedLanguageText: {
      color: colors.primary,
      fontWeight: "bold",
      fontSize: wp("3.2%"),
    },
    languageText: {
      color: colors.text.secondary,
      fontSize: wp("3.2%"),
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingText: {
      fontSize: wp("4.2%"),
      color: colors.text.primary,
      fontWeight: "600",
    },
    connectionIconContainer: {
      width: wp("12%"),
      height: wp("12%"),
      borderRadius: wp("6%"),
      alignItems: "center",
      justifyContent: "center",
      marginRight: wp("3%"),
    },
    connectionTextContainer: {
      flex: 1,
    },
    connectionDescription: {
      fontSize: wp("3.2%"),
      color: colors.text.secondary,
      marginTop: hp("0.3%"),
    },
    connectionStatusContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    connectionStatusDot: {
      width: wp("2.5%"),
      height: wp("2.5%"),
      borderRadius: wp("1.25%"),
      marginRight: wp("1.5%"),
    },
    connectionStatusText: {
      fontSize: wp("3.5%"),
      fontWeight: "600",
    },
  });

export default ProfileScreen;
