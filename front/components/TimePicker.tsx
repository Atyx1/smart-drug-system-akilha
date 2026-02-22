import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  // 🕓 value (örn. "08:00") → Date objesine çevir
  const getDateFromTimeString = (timeString: string) => {
    const now = new Date();
    if (!timeString) return now;

    const [hour, minute] = timeString.split(":").map(Number);
    now.setHours(hour);
    now.setMinutes(minute);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        setShow(false);
        return;
      }
      if (event.type === "set" && selectedDate) {
        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        const formatted = `${hours}:${minutes}`;
        setShow(false);
        onChange(formatted);
      }
    } else {
      if (selectedDate) {
        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        const formatted = `${hours}:${minutes}`;
        onChange(formatted);
      }
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Text style={styles.buttonText}>{value || "Saat Seç"}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={getDateFromTimeString(value)} // ✅ artık string saatten doğru Date objesi oluşturuluyor
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          is24Hour
        />
      )}
    </View>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
});
