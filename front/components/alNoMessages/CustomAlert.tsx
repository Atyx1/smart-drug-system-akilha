// src/components/common/CustomAlert.tsx

import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONTS } from "@/constant/theme";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// Theme context'ten renkleri almak için
import { useTheme } from "@/context/ThemeContext";
import { CustomAlertProps } from "@/types/Types";
import { useTranslation } from "@/localization/i18n";

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  type = "warning",
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Alert ikonunu belirleyen fonksiyon
  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle-outline";
      case "danger":
        return "alert-circle-outline";
      default:
        return "warning-outline";
    }
  };

  // Hangi renge bürüneceğini belirleyen fonksiyon
  const getColor = () => {
    switch (type) {
      case "success":
        return colors.success;
      case "danger":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  // colors'a göre stilleri oluşturan fonksiyon
  const styles = createStyles(colors, getColor());

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getIcon()}
              size={wp("12%")}
              // İkon rengi = text.inverse
              color={colors.text.inverse}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>{t("confirm")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const createStyles = (
  colors: typeof import("@/constant/theme").lightColors,
  mainColor: string
) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      // Tema içerisindeki modal'ın overlay rengini kullanıyoruz:
      backgroundColor: colors.modal.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: wp("80%"),
      // Tema içerisindeki modal'ın arkaplan rengini kullanabiliriz:
      backgroundColor: colors.modal.background,
      borderRadius: wp("5%"),
      padding: wp("5%"),
      alignItems: "center",
    },
    iconContainer: {
      width: wp("20%"),
      height: wp("20%"),
      borderRadius: wp("10%"),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp("2%"),
      // İkon arka planı, success/error/primary vs. getColor'dan geliyor
      backgroundColor: mainColor,
    },
    title: {
      fontSize: wp("4.5%"),
      fontWeight: FONTS.weight.bold as any,
      color: colors.text.primary,
      marginBottom: hp("1%"),
      textAlign: "center",
    },
    message: {
      fontSize: wp("4%"),
      color: colors.text.secondary,
      marginBottom: hp("3%"),
      textAlign: "center",
      lineHeight: wp("5.5%"),
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    cancelButton: {
      flex: 1,
      paddingVertical: hp("1.5%"),
      borderRadius: wp("2%"),
      marginHorizontal: wp("2%"),
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    confirmButton: {
      flex: 1,
      paddingVertical: hp("1.5%"),
      borderRadius: wp("2%"),
      marginHorizontal: wp("2%"),
      // Burada da success/error/primary vs. (mainColor) kullanabiliriz
      backgroundColor: mainColor,
    },
    buttonText: {
      fontSize: wp("4%"),
      fontWeight: FONTS.weight.semibold as any,
      color: colors.text.inverse,
      textAlign: "center",
    },
    cancelButtonText: {
      fontSize: wp("4%"),
      fontWeight: FONTS.weight.semibold as any,
      // İptal butonu text rengi = normal text primary
      color: colors.text.primary,
      textAlign: "center",
    },
  });
