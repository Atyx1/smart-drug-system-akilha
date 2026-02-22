// src/components/receipt/common/NoResults.tsx

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useTheme } from "@/context/ThemeContext";
import { NoResultsProps } from "@/types/Types";
import { useTranslation } from "@/localization/i18n";

const NoResults: React.FC<NoResultsProps> = ({
  message,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card.background, // Kart arka planı
          // iOS gölgesi için shadowColor, Android için elevation
          shadowColor: colors.border.primary,
        },
      ]}
    >
      <MaterialIcons
        name="search-off"
        size={wp("15%")}
        color={colors.text.secondary} // İkon rengi
      />
      <Text style={[styles.message, { color: colors.text.primary }]}>
        {message || t("no_results_found")}
      </Text>
      <Text style={[styles.suggestion, { color: colors.text.secondary }]}>
        {t("try_different_filters")}
      </Text>
    </View>
  );
};

export default NoResults;

const styles = StyleSheet.create({
  container: {
    // Kart stili
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("5%"),
    marginHorizontal: wp("4%"),
    marginVertical: hp("2%"),
    borderRadius: wp("2%"),
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  message: {
    fontSize: wp("4%"),
    fontWeight: "600",
    textAlign: "center",
    marginTop: hp("2%"),
  },
  suggestion: {
    fontSize: wp("3.5%"),
    textAlign: "center",
    marginTop: hp("1%"),
  },
});
