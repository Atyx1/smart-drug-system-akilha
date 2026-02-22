import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useCompartmentContext } from "@/context/CompartmentContext";
import type { CompartmentSummaryDto } from "@/types/Types";
import { useTheme } from "@/context/ThemeContext";

import { connectWebSocket } from "@/api/ConnectWebSocket";

import ErrorModal from "@/components/alNoMessages/ErrorModal";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import "moment/locale/tr";
import { Video, ResizeMode } from "expo-av";
// import ScheduleDetailModal from "@/components/compartment/ScheduleDetailModal";

const MAX_CAPACITY = 14;

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  android: {
    elevation: 6,
  },
});

// Default compartment structure for initial rendering if data isn't loaded yet
const DEFAULT_COMPARTMENTS: CompartmentSummaryDto[] = [
  {
    compartmentId: 1,
    idx: 1,
    medicineName: "",
    medicineDosage: "",
    currentStock: 0,
    scheduleSummary: [],
  },
  {
    compartmentId: 2,
    idx: 2,
    medicineName: "",
    medicineDosage: "",
    currentStock: 0,
    scheduleSummary: [],
  },
  {
    compartmentId: 3,
    idx: 3,
    medicineName: "",
    medicineDosage: "",
    currentStock: 0,
    scheduleSummary: [],
  },
  {
    compartmentId: 4,
    idx: 4,
    medicineName: "",
    medicineDosage: "",
    currentStock: 0,
    scheduleSummary: [],
  },
];

