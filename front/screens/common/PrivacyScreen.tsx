import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "@/localization/i18n";

const PrivacyScreen = () => {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={wp("6%")} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("privacy")}</Text>
        <View style={{ width: wp("6%") }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>{t("privacy_policy")}</Text>
          
          <Text style={styles.paragraph}>
            {t("privacy_intro")}
          </Text>

          <Text style={styles.subTitle}>{t("collected_information")}</Text>
          <Text style={styles.paragraph}>
            {t("collected_information_desc")}
          </Text>
          
          <Text style={styles.subTitle}>{t("data_usage")}</Text>
          <Text style={styles.paragraph}>
            {t("data_usage_desc")}
          </Text>
          
          <Text style={styles.subTitle}>{t("data_security")}</Text>
          <Text style={styles.paragraph}>
            {t("data_security_desc")}
          </Text>
          
          <Text style={styles.subTitle}>{t("cookies")}</Text>
          <Text style={styles.paragraph}>
            {t("cookies_desc")}
          </Text>
          
          <Text style={styles.subTitle}>{t("contact")}</Text>
          <Text style={styles.paragraph}>
            {t("privacy_contact_desc")}
          </Text>
          
          <Text style={styles.footer}>
            {t("last_updated")}: {t("june")} 2023
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: typeof import("@/constant/theme").lightColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("2%"),
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    headerTitle: {
      fontSize: wp("5%"),
      fontWeight: "700",
      color: colors.text.primary,
      textAlign: "center",
    },
    backButton: {
      padding: wp("1%"),
      borderRadius: wp("6%"),
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      flexGrow: 1,
    },
    contentContainer: {
      padding: wp("5%"),
    },
    sectionTitle: {
      fontSize: wp("5%"),
      fontWeight: "700",
      color: colors.primary,
      marginBottom: hp("2%"),
    },
    subTitle: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: colors.text.primary,
      marginTop: hp("2%"),
      marginBottom: hp("1%"),
    },
    paragraph: {
      fontSize: wp("3.8%"),
      color: colors.text.secondary,
      lineHeight: wp("6%"),
      marginBottom: hp("1%"),
    },
    footer: {
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
      marginTop: hp("4%"),
      fontStyle: "italic",
    },
  });

export default PrivacyScreen; 