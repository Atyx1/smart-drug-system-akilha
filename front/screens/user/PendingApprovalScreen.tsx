import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";

const COOLDOWN_DURATION = 60 * 1000; // 1 dakika

export const PendingApprovalScreen: React.FC = () => {
  const { user, updateUserRoleAndStatus } = useAuth();
  const { colors, activeColorScheme } = useTheme();
  const navigation = useNavigation();
  const isDark = activeColorScheme === "dark";

  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number | undefined>();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const isPending = () => user?.status === "PENDING";
  const isActive = () => user?.status === "ACTIVE";
  const isUser = () => user?.role === "USER";

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    if (user?.id) {
      handleRefresh();
    }
  }, [user?.id]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await updateUserRoleAndStatus(user!.id);
    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setLoading(false);
    }
  };

  const canRequestAgain = () => {
    if (!lastRequestTime) return true;
    return Date.now() - lastRequestTime > COOLDOWN_DURATION;
  };

  const handleRoleRequest = async () => {
    if (!canRequestAgain()) {
      const remainingTime =
        COOLDOWN_DURATION - (Date.now() - (lastRequestTime || 0));
      const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));
      alert(`Lütfen ${remainingMinutes} dakika sonra tekrar deneyiniz.`);
      return;
    }

    setLoading(true);
    try {
      await updateUserRoleAndStatus(user!.id);
      setLastRequestTime(Date.now());
    } catch (error) {
      console.log("Role request error:", error);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors, isDark);

  const getStatusInfo = () => {
    if (isPending()) {
      return {
        icon: "clock-alert",
        title: "Onay Bekleniyor",
        description: "Sistem yetkilendirmesi için onay bekleniyor",
        color: colors.warning,
        bgColor: `${colors.warning}15`,
      };
    }
    if (isActive()) {
      return {
        icon: "check-circle",
        title: "Hesap Aktif",
        description: "Hesabınız aktif durumda",
        color: colors.success,
        bgColor: `${colors.success}15`,
      };
    }
    return {
      icon: "help-circle",
      title: "Durum Belirsiz",
      description: "Hesap durumu kontrol ediliyor",
      color: colors.text.secondary,
      bgColor: `${colors.text.secondary}15`,
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.headerIconContainer,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            <MaterialCommunityIcons
              name="account-clock"
              size={wp(12)}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Hesap Durumu
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.text.secondary }]}
          >
            Sistem yetkilendirme ve onay süreci
          </Text>
        </Animated.View>

        {/* Status Card */}
        <Animated.View
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.card.background,
              borderColor: colors.border.primary,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.statusIconContainer,
              { backgroundColor: statusInfo.bgColor },
            ]}
          >
            <MaterialCommunityIcons
              name={statusInfo.icon as any}
              size={wp(8)}
              color={statusInfo.color}
            />
          </View>
          <View style={styles.statusContent}>
            <Text style={[styles.statusTitle, { color: colors.text.primary }]}>
              {statusInfo.title}
            </Text>
            <Text
              style={[
                styles.statusDescription,
                { color: colors.text.secondary },
              ]}
            >
              {statusInfo.description}
            </Text>
            {isPending() && (
              <Text
                style={[styles.statusDate, { color: colors.text.tertiary }]}
              >
                Başvuru Tarihi:{" "}
                {format(new Date(), "dd MMMM yyyy HH:mm", { locale: tr })}
              </Text>
            )}
          </View>
          {loading && (
            <ActivityIndicator
              color={colors.primary}
              size="small"
              style={styles.loadingIndicator}
            />
          )}
        </Animated.View>

        {/* Pending Actions */}
        {isPending() && (
          <Animated.View
            style={[
              styles.actionsCard,
              {
                backgroundColor: colors.card.background,
                borderColor: colors.border.primary,
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.actionsHeader}>
              <MaterialCommunityIcons
                name="progress-clock"
                size={wp(6)}
                color={colors.primary}
              />
              <Text
                style={[styles.actionsTitle, { color: colors.text.primary }]}
              >
                Bekleyen İşlemler
              </Text>
            </View>

            <View
              style={[
                styles.actionItem,
                { borderColor: colors.border.secondary },
              ]}
            >
              <View style={styles.actionContent}>
                <Text
                  style={[styles.actionTitle, { color: colors.text.primary }]}
                >
                  Yetki Talebi
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: colors.text.secondary },
                  ]}
                >
                  Sistem yetkilendirmesi bekleniyor
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.refreshButton,
                  { backgroundColor: colors.primary },
                  !canRequestAgain() && {
                    backgroundColor: colors.text.tertiary,
                  },
                ]}
                onPress={handleRoleRequest}
                disabled={!canRequestAgain() || loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.text.inverse} size="small" />
                ) : (
                  <MaterialCommunityIcons
                    name="refresh"
                    size={wp(5)}
                    color={colors.text.inverse}
                  />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* User Options */}
        {isUser() && (
          <Animated.View
            style={[
              styles.optionsCard,
              {
                backgroundColor: colors.card.background,
                borderColor: colors.border.primary,
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.optionsHeader}>
              <MaterialCommunityIcons
                name="cog"
                size={wp(6)}
                color={colors.primary}
              />
              <Text
                style={[styles.optionsTitle, { color: colors.text.primary }]}
              >
                Kullanılabilir Seçenekler
              </Text>
            </View>

            {/* Connect Device Option */}
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: `${colors.primary}10`,
                  borderColor: `${colors.primary}30`,
                },
              ]}
              onPress={() => (navigation as any).navigate("ConnectToDevice")}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionIconContainer,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="devices"
                    size={wp(6)}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[styles.optionTitle, { color: colors.text.primary }]}
                  >
                    Cihazım Var
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Kendi cihazınıza bağlanın ve ilaç takibini başlatın
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={wp(5)}
                color={colors.text.tertiary}
              />
            </TouchableOpacity>

            {/* View Relative Device Option */}
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: `${colors.accent}10`,
                  borderColor: `${colors.accent}30`,
                },
              ]}
              onPress={() => (navigation as any).navigate("ViewRelativeDevice")}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionIconContainer,
                    { backgroundColor: `${colors.accent}20` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="account-heart"
                    size={wp(6)}
                    color={colors.accent}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[styles.optionTitle, { color: colors.text.primary }]}
                  >
                    Yakınımın Cihazı
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Yakınınızın cihazını görüntüleme talebi gönderin
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={wp(5)}
                color={colors.text.tertiary}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: wp(4),
    },
    header: {
      alignItems: "center",
      marginTop: hp(2),
      marginBottom: hp(4),
    },
    headerIconContainer: {
      width: wp(24),
      height: wp(24),
      borderRadius: wp(12),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp(2),
    },
    headerTitle: {
      fontSize: wp(6.5),
      fontWeight: "700",
      textAlign: "center",
      marginBottom: hp(1),
    },
    headerSubtitle: {
      fontSize: wp(4),
      textAlign: "center",
      lineHeight: wp(5.5),
      paddingHorizontal: wp(4),
    },
    statusCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp(4),
      borderRadius: wp(4),
      borderWidth: 1,
      marginBottom: hp(3),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statusIconContainer: {
      width: wp(16),
      height: wp(16),
      borderRadius: wp(8),
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp(4),
    },
    statusContent: {
      flex: 1,
    },
    statusTitle: {
      fontSize: wp(4.5),
      fontWeight: "600",
      marginBottom: hp(0.5),
    },
    statusDescription: {
      fontSize: wp(3.5),
      lineHeight: wp(5),
      marginBottom: hp(0.5),
    },
    statusDate: {
      fontSize: wp(3),
      fontStyle: "italic",
    },
    loadingIndicator: {
      marginLeft: wp(2),
    },
    actionsCard: {
      padding: wp(4),
      borderRadius: wp(4),
      borderWidth: 1,
      marginBottom: hp(3),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    actionsHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp(2),
    },
    actionsTitle: {
      fontSize: wp(4.5),
      fontWeight: "600",
      marginLeft: wp(2),
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp(3),
      borderRadius: wp(3),
      borderWidth: 1,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: wp(4),
      fontWeight: "600",
      marginBottom: hp(0.5),
    },
    actionDescription: {
      fontSize: wp(3.5),
    },
    refreshButton: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      justifyContent: "center",
      alignItems: "center",
    },
    optionsCard: {
      padding: wp(4),
      borderRadius: wp(4),
      borderWidth: 1,
      marginBottom: hp(3),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    optionsHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp(2),
    },
    optionsTitle: {
      fontSize: wp(4.5),
      fontWeight: "600",
      marginLeft: wp(2),
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp(4),
      borderRadius: wp(3),
      borderWidth: 1,
      marginBottom: hp(2),
    },
    optionContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    optionIconContainer: {
      width: wp(12),
      height: wp(12),
      borderRadius: wp(6),
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp(3),
    },
    optionTextContainer: {
      flex: 1,
    },
    optionTitle: {
      fontSize: wp(4),
      fontWeight: "600",
      marginBottom: hp(0.5),
    },
    optionDescription: {
      fontSize: wp(3.5),
      lineHeight: wp(4.5),
    },
    activeCard: {
      alignItems: "center",
      padding: wp(6),
      borderRadius: wp(4),
      borderWidth: 1,
      marginBottom: hp(3),
    },
    activeTitle: {
      fontSize: wp(5),
      fontWeight: "700",
      marginTop: hp(2),
      marginBottom: hp(1),
    },
    activeDescription: {
      fontSize: wp(4),
      textAlign: "center",
    },
  });

export default PendingApprovalScreen;