const CompartmentScreen = () => {
  moment.locale("tr");
  const navigation = useNavigation<any>();
  const {
    compartments: fetchedCompartments,
    fetchCompartments,
    deleteCompartment,
    deviceId,
  } = useCompartmentContext();

  const { colors, activeColorScheme } = useTheme();
  const isDark = activeColorScheme === "dark";
  // Active tab state (0-3 for compartments)
  const [activeTab, setActiveTab] = useState<number | null>(null);
  // Loading state for compartment deletion
  const [deletingCompartmentId, setDeletingCompartmentId] = useState<
    number | null
  >(null);
  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // Schedule modal state
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [schedulesForModal, setSchedulesForModal] = useState<
    CompartmentSummaryDto["scheduleSummary"]
  >([]);
  // Help modal state
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);

  useEffect(() => {
    connectWebSocket();
  }, []);
  // Only fetch data once when component mounts
  useEffect(() => {
    fetchCompartments();
  }, []);

  // Ekran her açıldığında hiçbir tab açık olmasın
  useFocusEffect(
    React.useCallback(() => {
      setActiveTab(0);
    }, [])
  );

  // Create a fixed array of 4 compartments using API data where available
  const compartments = useMemo(() => {
    console.log("🔍 Fetched Compartments:", fetchedCompartments);
    // Create a fixed array of 4 compartments
    const fixedCompartments = [...DEFAULT_COMPARTMENTS];

    // If we have fetched compartments, update the corresponding slots
    if (fetchedCompartments && fetchedCompartments.length > 0) {
      fetchedCompartments.forEach((comp) => {
        console.log("🔍 Processing compartment:", comp);
        if (comp.idx && comp.idx >= 1 && comp.idx <= 4) {
          // Ensure we keep the original compartmentId but update other properties
          fixedCompartments[comp.idx - 1] = {
            ...fixedCompartments[comp.idx - 1],
            ...comp,
          };
          console.log(
            "🔍 Merged compartment:",
            fixedCompartments[comp.idx - 1]
          );
        }
      });
    }

    console.log("🔍 Final compartments array:", fixedCompartments);
    return fixedCompartments;
  }, [fetchedCompartments]);

  // Handle tab selection
  const handleTabSelect = (index: number) => {
    setActiveTab(index);
  };

  // Navigate to add medicine screen with compartment ID
  const handleAddMedicine = (compartment: CompartmentSummaryDto) => {
    console.log("Adding/editing medicine for compartment:", compartment);

    // Ensure idx is a number between 1-4
    const idx = compartment.idx || 0;
    if (idx < 1 || idx > 4) {
      console.warn(`Invalid compartment idx: ${idx}, should be between 1-4`);
    }

    navigation.navigate("AddMedicine", {
      compartmentId: idx, // Use idx (1-4) not compartmentId
      deviceId: deviceId,
      isUpdate: !!compartment.medicineName,
      existingData: {
        name: compartment.medicineName,
        dosage: compartment.medicineDosage,
        quantity: compartment.currentStock,
      },
    });
  };

  // Handle schedule modal
  const handleOpenScheduleModal = (
    schedules: CompartmentSummaryDto["scheduleSummary"]
  ) => {
    setSchedulesForModal(schedules);
    setScheduleModalVisible(true);
  };

  const handleCloseScheduleModal = () => {
    setScheduleModalVisible(false);
    setSchedulesForModal([]);
  };

  // Handle help modal
  const handleOpenHelpModal = () => {
    setHelpModalVisible(true);
  };

  const handleCloseHelpModal = () => {
    setHelpModalVisible(false);
  };

  // Calculate fill percentage for visualization
  const calculateFillPercentage = (currentStock?: number) => {
    if (currentStock === undefined || currentStock === null) return 0;
    return Math.min(100, (currentStock / MAX_CAPACITY) * 100);
  };

  // Get compartment status text based on fill level
  const getCompartmentStatus = (currentStock?: number) => {
    if (currentStock === undefined || currentStock === null) return "Boş";

    const percentage = calculateFillPercentage(currentStock);

    if (percentage === 0) return "Boş";
    if (percentage < 25) return "Az";
    if (percentage < 75) return "Orta";
    return "Dolu";
  };

  // Get status color based on fill level
  const getStatusColor = (currentStock?: number) => {
    if (currentStock === undefined || currentStock === null)
      return colors.secondary || colors.text.secondary;

    const percentage = calculateFillPercentage(currentStock);

    if (percentage === 0) return colors.text.secondary;
    if (percentage < 25) return colors.error;
    if (percentage < 75) return colors.warning;
    return colors.success;
  };

  // Render tab component
  const renderTabs = () => {
    return (
      <View style={styles.horizontalTabContainer}>
        {compartments.map((item, index) => {
          const isFull = !!item.medicineName;
          const statusColor = getStatusColor(item.currentStock);

          return (
            <TouchableOpacity
              key={`tab-${index}`}
              style={[
                styles.horizontalTabButton,
                activeTab === index && styles.activeHorizontalTab,
                {
                  backgroundColor:
                    activeTab === index
                      ? colors.primary
                      : colors.card.background,
                  borderColor:
                    activeTab === index
                      ? colors.primary
                      : colors.border.primary,
                },
              ]}
              onPress={() => handleTabSelect(index)}
            >
              <View style={styles.horizontalTabContent}>
                <MaterialCommunityIcons
                  name={isFull ? "pill" : "package-variant-closed"}
                  size={wp(6)}
                  color={
                    activeTab === index
                      ? "#fff"
                      : isFull
                      ? statusColor
                      : colors.text.tertiary
                  }
                />
                {isFull && activeTab !== index && (
                  <View
                    style={[
                      styles.smallStatusIndicator,
                      { backgroundColor: statusColor },
                    ]}
                  />
                )}
              </View>

              <Text
                style={[
                  styles.horizontalTabText,
                  {
                    color: activeTab === index ? "#fff" : colors.text.primary,
                    fontWeight: activeTab === index ? "700" : "600",
                  },
                ]}
              >
                {index + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Render active compartment details
  const renderActiveCompartment = () => {
    if (activeTab === null) return null;
    const compartment = compartments[activeTab];
    if (!compartment) return null;

    // Debug logging
    console.log("🔍 Active Compartment:", compartment);
    console.log("🔍 Schedule Summary:", compartment.scheduleSummary);
    console.log(
      "🔍 Schedule Summary Length:",
      compartment.scheduleSummary?.length
    );

    const isFull = !!compartment.medicineName;
    const fillPercentage = calculateFillPercentage(compartment.currentStock);
    const statusText = getCompartmentStatus(compartment.currentStock);
    const statusColor = getStatusColor(compartment.currentStock);

    return (
      <View style={styles.activeCompartmentContainer}>
        <View
          style={[
            styles.activeCompartmentCard,
            {
              borderColor: isFull ? colors.primary : colors.border.primary,
              backgroundColor: colors.card.background,
              ...shadowStyle,
            },
          ]}
        >
          {!isFull ? (
            <View style={styles.modernEmptyContainer}>
              <View
                style={[
                  styles.modernEmptyIconContainer,
                  { backgroundColor: `${colors.primary}10` },
                ]}
              >
                <MaterialCommunityIcons
                  name="package-variant"
                  size={wp("12%")}
                  color={colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.modernEmptyTitle,
                  { color: colors.text.primary },
                ]}
              >
                Bölme {compartment.idx} Boş
              </Text>
              <Text
                style={[
                  styles.modernEmptyText,
                  { color: colors.text.secondary },
                ]}
              >
                Bu bölmeye yeni bir ilaç ekleyerek tedavi programınızı başlatın
              </Text>

              <View style={styles.emptyFeatures}>
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={wp(4)}
                    color={colors.primary}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Otomatik hatırlatma
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons
                    name="chart-line"
                    size={wp(4)}
                    color={colors.primary}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    İlerleme takibi
                  </Text>
                </View>
              </View>

              <View style={styles.emptyButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.modernAddButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => handleAddMedicine(compartment)}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={wp("5%")}
                    color="#fff"
                  />
                  <Text style={styles.modernAddButtonText}>İlaç Ekle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.helpButton,
                    {
                      backgroundColor: `${colors.primary}15`,
                      borderColor: `${colors.primary}40`,
                    },
                  ]}
                  onPress={handleOpenHelpModal}
                >
                  <MaterialCommunityIcons
                    name="help-circle-outline"
                    size={wp("4.5%")}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.helpButtonText, { color: colors.primary }]}
                  >
                    Nasıl Eklenir?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.modernFullHeader}>
                <View style={styles.modernHeaderContent}>
                  <View
                    style={[
                      styles.modernIconContainer,
                      { backgroundColor: `${statusColor}15` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="pill"
                      size={wp("7%")}
                      color={statusColor}
                    />
                  </View>
                  <View style={styles.modernHeaderText}>
                    <Text
                      style={[
                        styles.modernMedicineName,
                        { color: colors.text.primary },
                      ]}
                    >
                      {compartment.medicineName}
                    </Text>
                    <View style={styles.modernHeaderMeta}>
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
                            styles.modernCompartmentText,
                            { color: colors.primary },
                          ]}
                        >
                          #{compartment.idx}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.modernStatusBadge,
                          { backgroundColor: `${statusColor}20` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.modernStatusText,
                            { color: statusColor },
                          ]}
                        >
                          {statusText}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.modernCompartmentContent}>
                <View style={styles.modernInfoCards}>
                  <View
                    style={[
                      styles.modernInfoCard,
                      {
                        backgroundColor: `${colors.primary}08`,
                        borderColor: `${colors.primary}20`,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="medical-bag"
                      size={wp(5)}
                      color={colors.primary}
                    />
                    <View style={styles.modernInfoCardContent}>
                      <Text
                        style={[
                          styles.modernInfoLabel,
                          { color: colors.text.secondary },
                        ]}
                      >
                        İlaç Adı
                      </Text>
                      <Text
                        style={[
                          styles.modernInfoValue,
                          { color: colors.text.primary },
                        ]}
                      >
                        {compartment.medicineName}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.modernInfoCard,
                      {
                        backgroundColor: `${colors.warning}08`,
                        borderColor: `${colors.warning}20`,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="flask"
                      size={wp(5)}
                      color={colors.warning}
                    />
                    <View style={styles.modernInfoCardContent}>
                      <Text
                        style={[
                          styles.modernInfoLabel,
                          { color: colors.text.secondary },
                        ]}
                      >
                        Dozaj
                      </Text>
                      <Text
                        style={[
                          styles.modernInfoValue,
                          { color: colors.text.primary },
                        ]}
                      >
                        {compartment.medicineDosage || "-"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.compactFillSection,
                    {
                      backgroundColor: `${statusColor}08`,
                      borderColor: `${statusColor}20`,
                    },
                  ]}
                >
                  <View style={styles.compactFillContent}>
                    <View style={styles.compactFillIcon}>
                      <MaterialCommunityIcons
                        name="chart-bar"
                        size={wp(4.5)}
                        color={statusColor}
                      />
                    </View>
                    <View style={styles.compactFillText}>
                      <Text
                        style={[
                          styles.compactFillTitle,
                          { color: colors.text.primary },
                        ]}
                      >
                        Doluluk: {compartment.currentStock || 0}/{MAX_CAPACITY}
                      </Text>
                      <Text
                        style={[
                          styles.compactFillStatus,
                          { color: statusColor },
                        ]}
                      >
                        {fillPercentage.toFixed(0)}% - {statusText}
                      </Text>
                    </View>
                    <View style={styles.compactProgressContainer}>
                      <View
                        style={[
                          styles.compactProgressBar,
                          { backgroundColor: `${statusColor}20` },
                        ]}
                      >
                        <View
                          style={[
                            styles.compactProgressFill,
                            {
                              backgroundColor: statusColor,
                              width: `${fillPercentage}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Schedule Summary */}
                {(() => {
                  console.log("🔍 Schedule condition check:", {
                    hasScheduleSummary: !!compartment.scheduleSummary,
                    scheduleLength: compartment.scheduleSummary?.length,
                    isFull: isFull,
                    compartmentIdx: compartment.idx,
                  });
                  return (
                    compartment.scheduleSummary &&
                    compartment.scheduleSummary.length > 0
                  );
                })() && (
                  <View style={styles.scheduleSection}>
                    <Text
                      style={[
                        styles.scheduleSectionTitle,
                        { color: colors.text.primary },
                      ]}
                    >
                      Yaklaşan Programlar
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleOpenScheduleModal(
                          compartment.scheduleSummary || []
                        )
                      }
                    >
                      {(() => {
                        const schedule = compartment.scheduleSummary?.[0];
                        if (!schedule) return null;

                        const statusIconMap = {
                          PENDING: "clock-outline",
                          DISPENSED_WAITING: "medical-bag",
                          TAKEN_ON_TIME: "check-circle",
                          TAKEN_LATE: "check-circle-outline",
                          MISSED: "close-circle",
                        };
                        const statusColorMap = {
                          PENDING: colors.warning,
                          DISPENSED_WAITING: colors.primary,
                          TAKEN_ON_TIME: colors.success,
                          TAKEN_LATE: colors.warning,
                          MISSED: colors.error,
                        };
                        const statusTextMap = {
                          PENDING: "Bekliyor",
                          DISPENSED_WAITING: "Dağıtıldı",
                          TAKEN_ON_TIME: "Zamanında",
                          TAKEN_LATE: "Geç Alındı",
                          MISSED: "Kaçırıldı",
                        };

                        const scheduleMoment = moment
                          .utc(schedule.scheduledAt)
                          .subtract(3, "hours");
                        const now = moment();
                        const isToday = scheduleMoment.isSame(now, "day");
                        const isTomorrow = scheduleMoment.isSame(
                          now.clone().add(1, "day"),
                          "day"
                        );

                        let dateLabel = scheduleMoment.format("DD MMMM");
                        if (isToday) dateLabel = "Bugün";
                        else if (isTomorrow) dateLabel = "Yarın";

                        return (
                          <View
                            style={[
                              styles.scheduleItem,
                              {
                                backgroundColor: isDark
                                  ? colors.background.secondary
                                  : colors.card.background,
                                borderColor: colors.border.secondary,
                              },
                            ]}
                          >
                            <View style={styles.scheduleTime}>
                              <Text
                                style={[
                                  styles.scheduleTimeText,
                                  { color: colors.text.primary },
                                ]}
                              >
                                {scheduleMoment.format("HH:mm")}
                              </Text>
                              <Text
                                style={[
                                  styles.scheduleDateText,
                                  { color: colors.text.secondary },
                                ]}
                              >
                                {dateLabel}
                              </Text>
                            </View>
                            <View style={styles.scheduleStatus}>
                              <MaterialCommunityIcons
                                name={statusIconMap[schedule.status] as any}
                                size={wp(4)}
                                color={statusColorMap[schedule.status]}
                              />
                              <Text
                                style={[
                                  styles.scheduleStatusText,
                                  {
                                    color: statusColorMap[schedule.status],
                                  },
                                ]}
                              >
                                {statusTextMap[schedule.status]}
                              </Text>
                            </View>
                          </View>
                        );
                      })()}
                      {(compartment.scheduleSummary?.length ?? 0) > 1 && (
                        <Text
                          style={[
                            styles.moreSchedulesText,
                            { color: colors.text.secondary },
                          ]}
                        >
                          +{(compartment.scheduleSummary?.length ?? 0) - 1}{" "}
                          program daha... Tümünü gör
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.modernActionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modernActionButton,
                      styles.updateButton,
                      { backgroundColor: "#FFBD24" },
                    ]}
                    onPress={() => handleAddMedicine(compartment)}
                  >
                    <View style={styles.modernButtonIconContainer}>
                      <MaterialCommunityIcons
                        name="pencil"
                        size={wp(5)}
                        color="#fff"
                      />
                    </View>
                    <Text style={styles.modernButtonText}>İlaç Güncelle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modernActionButton,
                      styles.deleteButton,
                      {
                        backgroundColor:
                          deletingCompartmentId === compartment.idx
                            ? colors.text.tertiary
                            : colors.error,
                        opacity:
                          deletingCompartmentId === compartment.idx ? 0.7 : 1,
                      },
                    ]}
                    disabled={deletingCompartmentId === compartment.idx}
                    onPress={() => {
                      Alert.alert(
                        "İlaç Silme",
                        `${compartment.medicineName} ilacını silmek istediğinizden emin misiniz?`,
                        [
                          {
                            text: "İptal",
                            style: "cancel",
                          },
                          {
                            text: "Sil",
                            style: "destructive",
                            onPress: async () => {
                              // Silme işlemi başlıyor, loading state'ini başlat
                              setDeletingCompartmentId(compartment.idx);

                              try {
                                await deleteCompartment(compartment.idx);
                                // Compartments listesini yenile
                                await fetchCompartments();

                                // İşlem başarılı, step1'e dön ve dashboard'a yönlendir
                                setActiveTab(null);
                                navigation.navigate("Dashboard", {
                                  screen: "HomeScreen",
                                });
                              } catch (error: any) {
                                console.error(
                                  "Error deleting compartment:",
                                  error
                                );

                                // Hata durumunda ErrorModal göster
                                const message =
                                  error.message ||
                                  "İlaç silinirken bir hata oluştu.";
                                setErrorMessage(message);
                                setShowErrorModal(true);
                              } finally {
                                // İşlem tamamlandığında loading state'ini temizle
                                setDeletingCompartmentId(null);
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <View style={styles.modernButtonIconContainer}>
                      {deletingCompartmentId === compartment.idx ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <MaterialCommunityIcons
                          name="delete"
                          size={wp(5)}
                          color="#fff"
                        />
                      )}
                    </View>
                    <Text style={styles.modernButtonText}>
                      {deletingCompartmentId === compartment.idx
                        ? "Siliniyor..."
                        : "İlaç Sil"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
    // Hata modalı kapandıktan sonra step1'e dön ve dashboard'a yönlendir
    setActiveTab(null);
    navigation.navigate("Dashboard", { screen: "HomeScreen" });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background.primary}
      />

      <View
        style={[
          styles.mainContent,
          { backgroundColor: colors.background.primary },
        ]}
      >
        {/* Tab Navigation */}
        {renderTabs()}

        {/* Active Compartment Details */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderActiveCompartment()}
        </ScrollView>
      </View>

      <ErrorModal
        visible={showErrorModal}
        onClose={handleCloseErrorModal}
        message={errorMessage}
      />

      {/* Schedule Detail Modal */}
      {isScheduleModalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={handleCloseScheduleModal}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Yaklaşan Programlar
              </Text>
              <TouchableOpacity
                onPress={handleCloseScheduleModal}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={wp(6)}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {schedulesForModal && schedulesForModal.length > 0 ? (
                schedulesForModal.map((schedule, index) => {
                  const statusIconMap = {
                    PENDING: "clock-outline",
                    DISPENSED_WAITING: "medical-bag",
                    TAKEN_ON_TIME: "check-circle",
                    TAKEN_LATE: "check-circle-outline",
                    MISSED: "close-circle",
                  };
                  const statusColorMap = {
                    PENDING: colors.warning,
                    DISPENSED_WAITING: colors.primary,
                    TAKEN_ON_TIME: colors.success,
                    TAKEN_LATE: colors.warning,
                    MISSED: colors.error,
                  };
                  const statusTextMap = {
                    PENDING: "Bekliyor",
                    DISPENSED_WAITING: "Dağıtıldı",
                    TAKEN_ON_TIME: "Zamanında",
                    TAKEN_LATE: "Geç Alındı",
                    MISSED: "Kaçırıldı",
                  };

                  const scheduleMoment = moment
                    .utc(schedule.scheduledAt)
                    .subtract(3, "hours");
                  const now = moment();
                  const isToday = scheduleMoment.isSame(now, "day");
                  const isTomorrow = scheduleMoment.isSame(
                    now.clone().add(1, "day"),
                    "day"
                  );

                  let dateLabel = scheduleMoment.format("DD MMMM");
                  if (isToday) dateLabel = "Bugün";
                  else if (isTomorrow) dateLabel = "Yarın";

                  return (
                    <View
                      key={`schedule-${index}`}
                      style={[
                        styles.modalScheduleItem,
                        {
                          backgroundColor: isDark
                            ? colors.background.secondary
                            : colors.card.background,
                          borderColor: colors.border.secondary,
                        },
                      ]}
                    >
                      <View style={styles.modalScheduleTime}>
                        <Text
                          style={[
                            styles.modalScheduleTimeText,
                            { color: colors.text.primary },
                          ]}
                        >
                          {scheduleMoment.format("HH:mm")}
                        </Text>
                        <Text
                          style={[
                            styles.modalScheduleDateText,
                            { color: colors.text.secondary },
                          ]}
                        >
                          {dateLabel}
                        </Text>
                        <Text
                          style={[
                            styles.modalScheduleFullDate,
                            { color: colors.text.tertiary },
                          ]}
                        >
                          {scheduleMoment.format("dddd, DD MMMM YYYY")}
                        </Text>
                      </View>
                      <View style={styles.modalScheduleStatus}>
                        <MaterialCommunityIcons
                          name={statusIconMap[schedule.status] as any}
                          size={wp(5)}
                          color={statusColorMap[schedule.status]}
                        />
                        <Text
                          style={[
                            styles.modalScheduleStatusText,
                            { color: statusColorMap[schedule.status] },
                          ]}
                        >
                          {statusTextMap[schedule.status]}
                        </Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text
                  style={[
                    styles.modalEmptyText,
                    { color: colors.text.secondary },
                  ]}
                >
                  Henüz program bulunmuyor.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Help Modal */}
      {isHelpModalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={handleCloseHelpModal}
          />
          <View
            style={[
              styles.helpModalContent,
              { backgroundColor: colors.card.background },
            ]}
          >
            <View style={styles.helpModalHeader}>
              <Text
                style={[styles.helpModalTitle, { color: colors.text.primary }]}
              >
                İlaçlar Bölmeye Nasıl Eklenir?
              </Text>
              <TouchableOpacity
                onPress={handleCloseHelpModal}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={wp(6)}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.helpModalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.helpGifContainer}>
                <View style={styles.gifWrapper}>
                  <Video
                    source={require("@/assets/images/a.mp4")}
                    style={styles.helpGif}
                    shouldPlay
                    isLooping
                    resizeMode={ResizeMode.CONTAIN}
                  />
                </View>
                <Text
                  style={[
                    styles.gifDescription,
                    { color: colors.text.secondary },
                  ]}
                >
                  İlaç Ekleme Rehber Animasyonu
                </Text>
              </View>

              <View style={styles.helpSteps}>
                <Text
                  style={[
                    styles.helpStepsTitle,
                    { color: colors.text.primary },
                  ]}
                >
                  Adım Adım Rehber:
                </Text>

                <View style={styles.helpStep}>
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      style={[styles.stepTitle, { color: colors.text.primary }]}
                    >
                      Cihazın Fişi Takılı Olduğundan Emin Olun
                    </Text>
                    <Text
                      style={[
                        styles.stepDescription,
                        { color: colors.text.secondary },
                      ]}
                    >
                      Cihazınızın prize takılı olduğunu kontrol edin ve bölme
                      üzerindeki şeffaf koruma kapağını sağa doğru çekin.
                    </Text>
                  </View>
                </View>

                <View style={styles.helpStep}>
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      style={[styles.stepTitle, { color: colors.text.primary }]}
                    >
                      İlaçları Dikkatli Bir Şekilde Yerleştirin
                    </Text>
                    <Text
                      style={[
                        styles.stepDescription,
                        { color: colors.text.secondary },
                      ]}
                    >
                      İlaçlarınızı animasyonda gösterildiği gibi dikkatli bir
                      şekilde çekmeceye yerleştirin. İlacın bölmeyi
                      sıkıştırmamasına dikkat edin. (Maksimum 14 adet)
                    </Text>
                  </View>
                </View>

                <View style={styles.helpStep}>
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      style={[styles.stepTitle, { color: colors.text.primary }]}
                    >
                      Bölmenin Kapağını Kapatın
                    </Text>
                    <Text
                      style={[
                        styles.stepDescription,
                        { color: colors.text.secondary },
                      ]}
                    >
                      Şeffaf koruma kapağını eski konumuna getirin ve tam olarak
                      kapandığından emin olun.
                    </Text>
                  </View>
                </View>

                <View style={styles.helpStep}>
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: colors.success },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="check"
                      size={wp(4)}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.stepContent}>
                    <Text
                      style={[styles.stepTitle, { color: colors.text.primary }]}
                    >
                      Uygulama Üzerinden Ekleyin
                    </Text>
                    <Text
                      style={[
                        styles.stepDescription,
                        { color: colors.text.secondary },
                      ]}
                    >
                      "İlaç Ekle" butonuna basarak ilaç bilgilerini ve program
                      saatlerini girin
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.helpTip,
                  {
                    backgroundColor: `${colors.primary}10`,
                    borderColor: `${colors.primary}30`,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={wp(5)}
                  color={colors.primary}
                />
                <View style={styles.helpTipContent}>
                  <Text
                    style={[styles.helpTipTitle, { color: colors.primary }]}
                  >
                    İpucu
                  </Text>
                  <Text
                    style={[
                      styles.helpTipText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    İlaçlarınızı bölmeye yerleştirmeden önce uygulama üzerinden
                    program oluşturabilirsiniz. Bu sayede daha organize
                    olursunuz!
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    backgroundColor: "transparent",
    zIndex: 10,
  },
  tabButton: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2),
    borderRadius: wp(6),
    borderWidth: 1,
    width: wp(23),
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: wp(3.5),
    textAlign: "center",
  },
  activeCompartmentContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    flex: 1,
    height: "90%",
  },
  activeCompartmentCard: {
    borderRadius: wp(6),
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp("4%"),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 200, 200, 0.3)",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  medicineName: {
    fontSize: wp(5.5),
    fontWeight: "700",
    marginLeft: wp(2),
  },
  compartmentLabel: {
    fontSize: wp(4.2),
    fontWeight: "700",
  },
  compartmentContent: {
    padding: wp(4),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  infoLabel: {
    fontSize: wp(4),
    fontWeight: "500",
  },
  infoValue: {
    fontSize: wp(4),
    fontWeight: "600",
  },
  fillDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: hp(2),
  },
  fillContainer: {
    width: wp(20),
    height: hp(15),
    backgroundColor: "rgba(240, 240, 240, 0.3)",
    borderRadius: wp(3),
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    marginRight: wp(3),
  },
  fillLevel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: wp(1.5),
    borderTopRightRadius: wp(1.5),
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  statusText: {
    fontSize: wp(5),
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(3),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: wp(3),
    borderRadius: wp(3),
    flex: 0.48,
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: "600",
    marginLeft: wp(2),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("8%"),
  },
  emptyIconContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: wp("20%"),
    width: wp("30%"),
    height: wp("30%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  emptyTitle: {
    fontSize: wp("5.5%"),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  emptyText: {
    fontSize: wp(4),
    color: "#666",
    textAlign: "center",
    marginBottom: hp(3),
    lineHeight: hp(3),
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("8%"),
    borderRadius: wp("8%"),
    ...shadowStyle,
  },
  addButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
    marginLeft: wp(2),
  },
  scheduleSection: {
    marginTop: hp(2),
    padding: wp(3),
    backgroundColor: "rgba(240, 240, 240, 0.1)",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.3)",
  },
  scheduleSectionTitle: {
    fontSize: wp(4.2),
    fontWeight: "600",
    marginBottom: hp(1.5),
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(3),
    marginBottom: hp(1),
    borderRadius: wp(2),
    borderWidth: 1,
  },
  scheduleTime: {
    flex: 1,
  },
  scheduleTimeText: {
    fontSize: wp(4),
    fontWeight: "600",
  },
  scheduleDateText: {
    fontSize: wp(3.2),
    marginTop: 2,
  },
  scheduleStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  scheduleStatusText: {
    fontSize: wp(3.5),
    fontWeight: "500",
    marginLeft: wp(1.5),
  },
  moreSchedulesText: {
    fontSize: wp(3.5),
    textAlign: "center",
    marginTop: hp(1),
    fontStyle: "italic",
  },
  // Modern Tab Styles
  modernTabContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: "transparent",
  },
  tabSectionTitle: {
    fontSize: wp(5),
    fontWeight: "700",
    marginBottom: hp(2),
    textAlign: "center",
  },
  tabGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modernTabButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: wp(4),
    borderWidth: 2,
    padding: wp(3),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(2),
    position: "relative",
  },
  activeModernTab: {
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  tabIconContainer: {
    position: "relative",
    marginBottom: hp(1),
  },
  statusIndicator: {
    position: "absolute",
    top: -wp(1),
    right: -wp(1),
    width: wp(3),
    height: wp(3),
    borderRadius: wp(1.5),
    borderWidth: 2,
    borderColor: "#fff",
  },
  modernTabText: {
    fontSize: wp(4),
    textAlign: "center",
    marginBottom: hp(0.5),
  },
  tabSubtext: {
    fontSize: wp(3),
    textAlign: "center",
    fontWeight: "500",
  },
  // Modern Empty Styles
  modernEmptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(6),
  },
  modernEmptyIconContainer: {
    borderRadius: wp(8),
    width: wp(20),
    height: wp(20),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(3),
  },
  modernEmptyTitle: {
    fontSize: wp(6),
    fontWeight: "700",
    marginBottom: hp(1),
    textAlign: "center",
  },
  modernEmptyText: {
    fontSize: wp(4),
    textAlign: "center",
    marginBottom: hp(3),
    lineHeight: wp(5.5),
  },
  emptyFeatures: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: hp(4),
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    fontSize: wp(3),
    marginTop: hp(0.5),
    textAlign: "center",
  },
  modernAddButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: wp(8),
    ...shadowStyle,
  },
  modernAddButtonText: {
    color: "#fff",
    fontSize: wp(4.5),
    fontWeight: "700",
    marginLeft: wp(2),
  },
  emptyButtonContainer: {
    alignItems: "center",
    gap: hp(2),
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(6),
    borderWidth: 1,
    ...shadowStyle,
  },
  helpButtonText: {
    fontSize: wp(3.8),
    fontWeight: "600",
    marginLeft: wp(1.5),
  },
  // Horizontal Tab Styles
  horizontalTabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    backgroundColor: "transparent",
    zIndex: 10,
  },
  horizontalTabButton: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2),
    borderRadius: wp(6),
    borderWidth: 1,
    width: wp(21),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  activeHorizontalTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalTabContent: {
    position: "relative",
    marginRight: wp(1.5),
  },
  smallStatusIndicator: {
    position: "absolute",
    top: -wp(0.5),
    right: -wp(0.5),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    borderWidth: 1,
    borderColor: "#fff",
  },
  horizontalTabText: {
    fontSize: wp(3.5),
    textAlign: "center",
  },
  // Modern Full Header Styles
  modernFullHeader: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 200, 200, 0.2)",
  },
  modernHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modernIconContainer: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },
  modernHeaderText: {
    flex: 1,
  },
  modernMedicineName: {
    fontSize: wp(5.5),
    fontWeight: "700",
    marginBottom: hp(0.8),
  },
  modernHeaderMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  modernCompartmentBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(4),
    borderWidth: 1,
    marginRight: wp(2),
  },
  modernCompartmentText: {
    fontSize: wp(3.2),
    fontWeight: "600",
  },
  modernStatusBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(4),
  },
  modernStatusText: {
    fontSize: wp(3.2),
    fontWeight: "600",
  },
  // Modern Content Styles
  modernCompartmentContent: {
    padding: wp(4),
  },
  modernInfoCards: {
    gap: hp(1.5),
  },
  modernInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3.5),
    borderRadius: wp(4),
    borderWidth: 1,
  },
  modernInfoCardContent: {
    flex: 1,
    marginLeft: wp(3),
  },
  modernInfoLabel: {
    fontSize: wp(3.2),
    fontWeight: "500",
    marginBottom: hp(0.3),
  },
  modernInfoValue: {
    fontSize: wp(4.2),
    fontWeight: "700",
  },
  // Modern Fill Styles
  modernFillSection: {
    marginTop: hp(2),
    padding: wp(4),
    borderRadius: wp(4),
    borderWidth: 1,
  },
  modernFillHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  modernFillTitle: {
    fontSize: wp(4.5),
    fontWeight: "700",
    marginLeft: wp(2.5),
  },
  modernFillDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  modernFillContainer: {
    width: wp(25),
    height: hp(18),
    backgroundColor: "rgba(240, 240, 240, 0.3)",
    borderRadius: wp(4),
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    marginRight: wp(4),
  },
  modernFillLevel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },
  modernGlassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  modernFillInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  modernFillPercentage: {
    fontSize: wp(7),
    fontWeight: "800",
    marginBottom: hp(0.5),
  },
  modernFillStatusText: {
    fontSize: wp(4.5),
    fontWeight: "700",
    marginBottom: hp(0.3),
  },
  modernFillDetail: {
    fontSize: wp(3.5),
    fontWeight: "500",
  },
  // Modern Action Button Styles
  modernActionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(3),
    gap: wp(3),
  },
  modernActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(4),
    flex: 1,
    minHeight: hp(6),
  },
  updateButton: {
    shadowColor: "#FFBD24",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButton: {
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modernButtonIconContainer: {
    marginRight: wp(2),
  },
  modernButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "700",
  },
  // Compact Fill Styles
  compactFillSection: {
    marginTop: hp(1.5),
    padding: wp(3),
    borderRadius: wp(3),
    borderWidth: 1,
  },
  compactFillContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactFillIcon: {
    marginRight: wp(3),
  },
  compactFillText: {
    flex: 1,
    marginRight: wp(3),
  },
  compactFillTitle: {
    fontSize: wp(4),
    fontWeight: "700",
    marginBottom: hp(0.2),
  },
  compactFillStatus: {
    fontSize: wp(3.2),
    fontWeight: "600",
  },
  compactProgressContainer: {
    width: wp(20),
  },
  compactProgressBar: {
    height: hp(1),
    borderRadius: hp(0.5),
    overflow: "hidden",
  },
  compactProgressFill: {
    height: "100%",
    borderRadius: hp(0.5),
  },
  // Modal Styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: wp(90),
    maxHeight: hp(70),
    borderRadius: wp(4),
    padding: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 200, 200, 0.3)",
  },
  modalTitle: {
    fontSize: wp(5),
    fontWeight: "700",
  },
  modalCloseButton: {
    padding: wp(1),
  },
  modalBody: {
    maxHeight: hp(50),
  },
  modalScheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(4),
    marginBottom: hp(1.5),
    borderRadius: wp(3),
    borderWidth: 1,
  },
  modalScheduleTime: {
    flex: 1,
  },
  modalScheduleTimeText: {
    fontSize: wp(4.5),
    fontWeight: "700",
    marginBottom: hp(0.3),
  },
  modalScheduleDateText: {
    fontSize: wp(3.8),
    fontWeight: "600",
    marginBottom: hp(0.2),
  },
  modalScheduleFullDate: {
    fontSize: wp(3.2),
    fontWeight: "500",
  },
  modalScheduleStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  modalScheduleStatusText: {
    fontSize: wp(3.8),
    fontWeight: "600",
    marginLeft: wp(2),
  },
  modalEmptyText: {
    textAlign: "center",
    fontSize: wp(4),
    fontWeight: "500",
    marginTop: hp(4),
  },
  // Help Modal Styles
  helpModalContent: {
    width: wp(92),
    maxHeight: hp(85),
    borderRadius: wp(4),
    padding: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  helpModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200, 200, 200, 0.3)",
  },
  helpModalTitle: {
    fontSize: wp(5.2),
    fontWeight: "700",
    flex: 1,
  },
  helpModalBody: {
    maxHeight: hp(65),
  },
  helpGifContainer: {
    alignItems: "center",
    marginBottom: hp(3),
  },
  gifWrapper: {
    borderRadius: wp(4),
    padding: wp(2),
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.3)",
  },
  helpGif: {
    width: wp(75),
    height: hp(30),
    borderRadius: wp(3),
  },
  gifDescription: {
    fontSize: wp(3.8),
    textAlign: "center",
    marginTop: hp(2),
    fontWeight: "600",
  },

  helpSteps: {
    marginBottom: hp(2),
  },
  helpStepsTitle: {
    fontSize: wp(4.5),
    fontWeight: "700",
    marginBottom: hp(2),
  },
  helpStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(2.5),
  },
  stepNumber: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
    marginTop: hp(0.2),
  },
  stepNumberText: {
    color: "#fff",
    fontSize: wp(3.5),
    fontWeight: "700",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: wp(4.2),
    fontWeight: "700",
    marginBottom: hp(0.5),
  },
  stepDescription: {
    fontSize: wp(3.8),
    lineHeight: wp(5),
  },
  helpTip: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: wp(4),
    borderRadius: wp(3),
    borderWidth: 1,
    marginTop: hp(2),
  },
  helpTipContent: {
    flex: 1,
    marginLeft: wp(3),
  },
  helpTipTitle: {
    fontSize: wp(4),
    fontWeight: "700",
    marginBottom: hp(0.5),
  },
  helpTipText: {
    fontSize: wp(3.5),
    lineHeight: wp(4.8),
  },
  helpVisualContainer: {
    alignItems: "center",
    marginBottom: hp(3),
  },
  helpVisualPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(70),
    height: hp(20),
    borderRadius: wp(4),
    borderWidth: 2,
    borderStyle: "dashed",
    padding: wp(4),
  },
  arrowIcon: {
    marginVertical: hp(1),
  },
  visualDescription: {
    fontSize: wp(3.8),
    textAlign: "center",
    marginTop: hp(2),
    fontWeight: "600",
  },
});

export default CompartmentScreen;
