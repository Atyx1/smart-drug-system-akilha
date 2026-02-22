import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import StepIndicator from "react-native-step-indicator";
import Step1MedicineDetails from "@/components/compartment/steps/Step1MedicineDetails";
import Step2UsageType from "@/components/compartment/steps/Step2UsageType";
import Step3Schedule from "@/components/compartment/steps/Step3Schedule";
import Step4Summary from "@/components/compartment/steps/Step4Summary";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import ErrorModal from "@/components/alNoMessages/ErrorModal";

import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SHADOWS, SPACING, FONTS } from "@/constant/theme";
import { ScrollView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get("window");

const AddCompartmentScreen = () => {
  const { colors, activeColorScheme } = useTheme();
  const isDark = activeColorScheme === "dark";
  const navigation = useNavigation();
  const route = useRoute<any>();
  const {
    compartmentId,
    isUpdate = false,
    existingData,
    deviceId,
  } = route.params;

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(width)).current;

  // Shadow style based on theme
  const shadowStyle = isDark ? SHADOWS.dark.small : SHADOWS.light.small;

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    quantity: 1,
    usageType: "regular" as "regular" | "irregular", // Type assertion to ensure it's a literal type
    schedule: [] as string[], // ISO strings or similar
    regulatedSchedule: null as any, // regulatedSchedule alanını null olarak başlat
  });

  const [errors, setErrors] = useState({
    name: "",
    dosage: "",
    stock: "",
  });

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (existingData) {
        setFormData({
          name: existingData.name || "",
          dosage: existingData.dosage || "",
          quantity: existingData.quantity || 1,
          usageType: "regular",
          schedule: [],
          regulatedSchedule: null, // Reset sırasında da ekle
        });
      } else {
        setFormData({
          name: "",
          dosage: "",
          quantity: 1,
          usageType: "regular",
          schedule: [],
          regulatedSchedule: null, // Reset sırasında da ekle
        });
      }

      setStep(0);
      setErrors({
        name: "",
        dosage: "",
        stock: "",
      });
    }, [existingData])
  );

  // Animate component on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animate step transitions
  const animateStepChange = (nextStepValue: number) => {
    // First fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Change step
      setStep(nextStepValue);

      // Then fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const validateCurrentStep = () => {
    let isValid = true;
    const newErrors = { ...errors };

    switch (step) {
      case 0: // Step 1: Medicine Details
        // ... (bu kısım aynı kalacak)
        if (!formData.name.trim()) {
          newErrors.name = "İlaç adı gereklidir";
          isValid = false;
        } else {
          newErrors.name = "";
        }
        if (!formData.dosage.trim()) {
          newErrors.dosage = "Dozaj bilgisi gereklidir";
          isValid = false;
        } else {
          newErrors.dosage = "";
        }
        if (!formData.quantity || formData.quantity <= 0) {
          newErrors.stock = "Adet seçilmelidir";
          isValid = false;
        } else {
          newErrors.stock = "";
        }
        break;

      case 1: // Step 2: Usage Type
        // ... (bu kısım aynı kalacak)
        break;

      case 2: // Step 3: Schedule
        // Step3'ten gelen `totalDoses` değerinin varlığını ve 0'dan büyük olup olmadığını kontrol et.
        // Bu, en az bir dozun planlandığını doğrular.
        if (
          !formData.regulatedSchedule?.totalDoses ||
          formData.regulatedSchedule.totalDoses <= 0
        ) {
          isValid = false;
          // Show error modal instead of alert
          setErrorMessage(
            "Lütfen devam etmeden önce geçerli bir ilaç kullanım planı oluşturun."
          );
          setShowErrorModal(true);
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return; // Don't proceed if validation fails
    }

    const nextStepValue = Math.min(step + 1, 3);
    animateStepChange(nextStepValue);
  };

  const prevStep = () => {
    const prevStepValue = Math.max(step - 1, 0);
    animateStepChange(prevStepValue);
  };

  // Get step title
  const getStepTitle = () => {
    switch (step) {
      case 0:
        return "İlaç Bilgileri";
      case 1:
        return "Kullanım Türü";
      case 2:
        return "Zaman Planı";
      case 3:
        return "Özet & Kaydet";
      default:
        return "İlaç Ekle";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Step1MedicineDetails
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 1:
        return <Step2UsageType formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step3Schedule formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <Step4Summary
            formData={formData}
            compartmentId={compartmentId}
            deviceId={deviceId}
            isUpdate={isUpdate}
            navigation={navigation}
          />
        );
      default:
        return null;
    }
  };

  // Memoize step indicator styles to prevent re-rendering
  const stepIndicatorStyles = useMemo(
    () => ({
      stepIndicatorSize: wp(6),
      currentStepIndicatorSize: wp(7.5),
      separatorStrokeWidth: 2,
      currentStepStrokeWidth: 3,
      stepStrokeCurrentColor: colors.primary,
      stepStrokeWidth: 2,
      stepStrokeFinishedColor: colors.primary,
      stepStrokeUnFinishedColor: isDark
        ? colors.border.secondary
        : colors.border.primary,
      separatorFinishedColor: colors.primary,
      separatorUnFinishedColor: isDark
        ? colors.border.secondary
        : colors.border.primary,
      stepIndicatorFinishedColor: colors.primary,
      stepIndicatorUnFinishedColor: isDark
        ? colors.background.secondary
        : colors.background.primary,
      stepIndicatorCurrentColor: colors.background.primary,
      stepIndicatorLabelFontSize: wp(3.2),
      currentStepIndicatorLabelFontSize: wp(3.5),
      stepIndicatorLabelCurrentColor: colors.primary,
      stepIndicatorLabelFinishedColor: colors.text.inverse,
      stepIndicatorLabelUnFinishedColor: colors.text.tertiary,
      labelColor: colors.text.secondary,
      labelSize: wp(3),
      currentStepLabelColor: colors.primary,
    }),
    [isDark, colors]
  );

  return (
    <View
      style={[styles.safeArea, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      <View
        style={[styles.header, { borderBottomColor: colors.border.primary }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={wp(6)}
            color={colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          {getStepTitle()}
        </Text>
        <View style={{ width: wp(6) }} />
      </View>

      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.background.primary,
            opacity: fadeAnim,
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Step Indicator */}
        <View style={[styles.stepIndicatorContainer, shadowStyle]}>
          <StepIndicator
            currentPosition={step}
            stepCount={4}
            labels={["İlaç", "Kullanım", "Plan", "Özet"]}
            customStyles={stepIndicatorStyles}
          />
        </View>

        {/* Content */}
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderStep()}
          </ScrollView>
        </Animated.View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          {step > 0 ? (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.secondary, opacity: 0.9 },
              ]}
              onPress={prevStep}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={wp(5)}
                color={colors.text.inverse}
              />
              <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
                Geri
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonPlaceholder} />
          )}

          {step < 3 ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={nextStep}
            >
              <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
                İleri
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={wp(5)}
                color={colors.text.inverse}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonPlaceholder} />
          )}
        </View>
      </Animated.View>

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        title="Eksik Bilgi"
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
  );
};

export default AddCompartmentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
  },
  backButton: {
    padding: wp(1),
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: "600",
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  stepIndicatorContainer: {
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(3),
    marginBottom: hp(1),
    marginHorizontal: wp(4),
    marginTop: hp(2),
    borderRadius: wp(3),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(3),
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp(4),
    paddingBottom: Platform.OS === "ios" ? hp(4) : hp(3),
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
    marginHorizontal: wp(2),
    borderRadius: wp(2.5),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonPlaceholder: {
    flex: 1,
    marginHorizontal: wp(2),
  },
  buttonText: {
    fontWeight: "600",
    fontSize: wp(3.8),
    marginHorizontal: wp(2),
  },
});
