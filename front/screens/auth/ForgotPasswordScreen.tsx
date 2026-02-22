import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import { UserApi } from "../../api/UserApi";
import Message from "../../components/alNoMessages/Message";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/localization/i18n";
import { StatusBar } from "expo-status-bar";
import { ApiResponse } from "@/types/Types";

// Akilha tıbbi mavi renk tanımı (Login ile aynı)
const PRIMARY_COLOR = "#5C88C6";

// Define screen props interface
type ForgotPasswordScreenProps = {
  navigation: any;
};

// No longer needed as we use theme colors

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    try {
      Keyboard.dismiss();
      setError("");
      setSuccessMessage("");

      if (!email.trim()) {
        setError("Lütfen e-posta adresinizi girin");
        return;
      }

      if (!validateEmail(email)) {
        setError("Geçerli bir e-posta adresi girin");
        return;
      }

      setLoading(true);

      // Call the API
      const response = await UserApi.passwordChangeActivation(email);

      // Backend sends a successful response if the email is sent
      if (response) {
        console.log("Password reset response:", response);
        setSuccessMessage(
          "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin."
        );

        // Navigate to login after delay
        setTimeout(() => {
          navigation.navigate("Login");
        }, 4000);
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      // Provide more descriptive error message
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message && err.message.includes("Not Found")) {
        setError("Bu e-posta adresi sistemde kayıtlı değil");
      } else if (err.message && err.message.includes("Network Error")) {
        setError(
          "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin."
        );
      } else {
        setError(
          "Şifre sıfırlama isteği gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View style={styles.header}>
          <BlurView
            intensity={30}
            tint="light"
            style={[
              styles.iconContainer,
              { backgroundColor: "rgba(92, 136, 198, 0.15)" },
            ]}
          >
            <Feather
              name="key"
              size={wp("8%")}
              color={PRIMARY_COLOR}
              style={{ opacity: 0.8 }}
            />
          </BlurView>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {t("forgot_password")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Şifrenizi sıfırlamak için lütfen kayıtlı e-posta adresinizi girin.
            Size şifre sıfırlama bağlantısı göndereceğiz.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View
            style={[
              styles.inputContainer,
              { borderColor: "rgba(92, 136, 198, 0.3)" },
            ]}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={wp("5.5%")}
              color={PRIMARY_COLOR}
              style={[styles.inputIcon, { opacity: 0.8 }]}
            />
            <TextInput
              style={[styles.input, { color: colors.text.primary }]}
              placeholder="E-posta adresiniz"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="rgba(92, 136, 198, 0.4)"
              autoCorrect={false}
            />
          </View>

          <Message message={error} visible={!!error} type="error" />

          <Message
            message={successMessage}
            visible={!!successMessage}
            type="success"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: PRIMARY_COLOR },
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || !!successMessage}
          >
            {loading ? (
              <ActivityIndicator color={colors.background.primary} />
            ) : (
              <>
                <Feather
                  name="send"
                  size={wp("4.5%")}
                  color={colors.background.primary}
                  style={[styles.submitButtonIcon, { opacity: 0.9 }]}
                />
                <Text
                  style={[
                    styles.submitButtonText,
                    { color: colors.background.primary },
                  ]}
                >
                  {successMessage
                    ? "Gönderildi"
                    : "Şifre Sıfırlama Bağlantısı Gönder"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Feather
            name="arrow-left"
            size={wp("5%")}
            color={PRIMARY_COLOR}
            style={{ opacity: 0.8 }}
          />
          <Text style={[styles.backButtonText, { color: PRIMARY_COLOR }]}>
            Giriş Ekranına Dön
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("5%"),
    marginBottom: hp("5%"),
  },
  iconContainer: {
    width: wp("18%"),
    height: wp("18%"),
    borderRadius: wp("9%"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("3%"),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "600",
    marginBottom: hp("1.5%"),
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: wp("3.8%"),
    textAlign: "center",
    lineHeight: hp("2.5%"),
    paddingHorizontal: wp("10%"),
    opacity: 0.7,
    letterSpacing: -0.2,
  },
  formContainer: {
    paddingHorizontal: wp("10%"),
    marginTop: hp("2%"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingHorizontal: wp("4%"),
    height: hp("6.5%"),
    borderWidth: 0,
    borderBottomWidth: 1.5,
    marginBottom: hp("2%"),
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  inputIcon: {
    marginRight: wp("3%"),
  },
  input: {
    flex: 1,
    fontSize: wp("4%"),
    height: "100%",
    paddingVertical: 0,
  },
  submitButton: {
    height: hp("6.5%"),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("2%"),
    marginBottom: hp("3%"),
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonIcon: {
    marginRight: wp("2%"),
  },
  submitButtonText: {
    fontSize: wp("4%"),
    fontWeight: "500",
    letterSpacing: -0.3,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: wp("4%"),
    position: "absolute",
    bottom: hp("4%"),
    left: 0,
    right: 0,
  },
  backButtonText: {
    marginLeft: wp("1.5%"),
    fontSize: wp("3.8%"),
    fontWeight: "400",
    opacity: 0.8,
  },
});

export default ForgotPasswordScreen;
