// src/components/CustomDateRangePicker.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/localization/i18n";

interface CustomDateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: { startDate: Date | null; endDate: Date | null }) => void;
  startLabel?: string;
  endLabel?: string;
  errorStart?: string;
  errorEnd?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  startLabel,
  endLabel,
  errorStart,
  errorEnd,
  maximumDate,
  minimumDate,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return t("select_date");
    return format(date, "dd MMMM yyyy", { locale: tr });
  };

  const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowStartPicker(Platform.OS === "ios");
    if (event.type === "set" && date) {
      onChange({ startDate: date, endDate });
    }
  };

  const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (event.type === "set" && date) {
      onChange({ startDate, endDate: date });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        {/* Start Date Picker */}
        <View style={styles.datePickerWrapper}>
          {startLabel && <Text style={styles.label}>{startLabel}</Text>}
          <TouchableOpacity
            style={[
              styles.dateButton,
              errorStart ? styles.dateButtonError : null,
            ]}
            onPress={() => setShowStartPicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !startDate ? styles.placeholderText : null,
              ]}
            >
              {formatDate(startDate)}
            </Text>
            <MaterialCommunityIcons
              name="calendar"
              size={wp("6%")}
              color={colors.primary}
            />
          </TouchableOpacity>
          {errorStart && <Text style={styles.errorText}>{errorStart}</Text>}
        </View>

        {/* End Date Picker */}
        <View style={styles.datePickerWrapper}>
          {endLabel && <Text style={styles.label}>{endLabel}</Text>}
          <TouchableOpacity
            style={[styles.dateButton, errorEnd ? styles.dateButtonError : null]}
            onPress={() => setShowEndPicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !endDate ? styles.placeholderText : null,
              ]}
            >
              {formatDate(endDate)}
            </Text>
            <MaterialCommunityIcons
              name="calendar"
              size={wp("6%")}
              color={colors.primary}
            />
          </TouchableOpacity>
          {errorEnd && <Text style={styles.errorText}>{errorEnd}</Text>}
        </View>
      </View>

      {/* Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleStartDateChange}
          maximumDate={maximumDate || undefined}
          minimumDate={minimumDate || undefined}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndDateChange}
          maximumDate={maximumDate || undefined}
          minimumDate={startDate || minimumDate || undefined}
        />
      )}
    </View>
  );
};

const createStyles = (colors: typeof import("@/constant/theme").lightColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    pickerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    datePickerWrapper: {
      width: "48%",
    },
    label: {
      fontSize: wp("3.5%"),
      marginBottom: hp("1%"),
      color: colors.text.primary,
      fontWeight: "500",
    },
    dateButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: wp("3%"),
      height: hp("7%"),
      borderRadius: wp("2%"),
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    dateButtonError: {
      borderColor: colors.error,
    },
    dateText: {
      fontSize: wp("3.5%"),
      color: colors.text.primary,
    },
    placeholderText: {
      color: colors.text.secondary,
    },
    errorText: {
      fontSize: wp("3%"),
      color: colors.error,
      marginTop: hp("0.5%"),
    },
  });

export default CustomDateRangePicker;
