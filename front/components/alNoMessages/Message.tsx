// src/components/common/Message.tsx

import React from "react";
import { StyleSheet, Animated, Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { MessageProps } from "@/types/Types";

const Message: React.FC<MessageProps> = ({
  message,
  visible,
  type = "error",
}) => {
  const { colors } = useTheme(); // Tema renklerini çekiyoruz
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible || !message) return null;

  const isSuccess = type === "success";

  // Temadaki background renklerini kullanıyoruz
  const containerBackgroundColor = isSuccess
    ? colors.successBackground
    : colors.errorBackground;

  // Kenardaki şerit ve ikonun asıl rengi
  const borderLeftColor = isSuccess ? colors.success : colors.error;
  // İkon rengi
  const iconColor = isSuccess ? colors.success : colors.error;
  // Yazı rengi
  const textColor = isSuccess ? colors.success : colors.error;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: containerBackgroundColor,
          borderLeftColor,
          opacity,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={isSuccess ? "checkmark-circle" : "alert-circle"}
          size={wp("5%")}
          color={iconColor}
        />
      </View>
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    borderRadius: wp("2%"),
    marginVertical: hp("1.5%"),
    marginHorizontal: wp("1%"),
    borderLeftWidth: wp("1%"),
  },
  iconContainer: {
    marginRight: wp("2%"),
  },
  text: {
    flex: 1,
    fontSize: wp("3.5%"),
    lineHeight: wp("4.5%"),
  },
});
