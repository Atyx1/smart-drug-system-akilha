import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import { useDevice } from "@/context/DeviceContext";
import { useTheme } from "@/context/ThemeContext";
import SuccessModal from "@/components/alNoMessages/SuccessModal";

const ViewRelativeDeviceScreen: React.FC = () => {
  const { sendCaregiverRequest } = useDevice();
  const { colors, activeColorScheme } = useTheme();
  const isDark = activeColorScheme === "dark";

  const [deviceName, setDeviceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSendRequest = async () => {
    if (!deviceName.trim()) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Lütfen cihaz adını girin",
      });
      return;
    }

    setLoading(true);
    try {
      await sendCaregiverRequest(deviceName.trim());
      setShowSuccessModal(true);
      setDeviceName("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Talep Başarısız",
        text2: "Talep gönderilemedi, lütfen tekrar deneyin",
      });
      console.error("Caregiver request error:", error);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <MaterialCommunityIcons
                name="account-heart"
                size={wp(8)}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Yakınınızın Cihazı
            </Text>
            <Text
              style={[styles.description, { color: colors.text.secondary }]}
            >
              Cihaz adına göre paylaşım talebi gönderebilirsiniz
            </Text>
          </View>

          {/* Feature Cards */}
          <View style={styles.featuresContainer}>
            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.card.background,
                  borderColor: colors.border.secondary,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={wp(6)}
                color={colors.primary}
                style={styles.featureIcon}
              />
              <Text
                style={[styles.featureTitle, { color: colors.text.primary }]}
              >
                Cihaz Paylaşımı
              </Text>
              <Text
                style={[
                  styles.featureDescription,
                  { color: colors.text.secondary },
                ]}
              >
                Yakınınızın ilaç verilerini görüntüleyin
              </Text>
            </View>

            <View
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.card.background,
                  borderColor: colors.border.secondary,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="bell-ring"
                size={wp(6)}
                color={colors.accent}
                style={styles.featureIcon}
              />
              <Text
                style={[styles.featureTitle, { color: colors.text.primary }]}
              >
                Anlık Bildirimler
              </Text>
              <Text
                style={[
                  styles.featureDescription,
                  { color: colors.text.secondary },
                ]}
              >
                İlaç durumu hakkında bildirim alın
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, { color: colors.text.secondary }]}
              >
                Cihaz Adı
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.card.background,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="devices"
                  size={wp(5)}
                  color={colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: colors.text.primary }]}
                  placeholder="Yakınınızın cihaz adını girin"
                  placeholderTextColor={colors.text.tertiary}
                  value={deviceName}
                  onChangeText={setDeviceName}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Send Request Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: colors.primary },
                loading && styles.disabledButton,
              ]}
              onPress={handleSendRequest}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.text.inverse} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="send"
                    size={wp(5)}
                    color={colors.text.inverse}
                    style={{ marginRight: wp(2) }}
                  />
                  <Text
                    style={[styles.buttonText, { color: colors.text.inverse }]}
                  >
                    Talep Gönder
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info Cards */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: `${colors.primary}10`,
                  borderColor: `${colors.primary}30`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={wp(5)}
                color={colors.primary}
                style={{ marginRight: wp(3) }}
              />
              <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                Talebiniz cihaz sahibine iletilecektir. Onaylandıktan sonra
                cihaz verilerini görüntüleyebilirsiniz.
              </Text>
            </View>

            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: `${colors.accent}10`,
                  borderColor: `${colors.accent}30`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={wp(5)}
                color={colors.accent}
                style={{ marginRight: wp(3) }}
              />
              <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                Tüm veriler şifreli olarak iletilir ve güvenlik protokolleri ile
                korunur.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Talebiniz başarıyla gönderildi! Cihaz sahibine bildirim iletilecektir."
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardView: {
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
    iconContainer: {
      width: wp(20),
      height: wp(20),
      borderRadius: wp(10),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp(2),
    },
    title: {
      fontSize: wp(6),
      fontWeight: "700",
      textAlign: "center",
      marginBottom: hp(1),
    },
    description: {
      fontSize: wp(4),
      textAlign: "center",
      lineHeight: wp(5.5),
      paddingHorizontal: wp(4),
    },
    featuresContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: hp(4),
    },
    featureCard: {
      flex: 0.48,
      padding: wp(4),
      borderRadius: wp(3),
      borderWidth: 1,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    featureIcon: {
      marginBottom: hp(1),
    },
    featureTitle: {
      fontSize: wp(3.5),
      fontWeight: "600",
      textAlign: "center",
      marginBottom: hp(0.5),
    },
    featureDescription: {
      fontSize: wp(3),
      textAlign: "center",
      lineHeight: wp(4),
    },
    formContainer: {
      flex: 1,
    },
    inputContainer: {
      marginBottom: hp(3),
    },
    inputLabel: {
      fontSize: wp(4),
      fontWeight: "600",
      marginBottom: hp(1),
      marginLeft: wp(1),
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: wp(3),
      paddingHorizontal: wp(4),
      paddingVertical: Platform.OS === "ios" ? hp(2) : hp(1.5),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    inputIcon: {
      marginRight: wp(3),
    },
    textInput: {
      flex: 1,
      fontSize: wp(4),
      fontWeight: "500",
    },
    sendButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp(2),
      borderRadius: wp(3),
      marginBottom: hp(3),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    disabledButton: {
      opacity: 0.7,
    },
    buttonText: {
      fontSize: wp(4.5),
      fontWeight: "600",
    },
    infoCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: wp(4),
      borderRadius: wp(3),
      borderWidth: 1,
      marginBottom: hp(2),
    },
    infoText: {
      flex: 1,
      fontSize: wp(3.5),
      lineHeight: wp(5),
    },
  });

export default ViewRelativeDeviceScreen;
