import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Calendar } from "react-native-calendars";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Bugün ve yarın için tarih formatlarını alıyoruz
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const todayStr = today.toISOString().split("T")[0];
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const DatePicker = ({
  value,
  onChange,
  mode = "single", // varsayılan "single" değiştirildi
  minDate = todayStr, // default olarak bugün
  defaultValue, // Varsayılan değer
}: {
  value: any;
  onChange: (val: any) => void;
  mode?: "single" | "range";
  minDate?: string;
  defaultValue?: Date | string;
}) => {
  // Eğer value undefined ise ve defaultValue verildiyse, defaultValue kullan
  const initialDate =
    value ||
    (defaultValue
      ? typeof defaultValue === "string"
        ? defaultValue
        : defaultValue.toISOString().split("T")[0]
      : tomorrowStr); // Varsayılan olarak yarın

  const [selectedDate, setSelectedDate] = useState(
    mode === "single"
      ? typeof initialDate === "string"
        ? initialDate
        : initialDate.toISOString?.().split("T")[0]
      : null
  );
  const [startDate, setStartDate] = useState(value?.startDate || null);
  const [endDate, setEndDate] = useState(value?.endDate || null);
  const [expanded, setExpanded] = useState(false);

  // Başlangıçta değer yoksa varsayılan değeri kullan
  React.useEffect(() => {
    if (!value && mode === "single") {
      setSelectedDate(
        typeof initialDate === "string"
          ? initialDate
          : initialDate.toISOString().split("T")[0]
      );
      onChange(new Date(initialDate));
    }
  }, []);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleDayPress = (day: any) => {
    const selected = day.dateString;

    if (mode === "single") {
      setSelectedDate(selected);
      onChange(new Date(selected));
      setExpanded(false);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(selected);
        setEndDate(null);
        onChange({ startDate: selected, endDate: null });
      } else if (selected >= startDate) {
        setEndDate(selected);
        onChange({ startDate, endDate: selected });
      } else {
        setStartDate(selected);
        setEndDate(null);
        onChange({ startDate: selected, endDate: null });
      }
    }
  };

  const getMarkedDates = () => {
    if (mode === "single" && selectedDate) {
      return {
        [selectedDate]: {
          selected: true,
          selectedColor: "#3b82f6",
          selectedTextColor: "#fff",
        },
      };
    }

    if (mode === "range" && startDate) {
      const marked: any = {
        [startDate]: {
          startingDay: true,
          color: "#3b82f6",
          textColor: "#fff",
        },
      };

      if (endDate) {
        let current = new Date(startDate);
        const last = new Date(endDate);

        while (current <= last) {
          const dateStr = current.toISOString().split("T")[0];
          if (dateStr !== startDate && dateStr !== endDate) {
            marked[dateStr] = { color: "#bfdbfe", textColor: "#000" };
          }
          current.setDate(current.getDate() + 1);
        }

        marked[endDate] = {
          endingDay: true,
          color: "#3b82f6",
          textColor: "#fff",
        };
      }

      return marked;
    }

    return {};
  };

  // Format tarih gösterimini daha okunaklı yap
  const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return "Tarih Seç";

    const date = new Date(dateStr);
    if (date.toISOString().split("T")[0] === todayStr) {
      return "Bugün";
    } else if (date.toISOString().split("T")[0] === tomorrowStr) {
      return "Yarın";
    }

    // Türkçe tarih formatı: GG.AA.YYYY
    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand}>
        <Text style={styles.label}>
          {mode === "single"
            ? `    ${getFormattedDate(selectedDate)}`
            : "    Tarih Aralığı Seç"}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <Calendar
          markingType={mode === "range" ? "period" : "simple"}
          markedDates={getMarkedDates()}
          onDayPress={handleDayPress}
          minDate={minDate} // Minimum tarih (bugünden önce tarih seçilemez)
          hideExtraDays={true} // Ay içinde olmayan günleri gizle
        />
      )}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1e3a8a",
  },
});
