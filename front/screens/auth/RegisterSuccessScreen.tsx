// screens/RegistrationSuccessScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/localization/i18n";

// Theme colors
const BLUE_COLOR = "#5C88C6"; // Consistent blue color used across the app


const RegistrationSuccessScreen = ({ route, navigation }) => {

  const { colors } = useTheme();
  const { t } = useTranslation();
  const message = route.params?.message || t('registration_complete');
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // First animation: fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Set timeout to navigate to login after showing success message
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace("Login");
      });
    }, 3000); // Extended duration for better readability

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim, 
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            borderWidth: 1
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={wp("20%")} color={BLUE_COLOR} />
        </View>
        <Text style={[styles.message, { color: colors.text.primary }]}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("5%"),
  },
  content: {
    alignItems: "center",
    padding: wp("8%"),
    borderRadius: wp("4%"),
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  iconContainer: {
    width: wp("25%"),
    height: wp("25%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  message: {
    fontSize: wp("4.5%"),
    textAlign: "center",
    marginTop: hp("2%"),
    fontWeight: "600",
    paddingHorizontal: wp("2%"),
    lineHeight: hp("3%"),
  },
});

export default RegistrationSuccessScreen;
