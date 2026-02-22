import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
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

const ConnectToDeviceScreen: React.FC = () => {
  const [deviceName, setDeviceName] = useState("");
  const [devicePassword, setDevicePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { connectAsManager } = useDevice();
  const { colors, activeColorScheme } = useTheme();
  const isDark = activeColorScheme === "dark";

  const handleConnect = async () => {
    if (!deviceName.trim() || !devicePassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Lütfen tüm alanları doldurun",
      });
      return;
    }

    setLoading(true);
    try {
      await connectAsManager(deviceName.trim(), devicePassword.trim());
      setShowSuccessModal(true);
      // Reset form
      setDeviceName("");
      setDevicePassword("");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Bağlantı Başarısız",
        text2: "Cihaz bilgilerini kontrol edin",
      });
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
                name="devices"
                size={wp(8)}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Cihaza Bağlan
            </Text>
            <Text
              style={[styles.description, { color: colors.text.secondary }]}
            >
              Cihaz adı ve şifresini girerek eşleştirme yapın
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Device Name Input */}
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
                  name="router-wireless"
                  size={wp(5)}
                  color={colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: colors.text.primary }]}
                  placeholder="Cihaz adını girin"
                  placeholderTextColor={colors.text.tertiary}
                  value={deviceName}
                  onChangeText={setDeviceName}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Device Password Input */}
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, { color: colors.text.secondary }]}
              >
                Cihaz Şifresi
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
                  name="key-variant"
                  size={wp(5)}
                  color={colors.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.textInput,
                    { color: colors.text.primary, flex: 1 },
                  ]}
                  placeholder="Cihaz şifresini girin"
                  placeholderTextColor={colors.text.tertiary}
                  value={devicePassword}
                  onChangeText={setDevicePassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye" : "eye-off"}
                    size={wp(5)}
                    color={colors.text.tertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Connect Button */}
            <TouchableOpacity
              style={[
                styles.connectButton,
                { backgroundColor: colors.primary },
                loading && styles.disabledButton,
              ]}
              onPress={handleConnect}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.text.inverse} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="link"
                    size={wp(5)}
                    color={colors.text.inverse}
                    style={{ marginRight: wp(2) }}
                  />
                  <Text
                    style={[styles.buttonText, { color: colors.text.inverse }]}
                  >
                    Cihaza Bağlan
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Info Card */}
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.card.background,
                  borderColor: colors.border.secondary,
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
                Cihaz bağlantısı için cihazınızın yanınızda olduğundan ve
                şifrenin doğru olduğundan emin olun.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Cihaz başarıyla bağlandı"
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
      marginTop: hp(4),
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
    passwordToggle: {
      padding: wp(1),
    },
    connectButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp(2),
      borderRadius: wp(3),
      marginTop: hp(2),
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
      marginTop: hp(4),
    },
    infoText: {
      flex: 1,
      fontSize: wp(3.5),
      lineHeight: wp(5),
    },
  });

export default ConnectToDeviceScreen;
