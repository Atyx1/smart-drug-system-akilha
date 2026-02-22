// src/components/SuccessModal.tsx

import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@/context/ThemeContext";
import { SuccessModalProps } from "@/types/Types";
import { useTranslation } from "@/localization/i18n";

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  message,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={[
          styles.modalOverlay,
          // Temadan modal overlay rengi:
          { backgroundColor: colors.modal.overlay },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.modal.background, // Temadaki modal background
              shadowColor: colors.border.primary, // Gölge rengi (iOS için)
            },
          ]}
        >
          <View
            style={[
              styles.successIconContainer,
              { backgroundColor: colors.successBackground }, // Temadaki successBackground
            ]}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={wp("15%")}
              color={colors.success} // İkon rengi
            />
          </View>

          <Text style={[styles.title, { color: colors.text.primary }]}>
            {t("success")}
          </Text>

          <Text style={[styles.message, { color: colors.text.secondary }]}>
            {message}
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.text.inverse }, // Buton yazı rengi
              ]}
            >
              {t("ok")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

// ================== Styles ==================
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: wp("80%"),
    padding: wp("6%"),
    borderRadius: 20,
    alignItems: "center",
    // iOS gölgesi:
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android gölgesi:
    elevation: 3,
  },
  successIconContainer: {
    width: wp("25%"),
    height: wp("25%"),
    borderRadius: wp("12.5%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  message: {
    fontSize: wp("4%"),
    textAlign: "center",
    marginBottom: hp("3%"),
  },
  button: {
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("10%"),
    borderRadius: 10,
  },
  buttonText: {
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});
