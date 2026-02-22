import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/localization/i18n";
import { useTheme } from "@/context/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { UserCreateDTO } from "@/types/Types";
import { UserApi } from "@/api/UserApi";

// Theme colors
const BLUE_COLOR = "#5C88C6"; // Icon color
const GREEN_COLOR = "#009966"; // Completed step color
const ERROR_BG = "#FFEBEE"; // Light red background for errors

type MedicationRegisterScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const MedicationRegisterScreen: React.FC<
  MedicationRegisterScreenProps
> = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { t } = useTranslation();
  const { colors } = useTheme();

  // Helper component for progress bar with steps
  const ProgressBar = ({ step }: { step: number }) => {
    const totalSteps = 2;
    const stepIcons = ["person-outline", "lock-closed-outline"];

    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View key={index} style={styles.progressItemContainer}>
            <View
              style={[
                styles.progressItemWrapper,
                index < step
                  ? { borderColor: GREEN_COLOR }
                  : { borderColor: colors.border.primary },
              ]}
            >
              <Ionicons
                name={stepIcons[index]}
                size={wp("7%")}
                color={BLUE_COLOR}
              />
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.progressLine,
                  {
                    backgroundColor:
                      index < step - 1 ? GREEN_COLOR : colors.border.primary,
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep = (step: number) => {
    setError("");

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          setError(t("fullname_required"));
          return false;
        }
        if (!formData.username.trim()) {
          setError(t("username_required"));
          return false;
        }
        if (formData.username.length < 3) {
          setError(t("username_min_length"));
          return false;
        }
        if (!formData.email.trim()) {
          setError(t("email_required"));
          return false;
        }
        if (!formData.email.includes("@") || !formData.email.includes(".")) {
          setError(t("email_invalid"));
          return false;
        }
        return true;

      case 2:
        if (!formData.password) {
          setError(t("password_required"));
          return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          setError(t("password_requirements"));
          return false;
        }

        if (formData.password !== formData.confirmPassword) {
          setError(t("passwords_not_match"));
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === 1) {
      // Check email/username availability before proceeding to next step
      try {
        setIsLoading(true);
        setError("");

        // Email check
        const emailExists = await UserApi.checkEmailExists(formData.email);
        if (emailExists) {
          setError(t("email_in_use"));
          setIsLoading(false);
          return false;
        }

        // Username check
        const usernameExists = await UserApi.checkUsernameExists(
          formData.username
        );
        if (usernameExists) {
          setError(t("username_in_use"));
          setIsLoading(false);
          return false;
        }

        setCurrentStep(currentStep + 1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t("availability_check_error")
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      handleRegister();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    try {
      if (validateStep(currentStep)) {
        setIsLoading(true);
        setError("");

        // Create user data object for API
        const userData: UserCreateDTO = {
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        };

        // Call API to register user
        const response = await UserApi.createUser(userData);

        // Reset form data
        setFormData({
          username: "",
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Navigate to success screen
        navigation.navigate("RegistrationSuccess", {
          message: response.message || t("registration_success"),
        } as never);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("registration_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
              {t("personal_info")}
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: colors.text.tertiary }]}
            >
              {t("enter_personal_info")}
            </Text>

            <View style={styles.inputGroup}>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.secondary,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={wp("5%")}
                  color={BLUE_COLOR}
                />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder={t("fullname_placeholder")}
                  placeholderTextColor="#999"
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange("fullName", text)}
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.secondary,
                  },
                ]}
              >
                <Ionicons
                  name="at-outline"
                  size={wp("5%")}
                  color={BLUE_COLOR}
                />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder={t("username_placeholder")}
                  placeholderTextColor="#999"
                  value={formData.username}
                  onChangeText={(text) => handleInputChange("username", text)}
                  autoCapitalize="none"
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.secondary,
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={wp("5%")}
                  color={BLUE_COLOR}
                />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder={t("email_placeholder")}
                  placeholderTextColor="#999"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
              {t("secure_account")}
            </Text>
            <Text
              style={[styles.stepSubtitle, { color: colors.text.tertiary }]}
            >
              {t("create_secure_password")}
            </Text>

            <View style={styles.inputGroup}>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.secondary,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={wp("5%")}
                  color={BLUE_COLOR}
                />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder={t("password_placeholder")}
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={wp("5%")}
                    color={BLUE_COLOR}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.secondary,
                  },
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={wp("5%")}
                  color={BLUE_COLOR}
                />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder={t("confirm_password_placeholder")}
                  placeholderTextColor="#999"
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={wp("5%")}
                    color={BLUE_COLOR}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.passwordRequirements,
                  { color: colors.text.tertiary },
                ]}
              >
                {t("password_requirements_text")}
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <View style={styles.header}>
          {/* Removed the 'Create Account' title as requested */}
        </View>

        <ProgressBar step={currentStep} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}

          {error ? (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor: ERROR_BG,
                  borderWidth: 1,
                  borderColor: colors.error,
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
            >
              <Ionicons
                name="alert-circle"
                size={wp("5%")}
                color={colors.error}
                style={{ marginRight: wp("2%") }}
              />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          ) : null}
          <View style={{ height: hp("3%") }} />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            {currentStep > 1 ? (
              <TouchableOpacity
                style={styles.backButtonContainer}
                onPress={handlePreviousStep}
              >
                <Ionicons
                  name="arrow-back"
                  size={wp("4.5%")}
                  color={colors.primary}
                />
                <Text
                  style={[styles.backButtonText, { color: colors.primary }]}
                >
                  Önceki
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.backToLoginContainer}
                onPress={() => navigation.navigate("Login" as never)}
              >
                <Ionicons
                  name="arrow-back"
                  size={wp("4%")}
                  color={colors.primary}
                />
                <Text
                  style={[styles.backToLoginText, { color: colors.primary }]}
                >
                  {t("back_to_login")}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.nextButtonContainer,
                currentStep === 2
                  ? {
                      borderWidth: 1,
                      borderColor: colors.primary,
                      borderRadius: wp("3%"),
                      paddingHorizontal: wp("4%"),
                    }
                  : {},
                isLoading ? styles.buttonDisabled : {},
              ]}
              onPress={handleNextStep}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : currentStep === 2 ? (
                <>
                  <Text
                    style={[
                      styles.nextButtonSimpleText,
                      { color: colors.primary },
                    ]}
                  >
                    Kayıt Ol
                  </Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={wp("4.5%")}
                    color={colors.primary}
                    style={{ marginLeft: wp("2%") }}
                  />
                </>
              ) : (
                <>
                  <Text
                    style={[
                      styles.nextButtonSimpleText,
                      { color: colors.primary },
                    ]}
                  >
                    İlerle
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={wp("4.5%")}
                    color={colors.primary}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Position content closer to the top
    alignItems: "center", // Center horizontally
    paddingTop: Platform.OS === "ios" ? hp("8%") : hp("5%"), // Add top padding
  },
  header: {
    paddingTop: hp("2%"),
    paddingHorizontal: wp("6%"),
    marginBottom: hp("1%"),
  },
  headerTitle: {
    fontSize: wp("7%"),
    fontWeight: "700",
    marginBottom: hp("2%"),
    letterSpacing: 0.5,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // More space between items
    alignItems: "center",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("10%"),
    marginBottom: hp("2%"),
  },
  progressItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: wp("30%"), // Fixed width for better spacing
  },
  progressItemWrapper: {
    width: wp("16%"),
    height: wp("16%"),
    borderRadius: wp("8%"),
    borderWidth: 2.5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: wp("2%"), // Add horizontal spacing
  },
  progressLine: {
    position: "absolute",
    width: wp("25%"), // Longer line
    height: 3,
    left: wp("18%"),
    zIndex: 0,
  },
  scrollContent: {
    paddingBottom: hp("3%"),
    paddingHorizontal: wp("6%"),
    alignItems: "center", // Center content horizontally
    width: "100%", // Ensure full width for alignment
  },
  stepContainer: {
    marginTop: hp("2%"),
    alignItems: "center",
    width: "100%",
    maxWidth: wp("90%"),
  },
  stepTitle: {
    fontSize: wp("5.5%"),
    fontWeight: "600",
    marginBottom: hp("1%"),
    letterSpacing: 0.3,
  },
  stepSubtitle: {
    fontSize: wp("3.5%"),
    marginBottom: hp("3%"),
    letterSpacing: 0.2,
  },
  inputGroup: {
    gap: hp("2.2%"),
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: wp("3%"),
    paddingHorizontal: wp("4%"),
    height: hp("7%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    width: "100%", // Ensure full width
  },
  input: {
    flex: 1,
    paddingHorizontal: wp("2%"),
    fontSize: wp("4%"),
    height: "100%",
  },
  passwordToggle: {
    padding: wp("2%"),
  },
  passwordRequirements: {
    fontSize: wp("3.2%"),
    marginTop: hp("1.5%"),
    marginLeft: wp("1%"),
    letterSpacing: 0.2,
  },
  errorContainer: {
    marginTop: hp("2%"),
    marginHorizontal: wp("6%"),
    padding: wp("3%"),
    borderRadius: wp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  errorText: {
    fontSize: wp("3.5%"),
    letterSpacing: 0.2,
    flex: 1,
  },
  bottomContainer: {
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("2%"),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("2%"),
  },
  backButtonText: {
    fontSize: wp("4.2%"),
    fontWeight: "600",
    letterSpacing: 0.3,
    marginLeft: wp("1.5%"),
  },
  backToLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1%"),
  },
  backToLoginText: {
    fontSize: wp("3.8%"),
    marginLeft: wp("1.5%"),
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  nextButton: {
    borderRadius: wp("3%"),
    paddingVertical: hp("1.7%"),
    paddingHorizontal: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    minWidth: wp("35%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: "row",
  },
  nextButtonText: {
    fontSize: wp("4%"),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  nextButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("2%"),
  },
  nextButtonSimpleText: {
    fontSize: wp("4.2%"),
    marginRight: wp("1.5%"),
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default MedicationRegisterScreen;
