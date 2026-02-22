import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Modal,
} from "react-native";
import { useTranslation } from "@/localization/i18n";
import { useLogging } from "@/context/LoggingContext";
import { ActivityLogResponse } from "@/types/Types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { format, subDays, addDays } from "date-fns";
import { tr } from "date-fns/locale";
import { lightColors as colors } from "@/constant/theme";
import DateRangeDropdown from "@/components/DateDropDown";

// Log tipine göre stil belirleme
const getLogTypeStyle = (actionType: string) => {
  if (actionType?.includes("DEVICE")) {
    return { color: colors.primary, icon: "devices" };
  } else if (
    actionType?.includes("PILL") ||
    actionType?.includes("COMPARTMENT") ||
    actionType?.includes("MEDICINE")
  ) {
    return { color: colors.success, icon: "pill" };
  } else if (actionType?.includes("NOTIFICATION")) {
    return { color: colors.warning, icon: "bell" };
  } else if (actionType?.includes("USER")) {
    return { color: "#3498db", icon: "account" };
  } else if (actionType?.includes("ERROR") || actionType?.includes("FAILED")) {
    return { color: colors.error, icon: "alert-circle" };
  } else if (
    actionType?.includes("SYSTEM") ||
    actionType?.includes("API") ||
    actionType?.includes("DATABASE")
  ) {
    return { color: colors.text.secondary, icon: "cog" };
  } else {
    return { color: colors.text.secondary, icon: "information" };
  }
};

// Kategori filtre komponenti
const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  const categories = [
    { key: "ALL", label: "Tümü", icon: "format-list-bulleted" },
    { key: "DEVICE", label: "Cihaz", icon: "devices" },
    { key: "PILL", label: "İlaç", icon: "pill" },
    { key: "NOTIFICATION", label: "Bildirim", icon: "bell" },
  ];

  return (
    <View style={styles.categoryFilterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive,
            ]}
            onPress={() => onCategoryChange(category.key)}
          >
            <MaterialCommunityIcons
              name={category.icon as any}
              size={16}
              color={
                selectedCategory === category.key
                  ? "white"
                  : colors.text.secondary
              }
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.key &&
                  styles.categoryChipTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Log detay modalı
