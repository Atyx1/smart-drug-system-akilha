import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RegularScheduleForm from "@/components/schedules/RegularScheduleForm";
import IrregularScheduleForm from "@/components/schedules/IrregularScheduleForm";
import { useTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ErrorModal from "@/components/alNoMessages/ErrorModal";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canProceed?: (canProceed: boolean) => void;
}

const Step3Schedule: React.FC<Props> = ({
  formData,
  setFormData,
  onPrevious,
  onNext,
  canProceed,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Form validasyon durumu
  const [isFormValid, setIsFormValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  // Hata modalı state'leri
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Quantity (ilaç miktarı) değerini formData'dan al
  const quantity = formData.quantity ? parseInt(formData.quantity) : 0;

  // Form validasyon durumunu üst bileşene bildir
  useEffect(() => {
    if (canProceed) {
      canProceed(isFormValid);
    }
  }, [isFormValid, canProceed]);

  // Validasyon durumunu güncelleyen fonksiyon
  const handleValidation = (isValid: boolean, message?: string) => {
    setIsFormValid(isValid);
    if (message) {
      setValidationMessage(message);
    }
  };

  // Kullanıcı ileri butonuna bastığında ve form geçersizse uyarı göster
  const handleNext = () => {
    if (!isFormValid) {
      setErrorTitle("Dikkat");
      setErrorMessage(
        validationMessage ||
          "Lütfen ilaç programınızı eksiksiz bir şekilde planlayın."
      );
      setErrorModalVisible(true);
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <View style={styles.containerWrapper}>
      <ErrorModal
        visible={errorModalVisible}
        title={errorTitle}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={wp("6%")}
            color={colors.primary}
            style={{ opacity: 0.9 }}
          />
          <Text style={styles.title}>İlaç Planı Oluştur</Text>
        </View>

        <View style={styles.formContainer}>
          {formData.usageType === "regular" ? (
            <RegularScheduleForm
              formData={formData}
              setFormData={setFormData}
              quantity={quantity}
              onValidation={handleValidation}
            />
          ) : (
            <IrregularScheduleForm
              formData={formData}
              setFormData={setFormData}
              quantity={quantity}
              onValidation={handleValidation}
            />
          )}
        </View>

        {!isFormValid && validationMessage && (
          <View style={styles.validationContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={wp("5%")}
              color={colors.error}
            />
            <Text style={styles.validationText}>{validationMessage}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Step3Schedule;

const SHADOWS = {
  light: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  },
  dark: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
    },
  },
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    containerWrapper: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: wp("4%"),
    },
    container: {
      width: "100%",
      maxWidth: 600,
      paddingTop: hp("2%"),
      paddingBottom: hp("5%"),
      backgroundColor: colors.background.primary,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("2.5%"),
      paddingHorizontal: wp("2%"),
    },
    title: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      marginLeft: wp("2%"),
      color: colors.text.primary,
    },
    formContainer: {
      backgroundColor: colors.background.secondary,
      borderRadius: wp("3%"),
      padding: wp("4%"),
      marginBottom: hp("2%"),
      borderWidth: 1,
      borderColor: colors.border.secondary,
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 1 }),
    },
    validationContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.error}15`,
      padding: wp("3%"),
      marginHorizontal: wp("4%"),
      marginTop: hp("1%"),
      borderRadius: wp("2%"),
      borderWidth: 1,
      borderColor: `${colors.error}30`,
    },
    validationText: {
      flex: 1,
      fontSize: wp("3.5%"),
      color: colors.error,
      marginLeft: wp("2%"),
      lineHeight: wp("5%"),
    },
  });
