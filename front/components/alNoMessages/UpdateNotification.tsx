import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/localization/i18n";
import { BlurView } from "expo-blur";

const UpdateNotification = () => {
  const { showUpdateNotification, logout } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Animation değerleri
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  const styles = createStyles(colors);

  React.useEffect(() => {
    if (showUpdateNotification) {
      // Giriş animasyonu
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animasyonu
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }
  }, [showUpdateNotification]);

  if (!showUpdateNotification) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <BlurView intensity={20} style={styles.blurView}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Gradient Header */}
          <View style={styles.gradientHeader}>
            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <MaterialCommunityIcons
                name="shield-refresh"
                size={wp("12%")}
                color="#FFFFFF"
              />
            </Animated.View>
            <Text style={styles.akilhaTitle}>AKILHA</Text>
            <Text style={styles.title}>{t("account_updated")}</Text>
            <Text style={styles.subtitle}>Hesap bilgileriniz güncellendi</Text>
          </View>

          {/* Content Cards */}
          <View style={styles.content}>
            <View style={styles.infoCard}>
              <Text style={styles.updateMessage}>
                Yetki ve durum bilgileriniz güncellendi.
              </Text>
            </View>
          </View>

          {/* Action Section */}
          <View style={styles.footer}>
            <View style={styles.warningContainer}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={wp("5%")}
                color="#F59E0B"
              />
              <Text style={styles.description}>{t("login_again_message")}</Text>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={logout}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="logout"
                size={wp("5%")}
                color="#FFFFFF"
              />
              <Text style={styles.logoutText}>{t("logout")}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
};

export default UpdateNotification;

const createStyles = (colors: typeof import("@/constant/theme").lightColors) =>
  StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    blurView: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: wp("92%"),
      backgroundColor: "#FFFFFF",
      borderRadius: wp("6%"),
      overflow: "hidden",
      elevation: 25,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.15,
      shadowRadius: 25,
    },
    gradientHeader: {
      backgroundColor: "#667EEA",
      paddingVertical: hp("4%"),
      paddingHorizontal: wp("6%"),
      alignItems: "center",
      position: "relative",
    },
    iconContainer: {
      width: wp("20%"),
      height: wp("20%"),
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: wp("10%"),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp("2%"),
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.3)",
    },
    akilhaTitle: {
      fontSize: wp("6%"),
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 2,
      marginBottom: hp("1%"),
    },
    title: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      opacity: 0.95,
    },
    subtitle: {
      fontSize: wp("3.5%"),
      color: "rgba(255,255,255,0.8)",
      textAlign: "center",
      marginTop: hp("1%"),
    },
    content: {
      padding: wp("6%"),
    },
    infoCard: {
      backgroundColor: "#F8FAFC",
      borderRadius: wp("4%"),
      padding: wp("5%"),
      borderWidth: 1,
      borderColor: "#E2E8F0",
      alignItems: "center",
    },
    updateMessage: {
      fontSize: wp("4%"),
      fontWeight: "500",
      color: "#2D3748",
      textAlign: "center",
    },
    footer: {
      paddingHorizontal: wp("6%"),
      paddingBottom: hp("4%"),
    },
    warningContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FEF3C7",
      padding: wp("4%"),
      borderRadius: wp("3%"),
      marginBottom: hp("3%"),
      borderLeftWidth: 4,
      borderLeftColor: "#F59E0B",
    },
    description: {
      fontSize: wp("3.5%"),
      color: "#92400E",
      marginLeft: wp("3%"),
      flex: 1,
      fontWeight: "500",
    },
    logoutButton: {
      flexDirection: "row",
      backgroundColor: "#667EEA",
      paddingVertical: hp("2.5%"),
      paddingHorizontal: wp("8%"),
      borderRadius: wp("4%"),
      alignItems: "center",
      justifyContent: "center",
      elevation: 8,
      shadowColor: "#667EEA",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    logoutText: {
      color: "#FFFFFF",
      fontSize: wp("4.5%"),
      fontWeight: "600",
      marginLeft: wp("3%"),
      letterSpacing: 0.5,
    },
  });
