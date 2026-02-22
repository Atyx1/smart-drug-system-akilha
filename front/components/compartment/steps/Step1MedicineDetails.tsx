import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { FONTS, SHADOWS, SPACING } from "@/constant/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface Props {
  formData: {
    name: string;
    dosage: string;
    quantity: number;
  };
  setFormData: (data: any) => void;
  errors: {
    name?: string;
    dosage?: string;
    quantity?: string;
    [key: string]: string | undefined;
  };
  setErrors: (errors: any) => void;
}

const STORAGE_KEY = "medicineDetailsFormData";

const Step1MedicineDetails: React.FC<Props> = ({
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const quantityOptions = Array.from({ length: 14 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  // Load saved form data when component mounts

  // Save form data when it changes
  useEffect(() => {
    const saveFormData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error("Failed to save form data", error);
      }
    };

    saveFormData();
  }, [formData]);

  const validateField = (field: string, value: any) => {
    let newErrors = { ...errors };
    delete newErrors[field];

    if (field === "name" && !value) {
      newErrors.name = "İlaç adı gereklidir";
    } else if (field === "dosage" && !value) {
      newErrors.dosage = "Dozaj bilgisi gereklidir";
    } else if (field === "quantity" && !value) {
      newErrors.quantity = "Adet seçilmelidir";
    }

    setErrors(newErrors);
  };

  return (
    <View style={styles.container}>
      {/* Medicine Name */}
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons
            name="pill"
            size={wp("5%")}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.label}>İlaç Adı</Text>
        </View>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(text) => {
            const filteredText = text.replace(/[0-9]/g, "");
            setFormData((prev: any) => ({ ...prev, name: filteredText }));
            validateField("name", filteredText);
          }}
          placeholder="Parol, Vermidon, vb."
          placeholderTextColor={colors.input.placeholder}
        />
        {errors.name && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={wp("4%")}
              color={colors.error}
            />
            <Text style={styles.error}>{errors.name}</Text>
          </View>
        )}
      </View>

      {/* Quantity */}
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons
            name="counter"
            size={wp("5%")}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.label}>Hazneye Eklenecek Adet</Text>
        </View>
        <View
          style={[styles.pickerWrapper, errors.quantity && styles.inputError]}
        >
          <RNPickerSelect
            onValueChange={(value) => {
              setFormData((prev: any) => ({ ...prev, quantity: value }));
              validateField("quantity", value);
            }}
            value={formData.quantity}
            items={quantityOptions}
            placeholder={{ label: "Seçiniz...", value: null }}
            useNativeAndroidPickerStyle={false}
            Icon={() => (
              <MaterialCommunityIcons
                name="chevron-down"
                size={wp("6%")}
                color={colors.primary}
                style={styles.pickerIcon}
              />
            )}
            style={{
              inputIOS: styles.pickerInput,
              inputAndroid: styles.pickerInput,
              iconContainer: styles.iconContainer,
              placeholder: { color: colors.input.placeholder },
            }}
          />
        </View>
        {errors.quantity && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={wp("4%")}
              color={colors.error}
            />
            <Text style={styles.error}>{errors.quantity}</Text>
          </View>
        )}
      </View>

      {/* Dosage */}
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons
            name="beaker-outline"
            size={wp("5%")}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={styles.label}>Dozaj (mg / ml)</Text>
        </View>
        <TextInput
          style={[styles.input, errors.dosage && styles.inputError]}
          value={formData.dosage}
          onChangeText={(text) => {
            const filteredText = text.replace(/[^0-9]/g, "");
            setFormData((prev: any) => ({ ...prev, dosage: filteredText }));
            validateField("dosage", filteredText);
          }}
          placeholder="500"
          keyboardType="numeric"
          placeholderTextColor={colors.input.placeholder}
        />
        {errors.dosage && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={wp("4%")}
              color={colors.error}
            />
            <Text style={styles.error}>{errors.dosage}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: hp("2.5%"),
      paddingHorizontal: wp("4%"),
    },
    inputContainer: {
      marginBottom: hp("2.5%"),
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("1%"),
    },
    label: {
      fontSize: wp("4%"),
      fontWeight: "500",
      color: colors.text.primary,
      marginLeft: wp("1.2%"),
    },
    icon: {
      opacity: 0.8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.input.border,
      backgroundColor: colors.input.background,
      padding: wp("3%"),
      borderRadius: wp("3%"),
      fontSize: wp("4%"),
      color: colors.input.text,
      minHeight: hp("6%"),
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 2 }),
    },
    inputError: {
      borderColor: colors.error,
      borderWidth: 1.5,
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: colors.input.border,
      backgroundColor: colors.input.background,
      borderRadius: wp("3%"),
      minHeight: hp("6%"),
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 2 }),
    },
    pickerInput: {
      fontSize: wp("4%"),
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("3.5%"),
      color: colors.input.text,
      borderRadius: wp("3%"),
      backgroundColor: "transparent",
      minHeight: hp("6%"),
    },
    pickerIcon: {
      opacity: 0.8,
    },
    iconContainer: {
      top: hp("1.5%"),
      right: wp("3%"),
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp("0.7%"),
    },
    error: {
      color: colors.error,
      marginLeft: wp("1.2%"),
      fontSize: wp("3.5%"),
    },
  });

export default Step1MedicineDetails;
