import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "../../context/AuthContext";
import Message from "../../components/alNoMessages/Message";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/localization/i18n";
import { StatusBar } from "expo-status-bar";

const ChangePasswordScreen = () => {
  const { colors, theme } = useTheme();
  const styles = createStyles(colors);
  const { changePassword } = useAuth();
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess(false);

      if (!oldPassword || !newPassword || !confirmPassword) {
        setError(t("fill_all_fields"));
        return;
      }

      if (newPassword !== confirmPassword) {
        setError(t("passwords_not_match"));
        return;
      }

      if (newPassword.length < 6) {
        setError(t("password_length_error"));
        return;
      }

      setLoading(true);
      await changePassword(oldPassword, newPassword);
      setSuccess(true);

      // Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("general_error"));
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    placeholder: string,
    value: string,
    setValue: (text: string) => void,
    showPassword: boolean,
    setShowPassword: (show: boolean) => void,
    icon: keyof typeof MaterialCommunityIcons.glyphMap
  ) => (
    <View style={styles.inputWrapper}>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={wp("6%")}
          color={colors.primary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          secureTextEntry={!showPassword}
          placeholderTextColor={colors.input.placeholder}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <MaterialCommunityIcons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={wp("6%")}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container} edges={["top"]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={wp("6%")}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("change_password")}</Text>
        <View style={{ width: wp("6%") }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="shield-lock-outline"
            size={wp("15%")}
            color={colors.primary}
          />
          <Text style={styles.headerSubtitle}>
            {t("create_strong_password")}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {renderInput(
            t("current_password"),
            oldPassword,
            setOldPassword,
            showOldPassword,
            setShowOldPassword,
            "lock-outline"
          )}

          {renderInput(
            t("new_password"),
            newPassword,
            setNewPassword,
            showNewPassword,
            setShowNewPassword,
            "key-outline"
          )}

          {renderInput(
            t("confirm_new_password"),
            confirmPassword,
            setConfirmPassword,
            showConfirmPassword,
            setShowConfirmPassword,
            "key-outline"
          )}

          {error && <Message message={error} visible={true} type="error" />}
          {success && (
            <Message
              message={t("password_changed")}
              visible={true}
              type="success"
            />
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={wp("6%")}
                  color="#fff"
                  style={styles.submitIcon}
                />
                <Text style={styles.submitButtonText}>{t("change_password")}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: typeof import("@/constant/theme").lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: wp("5%"),
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
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
      textAlign: "center",
    },
    formContainer: {
      marginTop: hp("2%"),
    },
    inputWrapper: {
      marginBottom: hp("2.5%"),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input.background,
      borderRadius: wp("3%"),
      borderWidth: 1,
      borderColor: colors.input.border,
      height: hp("7%"),
      paddingHorizontal: wp("4%"),
      ...Platform.select({
        ios: {
          shadowColor: colors.text.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    inputIcon: {
      marginRight: wp("3%"),
    },
    input: {
      flex: 1,
      fontSize: wp("4%"),
      color: colors.input.text,
    },
    eyeIcon: {
      padding: wp("2%"),
    },
    backButton: {
      padding: wp("1%"),
      borderRadius: wp("6%"),
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitButton: {
      flexDirection: "row",
      backgroundColor: colors.accent,
      height: hp("7%"),
      borderRadius: wp("3%"),
      justifyContent: "center",
      alignItems: "center",
      marginTop: hp("4%"),
      ...Platform.select({
        ios: {
          shadowColor: colors.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    submitButtonDisabled: {
      opacity: 0.7,
    },
    submitIcon: {
      marginRight: wp("2%"),
    },
    submitButtonText: {
      color: colors.text.inverse,
      fontSize: wp("4%"),
      fontWeight: "600",
    },
    keyboardContainer: {
      flex: 1,
    },
    iconContainer: {
      alignItems: "center",
      marginBottom: hp("4%"),
    },
  });

export default ChangePasswordScreen;
