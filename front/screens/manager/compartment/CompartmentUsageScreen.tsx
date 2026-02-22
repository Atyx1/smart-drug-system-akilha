import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useCompartmentContext } from "@/context/CompartmentContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/tr"; // Türkçe dil desteği için
import { SHADOWS } from "@/constant/theme";
import type {
  CompartmentSummaryDto,
  PillInstanceSummaryDto,
} from "@/types/Types";

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get("window");
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

// Define the route params type
type CompartmentUsageParams = {
  compartmentId: number;
};

// Define medication usage record type
type UsageRecord = {
  date: string;
  time: string;
  status: "taken" | "missed" | "upcoming";
  formattedDate: string;
  isToday: boolean;
};

const CompartmentUsageScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { compartmentId } = route.params as CompartmentUsageParams;
  const { colors, activeColorScheme } = useTheme();
  const { compartments } = useCompartmentContext();
  const [loading, setLoading] = useState(true);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);

  // Find the compartment data
  const compartment = compartments.find((c) => c.idx === compartmentId);

  useEffect(() => {
    moment.locale("tr"); // Moment.js dilini Türkçe yap

    if (
      compartment?.scheduleSummary &&
      compartment.scheduleSummary.length > 0
    ) {
      const now = moment();

      const records: UsageRecord[] = compartment.scheduleSummary
        .slice() // Create a shallow copy to avoid mutating the original array
        .sort(
          (a, b) =>
            moment.utc(a.scheduledAt).valueOf() -
            moment.utc(b.scheduledAt).valueOf()
        )
        .map((schedule: PillInstanceSummaryDto) => {
          // Gelen saati, format belirterek LOKAL saat olarak parse et ve 3 saat çıkar
          const m = moment(schedule.scheduledAt, "YYYY-MM-DDTHH:mm").subtract(
            3,
            "hours"
          );

          // Map API status to UI status
          let status: "taken" | "missed" | "upcoming";
          if (
            schedule.status === "TAKEN_ON_TIME" ||
            schedule.status === "TAKEN_LATE"
          ) {
            status = "taken";
          } else if (schedule.status === "MISSED") {
            status = "missed";
          } else if (
            schedule.status === "PENDING" ||
            schedule.status === "DISPENSED_WAITING"
          ) {
            status = m.isAfter(now) ? "upcoming" : "missed";
          } else {
            status = "upcoming";
          }

          return {
            // Lokal moment'ı formatla
            date: m.format("YYYY-MM-DD"),
            time: m.format("HH:mm"),
            status,
            formattedDate: m.format("DD MMMM"),
            isToday: m.isSame(moment(), "day"),
          };
        });

      setUsageRecords(records);
    }
    setLoading(false);
  }, [compartment]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "taken":
        return colors.success;
      case "missed":
        return colors.error;
      case "upcoming":
        return colors.primary;
      default:
        return colors.text.tertiary;
    }
  };

  const getStatusText = (status: string, record?: UsageRecord) => {
    switch (status) {
      case "taken":
        return "İlaç Alındı";
      case "missed":
        return "Doz Kaçırıldı";
      case "upcoming":
        return record?.formattedDate || "Sıradaki Doz";
      default:
        return "-";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return "check-circle-outline";
      case "missed":
        return "close-circle-outline";
      case "upcoming":
        return "clock-time-nine-outline";
      default:
        return "help-circle-outline";
    }
  };

  // Calculate usage statistics
  const takenCount = usageRecords.filter((r) => r.status === "taken").length;
  const missedCount = usageRecords.filter((r) => r.status === "missed").length;
  const upcomingCount = usageRecords.filter(
    (r) => r.status === "upcoming"
  ).length;

  // Calculate adherence rate, handling edge cases to avoid NaN
  let adherenceRate = 0;
  if (takenCount > 0 || missedCount > 0) {
    adherenceRate = Math.round((takenCount / (takenCount + missedCount)) * 100);
  }

  // Group records by date for better display
  const groupedRecords = usageRecords.reduce((acc, record) => {
    const dateKey = moment(record.date).format("DD.MM.YYYY"); // e.g., "15.06.2025"
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(record);
    return acc;
  }, {} as Record<string, UsageRecord[]>);

  // Shadow configuration based on the active theme
  const cardShadow =
    activeColorScheme === "light" ? SHADOWS.light.small : SHADOWS.dark.small;

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.backButtonContainer,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            <Ionicons name="chevron-back" size={wp(5)} color={colors.primary} />
          </View>
        </TouchableOpacity>
        <MaterialCommunityIcons
          name="history"
          size={wp(7)}
          color={colors.text.primary}
        />
        <View style={{ width: wp(12) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* Compartment Info Card */}
            <View style={[styles.infoCard, cardShadow]}>
              {/* Header with Status */}
              <View style={styles.modernCardHeader}>
                <View style={styles.compartmentInfo}>
                  <MaterialCommunityIcons
                    name="pill"
                    size={wp(7)}
                    color={colors.primary}
                    style={styles.medicineIconLarge}
                  />
                  <View style={styles.headerText}>
                    <Text style={styles.compartmentTitle}>
                      Bölme {compartmentId}
                    </Text>
                    <View style={styles.statusIndicator}>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              (compartment?.currentStock || 0) > 0
                                ? colors.success
                                : colors.error,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              (compartment?.currentStock || 0) > 0
                                ? colors.success
                                : colors.error,
                          },
                        ]}
                      >
                        {(compartment?.currentStock || 0) > 0 ? "Aktif" : "Boş"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.modernCompartmentBadge,
                    {
                      backgroundColor: `${colors.primary}20`,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modernCompartmentBadgeText,
                      { color: colors.primary },
                    ]}
                  >
                    #{compartmentId}
                  </Text>
                </View>
              </View>

              {/* Medicine Details */}
              <View style={styles.medicineDetailsSection}>
                <Text style={styles.medicineNameModern} numberOfLines={2}>
                  {compartment?.medicineName || "Tanımlanmamış İlaç"}
                </Text>

                {compartment?.medicineDosage && (
                  <View style={styles.dosageContainer}>
                    <MaterialCommunityIcons
                      name="medical-bag"
                      size={wp(4)}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.dosageModern}>
                      {`${compartment.medicineDosage} mg Dozaj`}
                    </Text>
                  </View>
                )}
              </View>

              {/* Usage Statistics */}
              <View style={styles.statsContainer}>
                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: `${colors.success}15` },
                  ]}
                >
                  <Text style={[styles.statValue, { color: colors.success }]}>
                    {takenCount}
                  </Text>
                  <Text style={styles.statLabel}>Alındı</Text>
                </View>

                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: `${colors.error}15` },
                  ]}
                >
                  <Text style={[styles.statValue, { color: colors.error }]}>
                    {missedCount}
                  </Text>
                  <Text style={styles.statLabel}>Kaçırıldı</Text>
                </View>

                <View
                  style={[
                    styles.statCard,
                    { backgroundColor: `${colors.primary}15` },
                  ]}
                >
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {compartment?.currentStock || 0}
                  </Text>
                  <Text style={styles.statLabel}>Kalan Stok</Text>
                </View>
              </View>
            </View>

            {/* Adherence Rate */}
            {takenCount > 0 || missedCount > 0 ? (
              <View style={[styles.adherenceCard, cardShadow]}>
                <View style={styles.adherenceContent}>
                  <Text style={styles.adherenceLabel}>Uygunluk Oranı</Text>
                  <Text style={styles.adherenceValue}>{adherenceRate}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${adherenceRate}%`,
                        backgroundColor:
                          adherenceRate > 80
                            ? colors.success
                            : adherenceRate > 50
                            ? colors.warning
                            : colors.error,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : null}

            {/* Usage History Section */}
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Kullanım Geçmişi</Text>
              {Object.keys(groupedRecords).length > 0 ? (
                Object.entries(groupedRecords).map(([date, records]) => (
                  <View key={date} style={styles.dateGroup}>
                    <Text style={styles.dateHeader}>{date}</Text>
                    {records.map((record, index) => (
                      <View
                        key={index}
                        style={[
                          styles.recordCard,
                          { borderColor: getStatusColor(record.status) },
                          cardShadow,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={getStatusIcon(record.status)}
                          size={wp(6)}
                          color={getStatusColor(record.status)}
                          style={styles.recordIcon}
                        />
                        <View style={styles.recordDetails}>
                          <Text style={styles.recordStatusText}>
                            {getStatusText(record.status, record)}
                          </Text>
                          <Text style={styles.recordTimeText}>
                            Saat: {record.time}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))
              ) : (
                <View style={styles.centered}>
                  <Text style={styles.emptyText}>
                    Kullanım geçmişi bulunmuyor.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: wp(4),
      height: hp(8),
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    backButton: {
      // Styling for back button if needed
    },
    backButtonContainer: {
      padding: wp(2),
      borderRadius: wp(5),
    },
    headerTitle: {
      fontSize: wp(5),
      fontWeight: "600",
      flex: 1,
      textAlign: "center",
      color: colors.text.primary,
    },
    scrollContent: {
      paddingBottom: hp(4),
    },
    centered: {
      marginTop: hp(10),
      alignItems: "center",
      justifyContent: "center",
    },
    infoCard: {
      margin: wp(4),
      padding: wp(4),
      borderRadius: wp(4),
      borderWidth: 1,
      backgroundColor: colors.card.background,
      borderColor: colors.border.primary,
    },
    infoCardHeader: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginBottom: hp(1),
    },
    compartmentBadge: {
      backgroundColor: `${colors.primary}20`,
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.5),
      borderRadius: wp(3),
    },
    compartmentBadgeText: {
      color: colors.primary,
      fontWeight: "600",
    },
    medicineName: {
      fontSize: wp(6),
      fontWeight: "700",
      marginBottom: hp(0.5),
      color: colors.text.primary,
    },
    dosage: {
      fontSize: wp(4),
      marginBottom: hp(2.5),
      color: colors.text.secondary,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: hp(1.5),
    },
    infoLabel: {
      fontSize: wp(4),
      color: colors.text.secondary,
      fontWeight: "500",
    },
    infoValue: {
      fontSize: wp(4.2),
      color: colors.text.primary,
      fontWeight: "600",
      flex: 1,
      textAlign: "right",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: hp(1),
      marginTop: hp(1),
    },
    statCard: {
      alignItems: "center",
      padding: wp(3),
      borderRadius: wp(3),
      width: wp(22),
    },
    statValue: {
      fontSize: wp(5),
      fontWeight: "700",
    },
    statLabel: {
      fontSize: wp(3.2),
      marginTop: hp(0.5),
      color: colors.text.secondary,
      fontWeight: "500",
    },
    adherenceCard: {
      marginHorizontal: wp(4),
      padding: wp(4),
      borderRadius: wp(4),
      backgroundColor: colors.card.background,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    adherenceContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: hp(1.5),
    },
    adherenceLabel: {
      fontSize: wp(4.2),
      fontWeight: "600",
      color: colors.text.primary,
    },
    adherenceValue: {
      fontSize: wp(5),
      fontWeight: "700",
      color: colors.text.primary,
    },
    progressBarBackground: {
      height: hp(1),
      backgroundColor: colors.border.secondary,
      borderRadius: hp(0.5),
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: hp(0.5),
    },
    historySection: {
      paddingHorizontal: wp(4),
      marginTop: hp(2),
    },
    sectionTitle: {
      fontSize: wp(5),
      fontWeight: "600",
      marginBottom: hp(2),
      color: colors.text.primary,
    },
    dateGroup: {
      marginBottom: hp(2),
    },
    dateHeader: {
      fontSize: wp(4),
      fontWeight: "500",
      color: colors.text.secondary,
      marginBottom: hp(1),
      marginLeft: wp(2),
    },
    recordCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp(4),
      borderRadius: wp(3),
      borderLeftWidth: 5,
      marginBottom: hp(1),
      backgroundColor: colors.card.background,
    },
    recordIcon: {
      marginRight: wp(4),
    },
    recordDetails: {
      flex: 1,
    },
    recordStatusText: {
      fontSize: wp(4.2),
      fontWeight: "600",
      color: colors.text.primary,
    },
    recordTimeText: {
      fontSize: wp(3.8),
      color: colors.text.secondary,
      marginTop: hp(0.5),
    },
    emptyText: {
      fontSize: wp(4),
      color: colors.text.secondary,
    },
    // Modern Card Styles
    modernCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: hp(2),
    },
    compartmentInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    medicineIconLarge: {
      marginRight: wp(3),
    },
    headerText: {
      flex: 1,
    },
    compartmentTitle: {
      fontSize: wp(4.5),
      fontWeight: "600",
      color: colors.text.primary,
      marginBottom: hp(0.5),
    },
    statusIndicator: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusDot: {
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: wp(1.25),
      marginRight: wp(1.5),
    },
    statusText: {
      fontSize: wp(3.2),
      fontWeight: "500",
    },
    modernCompartmentBadge: {
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.8),
      borderRadius: wp(6),
      borderWidth: 1.5,
      minWidth: wp(12),
      alignItems: "center",
    },
    modernCompartmentBadgeText: {
      fontSize: wp(4),
      fontWeight: "700",
    },
    medicineDetailsSection: {
      marginBottom: hp(2),
    },
    medicineNameModern: {
      fontSize: wp(5.5),
      fontWeight: "700",
      lineHeight: wp(6.5),
      color: colors.text.primary,
      marginBottom: hp(1),
    },
    dosageContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    dosageModern: {
      fontSize: wp(3.8),
      color: colors.text.secondary,
      marginLeft: wp(2),
      fontWeight: "500",
    },
  });

export default CompartmentUsageScreen;
