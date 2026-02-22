// src/screens/receipt/steps/DateRangeDropdown.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ViewStyle,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/localization/i18n";

// Türkçe locale ayarları
LocaleConfig.locales["tr"] = {
  monthNames: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  monthNamesShort: [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ],
  dayNames: [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ],
  dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
};
LocaleConfig.defaultLocale = "tr";

interface DateRangeDropdownProps {
  startDate: Date;
  endDate: Date;
  onChange: (dates: { startDate: Date; endDate: Date }) => void;
  style?: ViewStyle;
}

const DateRangeDropdown: React.FC<DateRangeDropdownProps> = ({
  startDate,
  endDate,
  onChange,
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const isDateSelected = startDate && endDate && startDate !== endDate;

  const formatDateForCalendar = (date: Date) => format(date, "yyyy-MM-dd");

  const handleDayPress = (day: { dateString: string; timestamp: number }) => {
    const selectedDate = new Date(day.timestamp);
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(selectedDate);
      setTempEndDate(undefined);
    } else {
      if (selectedDate < tempStartDate) {
        setTempStartDate(selectedDate);
      } else {
        setTempEndDate(selectedDate);
        setShowPicker(false);
        onChange({ startDate: tempStartDate, endDate: selectedDate });
      }
    }
  };

  const markedDates = () => {
    let marked: { [key: string]: any } = {};
    if (tempStartDate) {
      marked[formatDateForCalendar(tempStartDate)] = {
        startingDay: true,
        color: colors.accent.main,
        textColor: colors.text.inverse,
      };
    }
    if (tempEndDate) {
      marked[formatDateForCalendar(tempEndDate)] = {
        endingDay: true,
        color: colors.accent.main,
        textColor: colors.text.inverse,
      };
    }
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      while (start <= end) {
        const dateString = formatDateForCalendar(start);
        if (
          dateString !== formatDateForCalendar(tempStartDate) &&
          dateString !== formatDateForCalendar(tempEndDate)
        ) {
          marked[dateString] = {
            color: `${colors.accent}50`,
            textColor: colors.primary,
          };
        }
        start.setDate(start.getDate() + 1);
      }
    }
    return marked;
  };

  const stylesDynamic = createStyles(colors);

  return (
    <View style={[stylesDynamic.container, style]}>
      <TouchableOpacity
        style={[
          stylesDynamic.iconButton,
          isDateSelected && stylesDynamic.selectedIconButton,
        ]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="calendar-range"
          size={wp("7%")}
          color={colors.text.inverse}
        />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={stylesDynamic.modalOverlay}>
          <View style={stylesDynamic.modalContent}>
            <View style={stylesDynamic.datePreview}>
              <Text style={stylesDynamic.datePreviewText}>
                {tempStartDate
                  ? format(tempStartDate, "dd MMM", { locale: tr })
                  : t("start_date")}{" "}
                -{" "}
                {tempEndDate
                  ? format(tempEndDate, "dd MMM yyyy", { locale: tr })
                  : t("end_date")}
              </Text>
            </View>

            <Calendar
              style={stylesDynamic.calendar}
              theme={{
                backgroundColor: colors.background.primary,
                calendarBackground: colors.background.primary,
                textSectionTitleColor: colors.primary,
                selectedDayBackgroundColor: colors.accent,
                selectedDayTextColor: colors.text.inverse,
                todayTextColor: colors.accent,
                dayTextColor: colors.text.primary,
                textDisabledColor: colors.text.secondary,
              }}
              markedDates={markedDates()}
              markingType="period"
              onDayPress={handleDayPress}
              maxDate={format(today, "yyyy-MM-dd")}
            />

            <View style={stylesDynamic.actions}>
              <TouchableOpacity
                style={stylesDynamic.cancelButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={stylesDynamic.cancelText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={stylesDynamic.confirmButton}
                onPress={() => {
                  if (tempStartDate && tempEndDate) {
                    onChange({
                      startDate: tempStartDate,
                      endDate: tempEndDate,
                    });
                    setShowPicker(false);
                  }
                }}
                disabled={!tempStartDate || !tempEndDate}
              >
                <Text style={stylesDynamic.confirmText}>{t("ok")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: typeof import("@/constant/theme").lightColors) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    iconButton: {
      backgroundColor: colors.primary,
      width: wp("14%"),
      height: wp("14%"),
      borderRadius: wp("7%"),
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.border.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: wp("2%"),
      elevation: 5,
    },
    selectedIconButton: {
      backgroundColor: colors.accent,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: wp("95%"),
      backgroundColor: colors.background.primary,
      borderRadius: wp("4%"),
      padding: wp("4%"),
    },
    datePreview: {
      backgroundColor: `${colors.accent}20`,
      padding: wp("3%"),
      borderRadius: wp("3%"),
      alignItems: "center",
      marginBottom: hp("2%"),
    },
    datePreviewText: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: colors.primary,
    },
    calendar: {
      borderRadius: wp("4%"),
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp("2%"),
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.background.secondary,
      padding: wp("3%"),
      borderRadius: wp("3%"),
      marginRight: wp("2%"),
      alignItems: "center",
    },
    confirmButton: {
      flex: 1,
      backgroundColor: colors.accent,
      padding: wp("3%"),
      borderRadius: wp("3%"),
      alignItems: "center",
    },
    cancelText: {
      color: colors.primary,
      fontWeight: "600",
    },
    confirmText: {
      color: colors.text.inverse,
      fontWeight: "600",
    },
  });

export default DateRangeDropdown;