const LogDetailsModal = ({
  log,
  onClose,
}: {
  log: ActivityLogResponse | null;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { formatTimestamp } = useLogging();

  if (!log) return null;

  const typeStyle = getLogTypeStyle(log.actionType || "");

  const getSuccessStatus = () => {
    if (!log.details) return null;
    try {
      const detailsObj =
        typeof log.details === "string" ? JSON.parse(log.details) : log.details;
      return detailsObj.success !== undefined ? detailsObj.success : null;
    } catch (err) {
      return null;
    }
  };

  const successStatus = getSuccessStatus();

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.modalTitle}>{t("log_details")}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.logDetailCard}>
              <View
                style={[
                  styles.logTypeIndicator,
                  { backgroundColor: typeStyle.color },
                ]}
              >
                <MaterialCommunityIcons
                  name={typeStyle.icon as any}
                  size={24}
                  color="white"
                />
              </View>
              <View style={styles.logDetailContent}>
                <Text style={styles.logDetailType}>
                  {log.actionTypeDescription || log.actionType}
                </Text>
                <Text style={styles.logDetailDescription}>
                  {log.description}
                </Text>
                <Text style={styles.logDetailTime}>
                  {formatTimestamp(log.timestamp)}
                </Text>
                <Text style={styles.logDetailUser}>
                  Kullanıcı: {log.username || "SYSTEM"}
                </Text>
                {successStatus !== null && (
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: successStatus
                          ? colors.success
                          : colors.error,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={successStatus ? "check" : "close"}
                      size={16}
                      color="white"
                    />
                    <Text style={styles.statusText}>
                      {successStatus ? "Başarılı" : "Başarısız"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Log listesi komponenti
const LogListItem = ({
  log,
  onPress,
}: {
  log: ActivityLogResponse;
  onPress: (log: ActivityLogResponse) => void;
}) => {
  const { formatTimestamp } = useLogging();
  const typeStyle = getLogTypeStyle(log.actionType || "");

  return (
    <TouchableOpacity style={styles.logItem} onPress={() => onPress(log)}>
      <View
        style={[
          styles.logIconContainer,
          { backgroundColor: `${typeStyle.color}20` },
        ]}
      >
        <MaterialCommunityIcons
          name={typeStyle.icon as any}
          size={20}
          color={typeStyle.color}
        />
      </View>
      <View style={styles.logContent}>
        <Text style={styles.logTitle} numberOfLines={2}>
          {log.actionTypeDescription || log.actionType}
        </Text>
        <Text style={styles.logDescription} numberOfLines={2}>
          {log.description}
        </Text>
        <View style={styles.logMeta}>
          <Text style={styles.logTime}>{formatTimestamp(log.timestamp)}</Text>
          <Text style={styles.logUser}>{log.username || "SYSTEM"}</Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={colors.text.secondary}
      />
    </TouchableOpacity>
  );
};

// Tab komponenti
const LogTab = ({
  logs,
  loading,
  onRefresh,
  emptyIcon,
  emptyText,
  loadingText,
}: {
  logs: ActivityLogResponse[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  emptyIcon: string;
  emptyText: string;
  loadingText: string;
}) => {
  const [selectedLog, setSelectedLog] = useState<ActivityLogResponse | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  const renderLogItem = ({ item }: { item: ActivityLogResponse }) => (
    <LogListItem log={item} onPress={setSelectedLog} />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.logList}
        contentContainerStyle={styles.logListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name={emptyIcon as any}
              size={64}
              color={colors.text.secondary}
            />
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        }
      />
      <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </View>
  );
};

// Ana ekran
const ActivityLogsScreen = () => {
  const { t } = useTranslation();
  const {
    selectedDate,
    setSelectedDate,
    logs,
    deviceLogs,
    pillLogs,
    notificationLogs,
    dateRangeLogs,
    loading,
    getDailyLogs,
    getDeviceActivities,
    getPillActivities,
    getNotificationActivities,
    getLogsForDateRange,
    refreshCurrentData,
  } = useLogging();

  const [isDateRangeMode, setIsDateRangeMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("ALL");
  const [rangeStartDate, setRangeStartDate] = useState<Date>(new Date());
  const [rangeEndDate, setRangeEndDate] = useState<Date>(new Date());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!isDateRangeMode) {
      refreshCurrentData();
    }
  }, [selectedDate, isDateRangeMode]);

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleDateRangeChange = async (dates: {
    startDate: Date;
    endDate: Date;
  }) => {
    setRangeStartDate(dates.startDate);
    setRangeEndDate(dates.endDate);
    setIsDateRangeMode(true);
    setCurrentCategory("ALL");

    // API parametrelerine uygun format - optional category parametresi
    const categoryParam =
      currentCategory === "ALL" ? undefined : currentCategory;
    await getLogsForDateRange(dates.startDate, dates.endDate, categoryParam);
  };

  const handleCategoryChange = async (category: string) => {
    setCurrentCategory(category);

    if (isDateRangeMode) {
      // Tarih aralığı modunda kategori değişince API'yi tekrar çağır
      const categoryParam = category === "ALL" ? undefined : category;
      await getLogsForDateRange(rangeStartDate, rangeEndDate, categoryParam);
    } else {
      // Günlük modda da ilgili kategori loglarını çek
      switch (category) {
        case "DEVICE":
          await getDeviceActivities(selectedDate);
          break;
        case "PILL":
          await getPillActivities(selectedDate);
          break;
        case "NOTIFICATION":
          await getNotificationActivities(selectedDate);
          break;
        default:
          await getDailyLogs(selectedDate);
          break;
      }
    }
  };

  const handleBackToDaily = () => {
    setIsDateRangeMode(false);
    setCurrentCategory("ALL");
    refreshCurrentData();
  };

  // Filtrelenmiş logları getir
  const getFilteredLogs = () => {
    if (isDateRangeMode) {
      return dateRangeLogs;
    }

    switch (currentCategory) {
      case "DEVICE":
        return deviceLogs;
      case "PILL":
        return pillLogs;
      case "NOTIFICATION":
        return notificationLogs;
      default:
        return logs;
    }
  };

  // Refresh fonksiyonunu getir
  const getRefreshFunction = () => {
    if (isDateRangeMode) {
      return () => handleCategoryChange(currentCategory);
    }

    switch (currentCategory) {
      case "DEVICE":
        return () => getDeviceActivities(selectedDate);
      case "PILL":
        return () => getPillActivities(selectedDate);
      case "NOTIFICATION":
        return () => getNotificationActivities(selectedDate);
      default:
        return () => getDailyLogs(selectedDate);
    }
  };

  // Empty icon'u getir
  const getEmptyIcon = () => {
    switch (currentCategory) {
      case "DEVICE":
        return "devices";
      case "PILL":
        return "pill";
      case "NOTIFICATION":
        return "bell";
      default:
        return "file-document-outline";
    }
  };

  // Empty text'i getir
  const getEmptyText = () => {
    if (isDateRangeMode) {
      return "Seçilen tarih aralığında log bulunamadı";
    }

    switch (currentCategory) {
      case "DEVICE":
        return "Bu tarihte cihaz aktivitesi bulunamadı";
      case "PILL":
        return "Bu tarihte ilaç aktivitesi bulunamadı";
      case "NOTIFICATION":
        return "Bu tarihte bildirim aktivitesi bulunamadı";
      default:
        return "Bu tarihte log bulunamadı";
    }
  };

  // Loading text'i getir
  const getLoadingText = () => {
    switch (currentCategory) {
      case "DEVICE":
        return "Cihaz logları yükleniyor...";
      case "PILL":
        return "İlaç logları yükleniyor...";
      case "NOTIFICATION":
        return "Bildirim logları yükleniyor...";
      default:
        return "Loglar yükleniyor...";
    }
  };

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <View style={styles.container}>
      {/* Tarih seçici header */}
      <View style={styles.dateHeader}>
        {!isDateRangeMode ? (
          <>
            <TouchableOpacity
              onPress={handlePreviousDay}
              style={styles.dateButton}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>

            <View style={styles.dateInfo}>
              <Text style={styles.dateText}>
                {format(selectedDate, "dd MMMM yyyy", { locale: tr })}
              </Text>
              {isToday && <Text style={styles.todayBadge}>Bugün</Text>}
            </View>

            <TouchableOpacity
              onPress={handleNextDay}
              style={[styles.dateButton, isToday && styles.dateButtonDisabled]}
              disabled={isToday}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={isToday ? colors.text.secondary : colors.primary}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleBackToDaily}
              style={styles.dateButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>

            <View style={styles.dateInfo}>
              <Text style={styles.dateText}>
                {format(rangeStartDate, "dd/MM", { locale: tr })} -{" "}
                {format(rangeEndDate, "dd/MM", { locale: tr })}
              </Text>
              <Text style={styles.todayBadge}>Tarih Aralığı</Text>
            </View>

            <View style={styles.emptySpace} />
          </>
        )}

        {/* DateRangeDropdown ve Tooltip her iki modda da görünür */}
        <View style={styles.dateRangeSection}>
          <DateRangeDropdown
            startDate={rangeStartDate}
            endDate={rangeEndDate}
            onChange={handleDateRangeChange}
            style={styles.dateRangeContainer}
          />
          <TouchableOpacity
            onPress={() => setShowTooltip(!showTooltip)}
            style={styles.tooltipButton}
          >
            <MaterialCommunityIcons
              name="help-circle"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Kategori filtreleri - her zaman görünür */}
      <CategoryFilter
        selectedCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Tooltip */}
      {showTooltip && (
        <View style={styles.tooltipContainer}>
          <Text style={styles.tooltipText}>
            Takvim ikonuna basarak istediğin tarih aralığını seçebilir ve o
            dönemdeki aktivite loglarını görüntüleyebilirsin
          </Text>
          <TouchableOpacity
            onPress={() => setShowTooltip(false)}
            style={styles.tooltipClose}
          >
            <MaterialCommunityIcons name="close" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Log görünümü - kategori filtresine göre */}
      <LogTab
        logs={getFilteredLogs()}
        loading={loading}
        onRefresh={getRefreshFunction()}
        emptyIcon={getEmptyIcon()}
        emptyText={getEmptyText()}
        loadingText={getLoadingText()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dateButton: {
    padding: wp("2.5%"),
    borderRadius: wp("3%"),
    backgroundColor: `${colors.primary}15`,
  },
  dateButtonDisabled: {
    backgroundColor: "#F0F0F0",
  },
  dateInfo: {
    alignItems: "center",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("3%"),
    borderRadius: wp("2%"),
  },
  calendarIcon: {
    marginTop: hp("0.5%"),
  },
  dateText: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: colors.text.primary,
  },
  todayBadge: {
    fontSize: wp("3%"),
    color: colors.primary,
    marginTop: hp("0.5%"),
    fontWeight: "500",
  },
  categoryFilterContainer: {
    backgroundColor: "white",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: wp("6%"),
    backgroundColor: "#F5F5F5",
    marginRight: wp("2%"),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    marginLeft: wp("1.5%"),
    fontSize: wp("3.5%"),
    color: colors.text.secondary,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "white",
  },
  dateRangeWrapper: {
    backgroundColor: "white",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  dateRangeSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  tooltipButton: {
    marginLeft: wp("2%"),
    padding: wp("2%"),
    backgroundColor: `${colors.primary}15`,
    borderRadius: wp("5%"),
    opacity: 0.8,
  },
  dateRangeContainer: {
    transform: [{ scale: 0.7 }],
    opacity: 0.8,
  },

  tabContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  logList: {
    flex: 1,
  },
  logListContent: {
    padding: wp("4%"),
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: wp("4%"),
    marginBottom: hp("1.5%"),
    borderRadius: wp("4%"),
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  logIconContainer: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("8%"),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: hp("0.5%"),
  },
  logDescription: {
    fontSize: wp("3.5%"),
    color: colors.text.secondary,
    marginBottom: hp("1%"),
  },
  logMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logTime: {
    fontSize: wp("3%"),
    color: colors.text.secondary,
  },
  logUser: {
    fontSize: wp("3%"),
    color: colors.primary,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: wp("8%"),
  },
  loadingText: {
    marginTop: hp("2%"),
    fontSize: wp("4%"),
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: wp("8%"),
    marginTop: hp("10%"),
  },
  emptyText: {
    marginTop: hp("2%"),
    fontSize: wp("4%"),
    color: colors.text.secondary,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: wp("90%"),
    maxHeight: hp("80%"),
    backgroundColor: "white",
    borderRadius: wp("4%"),
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: wp("4%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: colors.text.primary,
    marginLeft: wp("2%"),
  },
  closeButton: {
    padding: wp("1%"),
  },
  modalBody: {
    padding: wp("4%"),
  },
  logDetailCard: {
    flexDirection: "row",
    backgroundColor: `${colors.primary}05`,
    borderRadius: wp("3%"),
    padding: wp("4%"),
    marginBottom: hp("2%"),
  },
  logTypeIndicator: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  logDetailContent: {
    flex: 1,
  },
  logDetailType: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: hp("0.5%"),
  },
  logDetailDescription: {
    fontSize: wp("3.5%"),
    color: colors.text.secondary,
    marginBottom: hp("1%"),
  },
  logDetailTime: {
    fontSize: wp("3%"),
    color: colors.text.secondary,
    marginBottom: hp("0.5%"),
  },
  logDetailUser: {
    fontSize: wp("3%"),
    color: colors.primary,
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("4%"),
    marginTop: hp("1%"),
  },
  statusText: {
    color: "white",
    fontSize: wp("3%"),
    fontWeight: "500",
    marginLeft: wp("1%"),
  },
  tooltipContainer: {
    backgroundColor: "white",
    margin: wp("3%"),
    padding: wp("4%"),
    borderRadius: wp("4%"),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "flex-start",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tooltipText: {
    flex: 1,
    fontSize: wp("4%"),
    color: colors.text.primary,
    lineHeight: wp("6%"),
    fontWeight: "400",
  },
  tooltipClose: {
    padding: wp("1%"),
    marginLeft: wp("2%"),
  },
  emptySpace: {
    width: wp("4%"),
  },
});

export default ActivityLogsScreen;
