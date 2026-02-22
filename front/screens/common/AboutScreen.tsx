import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "@/localization/i18n";

const AboutScreen = () => {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const APP_VERSION = "1.0.0";
  const COPYRIGHT_YEAR = new Date().getFullYear();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Bağlantı açılamadı:", err)
    );
  };

  return (
    <View style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={wp("6%")}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("about")}</Text>
        <View style={{ width: wp("6%") }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={wp("20%")}
              color={colors.primary}
            />
            <Text style={styles.appName}>{t("app_name")}</Text>
            <Text style={styles.versionText}>
              {t("app_version")} {APP_VERSION}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("about_app")}</Text>
            <Text style={styles.paragraph}>{t("about_app_description")}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("features")}</Text>

            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={wp("6%")}
                color={colors.primary}
                style={styles.featureIcon}
              />
              <View>
                <Text style={styles.featureTitle}>{t("photo_support")}</Text>
                <Text style={styles.featureDescription}>
                  {t("take_save_receipt_photos")}
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={wp("6%")}
                color={colors.primary}
                style={styles.featureIcon}
              />
              <View>
                <Text style={styles.featureTitle}>
                  {t("different_receipt_types")}
                </Text>
                <Text style={styles.featureDescription}>
                  {t("manage_cash_pos_receipts")}
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="magnify"
                size={wp("6%")}
                color={colors.primary}
                style={styles.featureIcon}
              />
              <View>
                <Text style={styles.featureTitle}>{t("advanced_search")}</Text>
                <Text style={styles.featureDescription}>
                  {t("filter_by_date_store_type")}
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="shield-account-outline"
                size={wp("6%")}
                color={colors.primary}
                style={styles.featureIcon}
              />
              <View>
                <Text style={styles.featureTitle}>{t("user_management")}</Text>
                <Text style={styles.featureDescription}>
                  {t("different_roles_permissions")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("contact")}</Text>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() =>
                handleOpenLink("mailto:support@receipttracker.com")
              }
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={wp("6%")}
                color={colors.primary}
                style={styles.contactIcon}
              />
              <Text style={styles.contactText}>support@receipttracker.com</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => handleOpenLink("https://www.receipttracker.com")}
            >
              <MaterialCommunityIcons
                name="web"
                size={wp("6%")}
                color={colors.primary}
                style={styles.contactIcon}
              />
              <Text style={styles.contactText}>www.receipttracker.com</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.copyright}>
            © {COPYRIGHT_YEAR} {t("app_name")}. {t("all_rights_reserved")}
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
    logoContainer: {
      alignItems: "center",
      marginVertical: hp("3%"),
    },
    appName: {
      fontSize: wp("6%"),
      fontWeight: "700",
      color: colors.primary,
      marginTop: hp("1%"),
    },
    versionText: {
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
      marginTop: hp("0.5%"),
    },
    section: {
      marginTop: hp("2.5%"),
      marginBottom: hp("1.5%"),
    },
    sectionTitle: {
      fontSize: wp("5%"),
      fontWeight: "700",
      color: colors.text.primary,
      marginBottom: hp("1.5%"),
    },
    paragraph: {
      fontSize: wp("3.8%"),
      color: colors.text.secondary,
      lineHeight: wp("6%"),
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("1.5%"),
    },
    featureIcon: {
      marginRight: wp("3%"),
    },
    featureTitle: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: colors.text.primary,
    },
    featureDescription: {
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: hp("1%"),
    },
    contactIcon: {
      marginRight: wp("3%"),
    },
    contactText: {
      fontSize: wp("3.8%"),
      color: colors.primary,
      textDecorationLine: "underline",
    },
    copyright: {
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
      textAlign: "center",
      marginTop: hp("5%"),
      marginBottom: hp("2%"),
    },
  });

export default AboutScreen;
