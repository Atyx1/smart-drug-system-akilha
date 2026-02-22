import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import StockProgress from "@/components/StockProgess";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCompartmentContext } from "@/context/CompartmentContext";
import type { CompartmentSummaryDto } from "@/types/Types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import moment from "moment";
import "moment/locale/tr";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SHADOWS } from "@/constant/theme";
import { useDevice } from "@/context/DeviceContext";
import { useAuth } from "@/context/AuthContext";
import { connectWebSocket } from "@/api/ConnectWebSocket";
import MedicineCalendar from "@/components/calendar/MedicineCalendar";

const DEFAULT_SLOTS = [1, 2, 3, 4];

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get("window");
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

// Define the navigation param list type
type RootStackParamList = {
  CompartmentUsage: { compartmentId: number };
  // Add other screens as needed
};

type DateFilterType = "today" | "week";
type MedicineDose = {
  name: string;
  dosage: string;
  time: string;
  iso: string;
  date: string;
  compartmentId: number;
  status:
    | "PENDING"
    | "DISPENSED_WAITING"
    | "TAKEN_ON_TIME"
    | "TAKEN_LATE"
    | "MISSED";
};

const HomeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, activeColorScheme } = useTheme();
  const { compartments, fetchCompartments } = useCompartmentContext();
  const [dateFilter, setDateFilter] = useState<DateFilterType>("today");
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [calendarCollapsed, setCalendarCollapsed] = useState<boolean>(false);
  const [medicineFilter, setMedicineFilter] = useState<
    "upcoming" | "drawer" | "taken"
  >("upcoming");
  const [showAllMedicines, setShowAllMedicines] = useState<boolean>(false);

  // Set Turkish locale for moment
  moment.locale("tr");

  useFocusEffect(
    useCallback(() => {
      try {
        fetchCompartments();
      } catch (error) {
        console.error("Error fetching compartments:", error);
      }
    }, [])
  );

  useEffect(() => {
    connectWebSocket();
  }, []);

  const navigateToCompartmentUsage = (compartmentId: number) => {
    navigation.navigate("CompartmentUsage", { compartmentId });
  };

  const now = moment();
  const today = now.format("YYYY-MM-DD");
  const weekAgo = moment().subtract(7, "days").startOf("day");

  const upcomingDoses: MedicineDose[] = []; // PENDING - sıradaki
  const drawerDoses: MedicineDose[] = []; // DISPENSED_WAITING - çekmecedeki
  const takenDoses: MedicineDose[] = []; // TAKEN_ON_TIME + TAKEN_LATE - alınanlar

  // Process all compartments - no date filter for comprehensive view
  if (compartments && Array.isArray(compartments)) {
    compartments.forEach((comp) => {
      comp.scheduleSummary?.forEach((schedule) => {
        const m = moment(schedule.scheduledAt, "YYYY-MM-DDTHH:mm").subtract(
          3,
          "hours"
        );

        const item: MedicineDose = {
          name: comp.medicineName || "İlaç",
          dosage: comp.medicineDosage || "",
          time: m.format("HH:mm"),
          iso: m.toISOString(),
          date: m.format("DD MMM"),
          compartmentId: comp.idx || 0,
          status: schedule.status,
        };

        // Classify based on status
        if (schedule.status === "PENDING") {
          upcomingDoses.push(item);
        } else if (schedule.status === "DISPENSED_WAITING") {
          drawerDoses.push(item);
        } else if (
          schedule.status === "TAKEN_ON_TIME" ||
          schedule.status === "TAKEN_LATE"
        ) {
          takenDoses.push(item);
        }
      });
    });
  }

  // Sort doses by time - upcoming by nearest time, others by recent time
  upcomingDoses.sort((a, b) => moment(a.iso).diff(moment(b.iso))); // En yakın önce
  drawerDoses.sort((a, b) => moment(a.iso).diff(moment(b.iso))); // En yakın önce
  takenDoses.sort((a, b) => moment(b.iso).diff(moment(a.iso))); // En yeni önce

  // Get current filtered doses based on selection
  const getCurrentDoses = () => {
    switch (medicineFilter) {
      case "upcoming":
        return upcomingDoses;
      case "drawer":
        return drawerDoses;
      case "taken":
        return takenDoses;
      default:
        return upcomingDoses;
    }
  };

  const currentDoses = getCurrentDoses();
  const displayedDoses = showAllMedicines
    ? currentDoses
    : currentDoses.slice(0, 2);

  // Check for today/tomorrow reminders
  const getTodayTomorrowReminder = () => {
    const today = moment();
    const tomorrow = moment().add(1, "day");

    const todayUpcoming = upcomingDoses.filter((dose) =>
      moment(dose.iso).isSame(today, "day")
    );

    const tomorrowUpcoming = upcomingDoses.filter((dose) =>
      moment(dose.iso).isSame(tomorrow, "day")
    );

    if (todayUpcoming.length > 0) {
      return {
        show: true,
        message: `Bugün ${todayUpcoming.length} ilaç almanız gerekiyor`,
        type: "today" as const,
        count: todayUpcoming.length,
      };
    } else if (tomorrowUpcoming.length > 0) {
      return {
        show: true,
        message: `Yarın ${tomorrowUpcoming.length} ilaç almanız gerekiyor`,
        type: "tomorrow" as const,
        count: tomorrowUpcoming.length,
      };
    }

    return { show: false };
  };

  const reminder = getTodayTomorrowReminder();

  // Shadow configuration based on the active theme
  const cardShadow =
    activeColorScheme === "light" ? SHADOWS.light.small : SHADOWS.dark.small;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Today/Tomorrow Reminder */}
        {reminder.show && (
          <View
            style={[
              styles.reminderCard,
              {
                backgroundColor:
                  reminder.type === "today"
                    ? `${colors.warning}15`
                    : `${colors.primary}15`,
                borderColor:
                  reminder.type === "today" ? colors.warning : colors.primary,
              },
            ]}
          >
            <Ionicons
              name={reminder.type === "today" ? "time" : "calendar"}
              size={wp(5)}
              color={
                reminder.type === "today" ? colors.warning : colors.primary
              }
            />
            <Text
              style={[
                styles.reminderText,
                {
                  color:
                    reminder.type === "today" ? colors.warning : colors.primary,
                },
              ]}
            >
              {reminder.message}
            </Text>
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={wp(4.5)}
              color={
                reminder.type === "today" ? colors.warning : colors.primary
              }
            />
          </View>
        )}

        {/* Medicine Calendar Section */}
        <View style={[styles.section, { marginTop: hp(3) }]}>
          <View style={styles.calendarIntro}>
            <Text
              style={[
                styles.calendarDescription,
                { color: colors.text.secondary },
              ]}
            >
              Gelecek aylardaki ilaç alım tarihlerinizi görüntülemek için
              tıklayın
            </Text>
          </View>
          <View style={styles.sectionHeaderRow}>
            <TouchableOpacity
              style={[
                styles.collapsibleHeader,
                { backgroundColor: `${colors.primary}08` },
              ]}
              onPress={() => setCalendarCollapsed(!calendarCollapsed)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.sectionHeader, { color: colors.text.primary }]}
              >
                <MaterialCommunityIcons
                  name="timeline-clock"
                  size={wp(4.5)}
                  color={colors.primary}
                  style={styles.transparentIcon}
                />{" "}
                İlaç Tarihleri & Program
              </Text>
              <MaterialCommunityIcons
                name={calendarCollapsed ? "chevron-down" : "chevron-up"}
                size={wp(5)}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.infoButton,
                { backgroundColor: `${colors.primary}15` },
              ]}
              onPress={() => setShowGuideModal(true)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={wp(4.5)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          {!calendarCollapsed && (
            <MedicineCalendar compartments={compartments} />
          )}
        </View>

        {/* Stock Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.text.primary }]}>
            <MaterialCommunityIcons
              name="chart-box"
              size={wp(4.5)}
              color={colors.primary}
              style={styles.transparentIcon}
            />
            <Text style={{ marginLeft: wp(1) }}>İlaç Stok Durumu</Text>
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.text.secondary }]}
          >
            Bölmelerdeki mevcut ilaç miktarlarını görüntüleyin
          </Text>
          <View style={styles.progressRow}>
            {DEFAULT_SLOTS.map((slotId) => {
              const comp =
                compartments && Array.isArray(compartments)
                  ? compartments.find((c) => c.idx === slotId)
                  : null;
              const percent = comp?.currentStock || 0;
              const medicineName = comp?.medicineName || `Bölme ${slotId}`;

              // Determine stock status and colors
              const getStockStatus = (stock: number) => {
                if (stock === 0)
                  return {
                    status: "empty",
                    color: colors.text.tertiary,
                    bgColor: `${colors.text.tertiary}15`,
                    icon: "package-variant-closed",
                    text: "Boş",
                  };
                if (stock === 1)
                  return {
                    status: "critical",
                    color: colors.error,
                    bgColor: `${colors.error}15`,
                    icon: "alert-circle-outline",
                    text: "Kritik",
                  };
                if (stock <= 3)
                  return {
                    status: "low",
                    color: colors.warning,
                    bgColor: `${colors.warning}15`,
                    icon: "alert",
                    text: "Düşük",
                  };
                if (stock <= 7)
                  return {
                    status: "medium",
                    color: "#FF8C00",
                    bgColor: "#FF8C0015",
                    icon: "arrow-down",
                    text: "Orta",
                  };
                return {
                  status: "good",
                  color: colors.success,
                  bgColor: `${colors.success}15`,
                  icon: "arrow-up",
                  text: "İyi",
                };
              };

              const stockInfo = getStockStatus(percent);

              return (
                <TouchableOpacity
                  key={slotId}
                  style={[
                    styles.modernStockCard,
                    {
                      backgroundColor: colors.card.background,
                      borderColor: stockInfo.color,
                    },
                    cardShadow,
                  ]}
                  onPress={() => navigateToCompartmentUsage(slotId)}
                  activeOpacity={0.7}
                >
                  {/* Status Badge */}
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: stockInfo.bgColor },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={stockInfo.icon as any}
                      size={wp(3.5)}
                      color={stockInfo.color}
                    />
                    <Text
                      style={[styles.statusText, { color: stockInfo.color }]}
                    >
                      {stockInfo.text}
                    </Text>
                  </View>

                  {/* Medicine Info */}
                  <View style={styles.medicineInfo}>
                    <MaterialCommunityIcons
                      name="pill"
                      size={wp(6)}
                      color={stockInfo.color}
                      style={styles.medicineIcon}
                    />
                    <View style={styles.medicineDetails}>
                      <Text
                        style={[
                          styles.medicineNameModern,
                          { color: colors.text.primary },
                        ]}
                        numberOfLines={2}
                      >
                        {medicineName}
                      </Text>
                      <Text
                        style={[
                          styles.compartmentLabel,
                          { color: colors.text.secondary },
                        ]}
                      >
                        Bölme {slotId}
                      </Text>
                    </View>
                  </View>

                  {/* Stock Display */}
                  <View style={styles.stockDisplay}>
                    <View style={styles.stockCountContainer}>
                      <Text
                        style={[styles.stockCount, { color: stockInfo.color }]}
                      >
                        {percent}
                      </Text>
                      <Text
                        style={[
                          styles.stockTotal,
                          { color: colors.text.tertiary },
                        ]}
                      >
                        /14
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    <View
                      style={[
                        styles.progressBarContainer,
                        { backgroundColor: colors.border.secondary },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.min((percent / 14) * 100, 100)}%`,
                            backgroundColor: stockInfo.color,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Arrow */}
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={wp(5)}
                    color={colors.text.tertiary}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Medicine Doses Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.text.primary }]}>
            <Ionicons
              name="medical"
              size={wp(4.5)}
              color={colors.primary}
              style={styles.transparentIcon}
            />{" "}
            İlaç Listesi
          </Text>

          {/* Filter Buttons */}
          <View style={styles.filterButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                medicineFilter === "upcoming" && styles.activeCategoryButton,
                { borderColor: colors.border.secondary },
                medicineFilter === "upcoming" && {
                  backgroundColor: `${colors.text.primary}10`,
                  borderColor: colors.text.primary,
                },
              ]}
              onPress={() => setMedicineFilter("upcoming")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={wp(4)}
                color={
                  medicineFilter === "upcoming"
                    ? colors.text.primary
                    : colors.text.tertiary
                }
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color:
                      medicineFilter === "upcoming"
                        ? colors.text.primary
                        : colors.text.tertiary,
                  },
                ]}
              >
                Sıradaki ({upcomingDoses.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                medicineFilter === "drawer" && styles.activeCategoryButton,
                { borderColor: colors.border.secondary },
                medicineFilter === "drawer" && {
                  backgroundColor: `${colors.text.primary}10`,
                  borderColor: colors.text.primary,
                },
              ]}
              onPress={() => setMedicineFilter("drawer")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="archive-outline"
                size={wp(4)}
                color={
                  medicineFilter === "drawer"
                    ? colors.text.primary
                    : colors.text.tertiary
                }
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color:
                      medicineFilter === "drawer"
                        ? colors.text.primary
                        : colors.text.tertiary,
                  },
                ]}
              >
                Çekmece ({drawerDoses.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                medicineFilter === "taken" && styles.activeCategoryButton,
                { borderColor: colors.border.secondary },
                medicineFilter === "taken" && {
                  backgroundColor: `${colors.text.primary}10`,
                  borderColor: colors.text.primary,
                },
              ]}
              onPress={() => setMedicineFilter("taken")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={wp(4)}
                color={
                  medicineFilter === "taken"
                    ? colors.text.primary
                    : colors.text.tertiary
                }
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  {
                    color:
                      medicineFilter === "taken"
                        ? colors.text.primary
                        : colors.text.tertiary,
                  },
                ]}
              >
                Alınan ({takenDoses.length})
              </Text>
            </TouchableOpacity>
          </View>
          {currentDoses.length > 0 ? (
            <>
              {displayedDoses.map((dose, index) => {
                // Status-based styling - more subtle colors
                const statusConfig = {
                  PENDING: {
                    icon: "clock-outline",
                    color: colors.text.secondary,
                    bgColor: `${colors.text.secondary}10`,
                  },
                  DISPENSED_WAITING: {
                    icon: "medical-bag",
                    color: colors.text.secondary,
                    bgColor: `${colors.text.secondary}10`,
                  },
                  MISSED: {
                    icon: "alert-circle-outline",
                    color: colors.error,
                    bgColor: `${colors.error}10`,
                  },
                  TAKEN_ON_TIME: {
                    icon: "checkmark-circle",
                    color: colors.text.secondary,
                    bgColor: `${colors.text.secondary}10`,
                  },
                  TAKEN_LATE: {
                    icon: "checkmark-circle-outline",
                    color: colors.text.secondary,
                    bgColor: `${colors.text.secondary}10`,
                  },
                };

                const config =
                  statusConfig[dose.status as keyof typeof statusConfig] ||
                  statusConfig.PENDING;

                return (
                  <View
                    key={index}
                    style={[
                      styles.card,
                      {
                        backgroundColor: colors.card.background,
                        borderBottomColor: colors.border.primary,
                      },
                      cardShadow,
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.cardLeft}>
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: config.bgColor },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={config.icon as any}
                            size={wp(5)}
                            color={config.color}
                            style={styles.transparentIcon}
                          />
                        </View>
                        <View style={styles.cardContent}>
                          <Text
                            style={[
                              styles.medName,
                              { color: colors.text.primary },
                            ]}
                          >
                            {dose.name}
                          </Text>
                          <Text
                            style={[
                              styles.dosage,
                              { color: colors.text.secondary },
                            ]}
                          >
                            {dose.dosage ? `${dose.dosage} mg` : ""}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardRight}>
                        <View
                          style={[
                            styles.timeContainer,
                            { backgroundColor: `${colors.text.secondary}10` },
                          ]}
                        >
                          <Ionicons
                            name="time"
                            size={wp(3.5)}
                            color={colors.text.secondary}
                            style={styles.transparentIcon}
                          />
                          <Text
                            style={[
                              styles.time,
                              { color: colors.text.secondary },
                            ]}
                          >
                            {dose.time}
                          </Text>
                        </View>
                        {dateFilter === "week" && (
                          <Text
                            style={[
                              styles.dateText,
                              { color: colors.text.tertiary },
                            ]}
                          >
                            {dose.date}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.compartmentIndicator}>
                      <View
                        style={[
                          styles.compartmentBadge,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Text style={styles.compartmentText}>
                          Bölme {dose.compartmentId}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Tümünü Görüntüle/Daha Az Göster Butonu */}
              {currentDoses.length > 2 && (
                <TouchableOpacity
                  style={[styles.expandButton, { borderColor: colors.primary }]}
                  onPress={() => setShowAllMedicines(!showAllMedicines)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.expandButtonText, { color: colors.primary }]}
                  >
                    {showAllMedicines
                      ? `Daha Az Göster`
                      : `Tümünü Görüntüle (+${currentDoses.length - 2})`}
                  </Text>
                  <Ionicons
                    name={showAllMedicines ? "chevron-up" : "chevron-down"}
                    size={wp(4)}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View
              style={[
                styles.emptyContainer,
                { borderColor: colors.border.primary },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={wp(8)}
                color={`${colors.text.tertiary}80`}
              />
              <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
                {medicineFilter === "upcoming" &&
                  "İçilmesi gereken ilaç bulunmamaktadır"}
                {medicineFilter === "drawer" &&
                  "Çekmecede bekleyen ilaç bulunmamaktadır"}
                {medicineFilter === "taken" && "Alınan ilaç bulunmamaktadır"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* İlaç Takvimi Rehberi Modal */}
      <Modal
        visible={showGuideModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuideModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.card.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                İlaç Takvimi Rehberi
              </Text>
              <TouchableOpacity
                onPress={() => setShowGuideModal(false)}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={wp(6)}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.guideItem}>
                <View
                  style={[
                    styles.guideIcon,
                    {
                      backgroundColor: "transparent",
                      borderWidth: 2,
                      borderColor: "#FFD700",
                    },
                  ]}
                >
                  <Text style={[styles.guideIconText, { color: "#FFD700" }]}>
                    3
                  </Text>
                </View>
                <View style={styles.guideText}>
                  <Text
                    style={[styles.guideTitle, { color: colors.text.primary }]}
                  >
                    Baloncuk Sayısı
                  </Text>
                  <Text
                    style={[
                      styles.guideDescription,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Her gün üzerindeki turuncu baloncuk, o gün alınması gereken
                    ilaç sayısını gösterir.
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View
                  style={[
                    styles.guideIcon,
                    {
                      backgroundColor: "transparent",
                      borderWidth: 2,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={wp(6)}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.guideText}>
                  <Text
                    style={[styles.guideTitle, { color: colors.text.primary }]}
                  >
                    Tarih Seçimi
                  </Text>
                  <Text
                    style={[
                      styles.guideDescription,
                      { color: colors.text.secondary },
                    ]}
                  >
                    İlaç olan günlere tıklayarak o günün detaylı ilaç programını
                    görüntüleyebilirsiniz.
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View
                  style={[
                    styles.guideIcon,
                    {
                      backgroundColor: "transparent",
                      borderWidth: 2,
                      borderColor: colors.text.tertiary,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="calendar-remove"
                    size={wp(6)}
                    color={colors.text.tertiary}
                  />
                </View>
                <View style={styles.guideText}>
                  <Text
                    style={[styles.guideTitle, { color: colors.text.primary }]}
                  >
                    Geçmiş Tarihler
                  </Text>
                  <Text
                    style={[
                      styles.guideDescription,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Bugünden önceki tarihler soluk gösterilir ve tıklanamaz.
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View
                  style={[
                    styles.guideIcon,
                    {
                      backgroundColor: "transparent",
                      borderWidth: 2,
                      borderColor: colors.success,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={wp(6)}
                    color={colors.success}
                  />
                </View>
                <View style={styles.guideText}>
                  <Text
                    style={[styles.guideTitle, { color: colors.text.primary }]}
                  >
                    İlaç Durumları
                  </Text>
                  <Text
                    style={[
                      styles.guideDescription,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Detay ekranında her ilacın durumunu (alındı, kaçırıldı,
                    bekliyor) görebilirsiniz.
                  </Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View
                  style={[
                    styles.guideIcon,
                    {
                      backgroundColor: "transparent",
                      borderWidth: 2,
                      borderColor: colors.warning,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="swap-horizontal"
                    size={wp(6)}
                    color={colors.warning}
                  />
                </View>
                <View style={styles.guideText}>
                  <Text
                    style={[styles.guideTitle, { color: colors.text.primary }]}
                  >
                    Aylar Arası Gezinme
                  </Text>
                  <Text
                    style={[
                      styles.guideDescription,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Takvimde sol/sağ okları kullanarak gelecek aylardaki ilaç
                    programınızı görüntüleyin.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowGuideModal(false)}
            >
              <Text style={styles.modalButtonText}>Anladım</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: wp(4),
    paddingBottom: wp(8),
    paddingTop: wp(2), // Reduced top spacing
  },
  header: {
    marginBottom: hp(2),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  title: {
    fontSize: wp(5),
    fontWeight: "700",
    marginLeft: wp(1),
  },
  dateFilterContainer: {
    flexDirection: "row",
    marginTop: hp(1),
  },
  filterButton: {
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(3),
    borderRadius: wp(4),
    borderWidth: 1,
    marginRight: wp(2),
  },
  activeFilterButton: {
    backgroundColor: "rgba(59, 103, 144, 0.1)",
  },
  filterText: {
    fontSize: wp(3.5),
    fontWeight: "500",
    color: "#666",
  },
  section: {
    marginBottom: hp(3),
  },
  sectionHeader: {
    fontSize: wp(4.2),
    fontWeight: "600",
    marginBottom: hp(0.5),
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: wp(3.2),
    fontStyle: "italic",
    marginBottom: hp(1.5),
    paddingLeft: wp(6),
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },
  infoButton: {
    padding: wp(2),
    borderRadius: wp(4),
    alignItems: "center",
    justifyContent: "center",
  },
  collapsibleHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    borderRadius: wp(2),
    minHeight: hp(5),
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
    borderBottomWidth: 1,
    flex: 1,
    marginHorizontal: wp(1),
    justifyContent: "center",
  },
  activeCategoryButton: {
    borderBottomWidth: 2,
  },
  categoryButtonText: {
    fontSize: wp(2.8),
    fontWeight: "600",
    marginLeft: wp(1),
  },
  calendarIntro: {
    marginBottom: hp(1.5),
    alignItems: "center",
  },
  calendarDescription: {
    fontSize: wp(3.5),
    textAlign: "center",
    fontStyle: "italic",
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.5),
    marginTop: hp(1),
    borderWidth: 1,
    borderRadius: wp(3),
    backgroundColor: "transparent",
  },
  expandButtonText: {
    fontSize: wp(3.8),
    fontWeight: "600",
    marginRight: wp(1),
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginBottom: hp(2),
    borderWidth: 1,
    borderRadius: wp(3),
    marginHorizontal: wp(4),
  },
  reminderText: {
    flex: 1,
    fontSize: wp(4),
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: wp(2),
  },
  transparentIcon: {
    opacity: 0.85,
  },
  progressRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  stockCard: {
    width: "48%",
    borderRadius: wp(3),
    padding: wp(3),
    marginBottom: hp(1.5),
    borderWidth: 1,
  },
  stockCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  modernStockCard: {
    width: "48%",
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 2,
    position: "relative",
  },
  statusBadge: {
    position: "absolute",
    top: wp(3),
    right: wp(3),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
  },
  statusText: {
    fontSize: wp(2.4),
    fontWeight: "600",
    marginLeft: wp(1),
  },
  medicineInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
    marginTop: hp(0.5),
  },
  medicineIcon: {
    marginRight: wp(3),
  },
  medicineDetails: {
    flex: 1,
  },
  medicineNameModern: {
    fontSize: wp(3.4),
    fontWeight: "700",
    lineHeight: wp(4.2),
  },
  compartmentLabel: {
    fontSize: wp(2.6),
    marginTop: hp(0.3),
    fontWeight: "500",
  },
  stockDisplay: {
    marginBottom: hp(1),
  },
  stockCountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: hp(0.8),
  },
  stockCount: {
    fontSize: wp(5.2),
    fontWeight: "800",
  },
  stockTotal: {
    fontSize: wp(3.4),
    fontWeight: "500",
  },
  progressBarContainer: {
    height: hp(0.8),
    borderRadius: hp(0.4),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: hp(0.4),
  },
  arrowIcon: {
    position: "absolute",
    bottom: wp(3),
    right: wp(3),
  },

  card: {
    borderRadius: wp(3),
    marginBottom: hp(1.2),
    paddingHorizontal: wp(3),
    paddingVertical: wp(3),
    borderBottomWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardContent: {
    marginLeft: wp(3),
    flex: 1,
  },
  iconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: "center",
    alignItems: "center",
  },
  cardRight: {
    alignItems: "flex-end",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
  },
  medName: {
    fontSize: wp(3.8),
    fontWeight: "600",
  },
  dosage: {
    fontSize: wp(3.3),
    marginTop: hp(0.3),
  },
  time: {
    fontSize: wp(3.2),
    fontWeight: "500",
    marginLeft: wp(1),
  },
  dateText: {
    fontSize: wp(3),
    marginTop: hp(0.5),
  },
  compartmentIndicator: {
    marginTop: hp(1),
    flexDirection: "row",
  },
  compartmentBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
  },
  compartmentText: {
    color: "#fff",
    fontSize: wp(2.8),
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(3),
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: wp(3),
  },
  emptyText: {
    marginTop: hp(1),
    fontSize: wp(3.5),
    fontWeight: "500",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(5),
  },
  modalContainer: {
    width: "100%",
    height: hp(70),
    borderRadius: wp(4),
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: wp(5.5),
    fontWeight: "700",
    flex: 1,
  },
  modalCloseButton: {
    padding: wp(1),
  },
  modalContent: {
    flex: 1,
    padding: wp(5),
  },
  guideItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(3),
  },
  guideIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },
  guideIconText: {
    color: "white",
    fontSize: wp(4.5),
    fontWeight: "700",
  },
  guideText: {
    flex: 1,
  },
  guideTitle: {
    fontSize: wp(4.2),
    fontWeight: "600",
    marginBottom: hp(0.5),
  },
  guideDescription: {
    fontSize: wp(3.8),
    lineHeight: wp(5.5),
  },
  modalButton: {
    margin: wp(5),
    padding: wp(4),
    borderRadius: wp(3),
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: wp(4.2),
    fontWeight: "600",
  },
});
