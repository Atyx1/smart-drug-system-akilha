import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "@/context/ThemeContext";
import { SHADOWS, SPACING, FONTS } from "@/constant/theme";

// Get screen dimensions for responsive design
const { width, height } = Dimensions.get("window");
const wp = (percentage: number): number => (width * percentage) / 100;
const hp = (percentage: number): number => (height * percentage) / 100;

// Define the navigation param list type
type RootStackParamList = {
  AddMedicine: { compartmentId: any } | undefined;
  // Add other screens as needed
};

import type { CompartmentSummaryDto } from "@/types/Types";

// Properly type the component props
type CompartmentDetailsProps = {
  compartment: CompartmentSummaryDto | null;
  onDelete: () => void;
};

const CompartmentDetails = ({
  compartment,
  onDelete,
}: CompartmentDetailsProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, activeColorScheme } = useTheme();
  const [showAllDates, setShowAllDates] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!compartment) return null;

  // En yakın içme zamanını hesapla
  const getNextDoseTime = () => {
    if (
      !compartment.scheduleSummary ||
      compartment.scheduleSummary.length === 0
    )
      return "-";

    const now = new Date();
    const futureDates = compartment.scheduleSummary
      .map((schedule) => new Date(schedule.scheduledAt))
      .filter((date) => date > now)
      .sort((a, b) => a.getTime() - b.getTime());

    if (futureDates.length === 0) return "-";

    const nextDose = futureDates[0];
    return nextDose.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = () => {
    // Tooltip göster
    setShowTooltip(true);
    // 3 saniye sonra tooltip'i gizle
    setTimeout(() => setShowTooltip(false), 3000);
    // Navigasyon
    navigation.navigate("AddMedicine", { compartmentId: compartment.idx });
  };

  const handleDelete = () => {
    Alert.alert(
      "İlaç Silme",
      "Bu ilaç planını silmek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            // Silme işlemi burada yapılacak
            onDelete();
          },
        },
      ]
    );
  };

  // Shadow style based on theme
  const shadowStyle =
    activeColorScheme === "light" ? SHADOWS.light.medium : SHADOWS.dark.medium;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card.background },
        shadowStyle,
      ]}
    >
      <View style={styles.headerSection}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="pill"
            size={wp(6)}
            color={colors.primary}
            style={styles.headerIcon}
          />
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Bölme Detayları
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.closeButton}>
          <Text style={{ fontSize: wp(6), color: colors.text.secondary }}>
            ×
          </Text>
        </TouchableOpacity>
      </View>

      {compartment.medicineName && (
        <View
          style={[
            styles.medicineNameContainer,
            { backgroundColor: colors.primary, opacity: 0.9 },
          ]}
        >
          <Text style={[styles.medicineName, { color: colors.text.inverse }]}>
            {compartment.medicineName}
          </Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name="medical-bag"
              size={wp(4)}
              color={colors.secondary}
              style={styles.labelIcon}
            />
            <Text
              style={[
                styles.label,
                { color: colors.text.secondary } as TextStyle,
              ]}
            >
              Dozaj
            </Text>
          </View>
          <Text style={[styles.value, { color: colors.text.primary }]}>
            {compartment.medicineDosage || "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name="pill"
              size={wp(4)}
              color={colors.secondary}
              style={styles.labelIcon}
            />
            <Text
              style={[
                styles.label,
                { color: colors.text.secondary } as TextStyle,
              ]}
            >
              Kalan Miktar
            </Text>
          </View>
          <Text style={[styles.value, { color: colors.text.primary }]}>
            {compartment.currentStock
              ? `${compartment.currentStock} adet`
              : "-"}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={wp(4)}
              color={colors.secondary}
              style={styles.labelIcon}
            />
            <Text
              style={[
                styles.label,
                { color: colors.text.secondary } as TextStyle,
              ]}
            >
              En Yakın Kullanım
            </Text>
          </View>
          <Text style={[styles.value, { color: colors.text.primary }]}>
            {getNextDoseTime()}
          </Text>
        </View>

        {/* Tüm tarihleri görebilmek için tıklanabilir detaylar bölümü */}
        {compartment.scheduleSummary &&
          compartment.scheduleSummary.length > 0 && (
            <TouchableOpacity
              style={[
                styles.detailsButton,
                { borderColor: colors.border.primary },
              ]}
              onPress={() => setShowAllDates(!showAllDates)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={wp(4.5)}
                  color={colors.primary}
                  style={{ marginRight: wp(2) }}
                />
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "600",
                    fontSize: wp(3.8),
                  }}
                >
                  {showAllDates
                    ? "Tarihleri Gizle"
                    : "Tüm Kullanım Tarihlerini Göster"}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={showAllDates ? "chevron-up" : "chevron-down"}
                size={wp(5)}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}

        {/* Eğer detaylar açıksa tüm tarihleri göster */}
        {showAllDates &&
          compartment.scheduleSummary &&
          compartment.scheduleSummary.length > 0 && (
            <View
              style={[
                styles.datesContainer,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                },
              ]}
            >
              {compartment.scheduleSummary.map((schedule, index) => {
                const date = new Date(schedule.scheduledAt);
                const formattedTime = date.toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const formattedDate = date.toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "2-digit",
                });
                const isToday =
                  new Date().toDateString() === date.toDateString();
                const isPast = date < new Date();

                return (
                  <View key={index} style={styles.dateItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={wp(4)}
                      color={isPast ? colors.text.secondary : colors.primary}
                      style={{ marginRight: wp(2) }}
                    />
                    <Text
                      style={[
                        styles.dateText,
                        {
                          color: isPast
                            ? colors.text.secondary
                            : colors.text.primary,
                          fontWeight: isToday ? "700" : "500",
                        },
                      ]}
                    >
                      {formattedDate} - {formattedTime}{" "}
                      {isToday ? "(Bugün)" : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
      </View>

      {/* Tooltip */}
      {showTooltip && (
        <View
          style={[
            styles.tooltip,
            { backgroundColor: colors.background.secondary },
          ]}
        >
          <Text style={[styles.tooltipText, { color: colors.text.primary }]}>
            Güncelleme işlemi oluşturduğunuz tarihleri değiştirecektir. Bölmeye
            koyduğunuz ilaçları da güncelleyin.
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FFBD24" } as ViewStyle]}
          onPress={handleUpdate}
        >
          <MaterialCommunityIcons name="pencil" color="#000" size={wp(4.5)} />
          <Text style={[styles.buttonText, { color: "#000" }]}>Güncelle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.error } as ViewStyle,
          ]}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons
            name="delete"
            color={colors.text.inverse}
            size={wp(4.5)}
          />
          <Text
            style={[
              styles.buttonText,
              { color: colors.text.inverse } as TextStyle,
            ]}
          >
            İlacı Sil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
    marginTop: hp(2),
    marginHorizontal: wp(4),
    borderRadius: wp(3),
  },
  medicineNameContainer: {
    marginTop: hp(1),
    marginBottom: hp(1.5),
    padding: wp(2),
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
  },
  medicineName: {
    fontSize: wp(4.5),
    fontWeight: "700",
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: hp(1.5),
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  headerIcon: {
    marginRight: wp(2),
    opacity: 0.9,
  },
  closeButton: {
    padding: wp(2),
  },
  title: {
    fontSize: wp(5),
    fontWeight: "700",
  },
  subtitleText: {
    fontSize: wp(4),
    fontWeight: "600",
    marginBottom: hp(1),
  },
  infoBox: {
    marginTop: hp(1.5),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
    paddingHorizontal: wp(1),
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelIcon: {
    marginRight: wp(1.5),
    opacity: 0.85,
  },
  label: {
    fontSize: wp(3.8),
    fontWeight: "500", // Medium font weight
  },
  value: {
    fontSize: wp(3.8),
    fontWeight: "600", // Semibold font weight
    maxWidth: "50%",
    textAlign: "right",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: wp(3),
    borderRadius: wp(2),
    borderWidth: 1,
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  datesContainer: {
    marginTop: hp(1),
    padding: wp(3),
    borderRadius: wp(2),
    borderWidth: 1,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.7),
  },
  dateText: {
    fontSize: wp(3.5),
  },
  tooltip: {
    padding: wp(3),
    borderRadius: wp(2),
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  tooltipText: {
    fontSize: wp(3.5),
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: hp(3),
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    flex: 1,
    marginHorizontal: wp(2),
  },
  buttonText: {
    fontWeight: "600", // Semibold font weight
    marginLeft: wp(2),
    fontSize: wp(3.8),
  },
});

export default CompartmentDetails;
