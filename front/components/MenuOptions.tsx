import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

// 📌 MenuOptions bileşeni artık veri ve ikonları dışarıdan alabiliyor!
const MenuOptions = ({
  data,
  placeholder,
  defaultValue,
  iconName,
  onChange, // ⬅️ Opsiyonel hale getirdik
}: {
  data: { label: string | number; value: string | number }[];
  placeholder: string;
  defaultValue: string | number;
  iconName?: string; // ⬅️ İkon opsiyonel olabilir
  onChange?: (value: string | number) => void; // ⬅️ onChange artık zorunlu değil
}) => {
  const [value, setValue] = useState(defaultValue);
  const [isFocus, setIsFocus] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: isDark ? "#1c1c1e" : "#f5f5f5" },
      ]}
    >
      {iconName && (
        <FontAwesome5
          name={iconName}
          size={20}
          color="#007bff"
          style={styles.icon}
        />
      )}
      <Dropdown
        style={[styles.dropdown, isFocus && styles.focusedDropdown]}
        placeholderStyle={[
          styles.placeholderStyle,
          { color: isDark ? "#aaa" : "#888" },
        ]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          { color: isDark ? "#fff" : "#333" },
        ]}
        inputSearchStyle={[
          styles.inputSearchStyle,
          { color: isDark ? "#fff" : "#000" },
        ]}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : "..."}
        searchPlaceholder="Ara..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          if (onChange) {
            onChange(item.value); // ⬅️ Eğer `onChange` varsa çağır
          }
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default MenuOptions;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  dropdown: {
    flex: 1,
    height: 50,
  },
  focusedDropdown: {
    borderColor: "#007bff",
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
