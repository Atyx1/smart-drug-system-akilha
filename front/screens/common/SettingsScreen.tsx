import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "@/localization/i18n";
import {
  addConnectionStatusListener,
  getConnectionStatus,
} from "@/api/ConnectWebSocket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

type SettingsStackParamList = {
  SettingsMain: undefined;
  ChangePassword: undefined;
  Privacy: undefined;
  About: undefined;
};

const SettingsScreen = () => {
  const { colors, theme, toggleTheme, setTheme, activeColorScheme } =
    useTheme();
  const { language, toggleLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();
  const styles = createStyles(colors);
  const navigation =
    useNavigation<StackNavigationProp<SettingsStackParamList>>();

  const [notifications, setNotifications] = React.useState(true);
  const [wsConnectionStatus, setWsConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");

  // WebSocket bağlantı durumunu takip et
  useEffect(() => {
    const unsubscribe = addConnectionStatusListener(setWsConnectionStatus);
    loadNotificationSettings();
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
      console.log("🔔 [SETTINGS] Bildirim ayarları kaydedildi:", enabled);
    } catch (error) {
      console.error(
        "🔔 [SETTINGS] Bildirim ayarları kaydedilirken hata:",
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
    if (theme === "light") return t("light_mode");
    if (theme === "dark") return t("dark_mode");
    return (
      t("system_theme") +
      " (" +
      (activeColorScheme === "light" ? t("light_mode") : t("dark_mode")) +
      ")"
    );
  };

  const getLanguageFlag = () => {
    return language === "tr" ? "🇹🇷" : "🇬🇧";
  };

  const getLanguageText = () => {
    return language === "tr" ? t("turkish") : t("english");
  };

  const handleThemeChange = () => {
    toggleTheme();
  };

  const handleGoBack = () => {
    navigation.getParent()?.goBack();
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons
            name="chevron-back"
            size={wp("6%")}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("settings")}</Text>
        <View style={{ width: wp("6%") }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("appearance")}</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleThemeChange}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name={getThemeIconName()}
                size={wp("6%")}
                color={colors.primary}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>{getThemeText()}</Text>
            </View>
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
                  size={wp("5%")}
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
                  size={wp("5%")}
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
                  size={wp("5%")}
                  color={
                    theme === "system" ? colors.primary : colors.text.secondary
                  }
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={toggleLanguage}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="translate"
                size={wp("6%")}
                color={colors.primary}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>{t("language")}</Text>
            </View>
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
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="notifications-outline"
                size={wp("6%")}
                color={colors.primary}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>{t("notifications")}</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={saveNotificationSettings}
              trackColor={{
                false: colors.border.primary,
                true: colors.success,
              }}
              thumbColor={colors.background.primary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sistem</Text>

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
                <Text style={styles.settingText}>Cihaz Bağlantısı</Text>
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
              <Ionicons
                name="chevron-forward"
                size={wp("5%")}
                color={colors.text.secondary}
                style={{ marginLeft: wp("2%") }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("account")}</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name="lock-closed-outline"
                size={wp("6%")}
                color={colors.primary}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>{t("change_password")}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp("6%")}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("Privacy")}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name="shield-outline"
                size={wp("6%")}
                color={colors.primary}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>{t("privacy")}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp("6%")}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("about")}</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("About")}
          >
            <View style={styles.settingLeft}>
              <Ionicons
                name="information-circle-outline"
                size={wp("6%")}
                color={colors.primary}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>{t("about")}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={wp("6%")}
              color={colors.text.secondary}
            />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={wp("6%")}
                color={colors.primary}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>{t("app_version")}</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: typeof import("@/constant/theme").lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContent: {
      paddingBottom: hp("4%"),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("2%"),
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    headerTitle: {
      fontSize: wp("5%"),
      fontWeight: "700",
      color: colors.text.primary,
      textAlign: "center",
    },
    backButton: {
      padding: wp("1%"),
      borderRadius: wp("6%"),
      justifyContent: "center",
      alignItems: "center",
    },
    section: {
      marginTop: hp("1%"),
    },
    sectionTitle: {
      fontSize: wp("3.5%"),
      fontWeight: "600",
      color: colors.text.secondary,
      padding: wp("4%"),
      paddingBottom: hp("0.5%"),
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: wp("4%"),
      marginHorizontal: wp("3%"),
      marginVertical: hp("0.5%"),
      borderRadius: wp("3%"),
      backgroundColor: colors.background.secondary,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingIcon: {
      marginRight: wp("2%"),
    },
    settingText: {
      fontSize: wp("3.8%"),
      color: colors.text.primary,
      fontWeight: "500",
    },
    versionText: {
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
    },
    themeOptions: {
      flexDirection: "row",
      alignItems: "center",
    },
    themeOption: {
      width: wp("10%"),
      height: wp("10%"),
      justifyContent: "center",
      alignItems: "center",
      marginLeft: wp("1%"),
      borderRadius: wp("5%"),
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    themeOptionSelected: {
      backgroundColor: colors.background.tertiary,
      borderColor: colors.primary,
    },
    languageSelector: {
      flexDirection: "row",
      alignItems: "center",
    },
    languageFlag: {
      fontSize: wp("7%"),
      marginRight: wp("2%"),
    },
    selectedLanguageText: {
      color: colors.primary,
      fontWeight: "bold",
    },
    languageText: {
      color: colors.text.secondary,
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

export default SettingsScreen;
