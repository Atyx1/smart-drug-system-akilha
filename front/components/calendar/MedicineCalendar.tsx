import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useTheme } from "@/context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/tr";
import type {
  CompartmentSummaryDto,
  PillInstanceSummaryDto,
} from "@/types/Types";

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get("window");
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

type MedicineSchedule = {
  date: string;
  time: string;
  medicineName: string;
  dosage: string;
  compartmentId: number;
  status: string;
  formattedTime: string;
};

type CalendarMarking = {
  marked: boolean;
  dotColor?: string;
  customStyles?: {
    container: {
      backgroundColor: string;
      borderRadius: number;
    };
    text: {
      color: string;
      fontWeight: "bold";
    };
  };
};

interface MedicineCalendarProps {
  compartments: CompartmentSummaryDto[];
}

const MedicineCalendar: React.FC<MedicineCalendarProps> = ({
  compartments,
}) => {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  moment.locale("tr");

  // Process compartment data to create calendar markings and schedule data
  const { markedDates, schedulesByDate } = useMemo(() => {
    const markings: { [key: string]: CalendarMarking & { count: number } } = {};
    const schedules: { [key: string]: MedicineSchedule[] } = {};

    if (compartments && Array.isArray(compartments)) {
      compartments.forEach((comp) => {
        comp.scheduleSummary?.forEach((schedule: PillInstanceSummaryDto) => {
          const m = moment.utc(schedule.scheduledAt).subtract(3, "hours");
          const dateKey = m.format("YYYY-MM-DD");

          // Skip past dates older than today
          if (m.isBefore(moment(), "day")) return;

          const medicineSchedule: MedicineSchedule = {
            date: dateKey,
            time: m.toISOString(),
            medicineName: comp.medicineName || "İlaç",
            dosage: comp.medicineDosage || "",
            compartmentId: comp.idx || 0,
            status: schedule.status,
            formattedTime: m.format("HH:mm"),
          };

          // Add to schedules
          if (!schedules[dateKey]) {
            schedules[dateKey] = [];
          }
          schedules[dateKey].push(medicineSchedule);

          // Add to markings
          if (!markings[dateKey]) {
            markings[dateKey] = {
              marked: true,
              count: 0,
              customStyles: {
                container: {
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                },
                text: {
                  color: "white",
                  fontWeight: "bold",
                },
              },
            };
          }
          markings[dateKey].count += 1;
        });
      });
    }

    return { markedDates: markings, schedulesByDate: schedules };
  }, [compartments, colors.primary]);

  const onDayPress = (day: DateData) => {
    const hasSchedules = schedulesByDate[day.dateString]?.length > 0;
    if (hasSchedules) {
      setSelectedDate(day.dateString);
      setShowDetails(true);
    }
  };

  const selectedSchedules = schedulesByDate[selectedDate] || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TAKEN_ON_TIME":
      case "TAKEN_LATE":
        return colors.success;
      case "MISSED":
        return colors.error;
      case "PENDING":
      case "DISPENSED_WAITING":
        return colors.warning;
      default:
        return colors.text.tertiary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "TAKEN_ON_TIME":
        return "Zamanında Alındı";
      case "TAKEN_LATE":
        return "Geç Alındı";
      case "MISSED":
        return "Kaçırıldı";
      case "PENDING":
        return "Bekliyor";
      case "DISPENSED_WAITING":
        return "Hazır";
      default:
        return "Bilinmiyor";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "TAKEN_ON_TIME":
      case "TAKEN_LATE":
        return "check-circle";
      case "MISSED":
        return "close-circle";
      case "PENDING":
        return "clock";
      case "DISPENSED_WAITING":
        return "medical-bag";
      default:
        return "help-circle";
    }
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Calendar Section */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={moment().format("YYYY-MM-DD")}
          minDate={moment().format("YYYY-MM-DD")}
          maxDate={moment().add(6, "months").format("YYYY-MM-DD")}
          onDayPress={onDayPress}
          markingType="custom"
          markedDates={markedDates}
          monthFormat="MMMM yyyy"
          hideExtraDays={true}
          disableMonthChange={false}
          firstDay={1}
          showWeekNumbers={false}
          dayComponent={({ date, state, marking }) => {
            const dateString = date?.dateString || "";
            const calMarking = markedDates[dateString];
            const isToday = moment().format("YYYY-MM-DD") === dateString;
            const isPast = moment(dateString).isBefore(moment(), "day");
            const isSelected = selectedDate === dateString;

            return (
              <TouchableOpacity
                style={[
                  styles.dayContainer,
                  isToday && styles.todayContainer,
                  isSelected && styles.selectedDayContainer,
                  isPast && styles.pastDayContainer,
                ]}
                onPress={() =>
                  !isPast &&
                  calMarking &&
                  onDayPress({ dateString } as DateData)
                }
                disabled={isPast || !calMarking}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    isPast && styles.pastDayText,
                    isToday && styles.todayText,
                    isSelected && styles.selectedDayText,
                    state === "disabled" && styles.disabledText,
                  ]}
                >
                  {date?.day}
                </Text>
                {calMarking && calMarking.count > 0 && (
                  <View style={[styles.badge, { backgroundColor: "#FFD700" }]}>
                    <Text style={styles.badgeText}>{calMarking.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          theme={{
            backgroundColor: colors.card.background,
            calendarBackground: colors.card.background,
            textSectionTitleColor: colors.text.primary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: "white",
            todayTextColor: colors.primary,
            dayTextColor: colors.text.primary,
            textDisabledColor: colors.text.tertiary,
            dotColor: colors.primary,
            selectedDotColor: "white",
            arrowColor: colors.primary,
            monthTextColor: colors.text.primary,
            indicatorColor: colors.primary,
            textDayFontFamily: "System",
            textMonthFontFamily: "System",
            textDayHeaderFontFamily: "System",
            textDayFontWeight: "500",
            textMonthFontWeight: "600",
            textDayHeaderFontWeight: "500",
            textDayFontSize: wp(3.5),
            textMonthFontSize: wp(4.2),
            textDayHeaderFontSize: wp(3),
          }}
        />
      </View>

      {/* Schedule Details */}
      {showDetails && selectedSchedules.length > 0 && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>
              {moment(selectedDate).format("DD MMMM YYYY")} - İlaç Programı
            </Text>
            <TouchableOpacity
              onPress={() => setShowDetails(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={wp(5)}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.schedulesList}>
            {selectedSchedules
              .sort((a, b) => moment(a.time).diff(moment(b.time)))
              .map((schedule, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <View
                    style={[
                      styles.scheduleIcon,
                      {
                        backgroundColor: `${getStatusColor(schedule.status)}20`,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getStatusIcon(schedule.status)}
                      size={wp(5)}
                      color={getStatusColor(schedule.status)}
                    />
                  </View>
                  <View style={styles.scheduleContent}>
                    <Text style={styles.medicineName}>
                      {schedule.medicineName}
                    </Text>
                    <Text style={styles.dosageText}>{schedule.dosage}</Text>
                    <Text style={styles.statusText}>
                      {getStatusText(schedule.status)}
                    </Text>
                  </View>
                  <View style={styles.scheduleRight}>
                    <Text style={styles.timeText}>
                      {schedule.formattedTime}
                    </Text>
                    <View style={styles.compartmentBadge}>
                      <Text style={styles.compartmentText}>
                        Bölme {schedule.compartmentId}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    calendarContainer: {
      backgroundColor: colors.card.background,
      borderRadius: wp(3),
      padding: wp(2),
      marginBottom: hp(2),
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    dayContainer: {
      width: wp(10),
      height: wp(10),
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      borderRadius: wp(5),
    },
    todayContainer: {
      backgroundColor: `${colors.primary}20`,
    },
    selectedDayContainer: {
      backgroundColor: colors.primary,
    },
    pastDayContainer: {
      opacity: 0.3,
    },
    dayText: {
      fontSize: wp(3.5),
      fontWeight: "500",
      color: colors.text.primary,
    },
    todayText: {
      color: colors.primary,
      fontWeight: "600",
    },
    selectedDayText: {
      color: "white",
      fontWeight: "600",
    },
    pastDayText: {
      color: colors.text.tertiary,
    },
    disabledText: {
      color: colors.text.tertiary,
    },
    badge: {
      position: "absolute",
      top: -2,
      right: -2,
      minWidth: wp(4.5),
      height: wp(4.5),
      borderRadius: wp(2.25),
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: {
      color: "white",
      fontSize: wp(2.5),
      fontWeight: "700",
    },
    detailsContainer: {
      backgroundColor: colors.card.background,
      borderRadius: wp(3),
      borderWidth: 1,
      borderColor: colors.border.primary,
      maxHeight: hp(40),
    },
    detailsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    detailsTitle: {
      fontSize: wp(4.2),
      fontWeight: "600",
      color: colors.text.primary,
      flex: 1,
    },
    closeButton: {
      padding: wp(1),
    },
    schedulesList: {
      maxHeight: hp(30),
    },
    scheduleItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    scheduleIcon: {
      width: wp(10),
      height: wp(10),
      borderRadius: wp(5),
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp(3),
    },
    scheduleContent: {
      flex: 1,
    },
    medicineName: {
      fontSize: wp(4),
      fontWeight: "600",
      color: colors.text.primary,
      marginBottom: hp(0.5),
    },
    dosageText: {
      fontSize: wp(3.2),
      color: colors.text.secondary,
      marginBottom: hp(0.3),
    },
    statusText: {
      fontSize: wp(3),
      color: colors.text.tertiary,
    },
    scheduleRight: {
      alignItems: "flex-end",
    },
    timeText: {
      fontSize: wp(4),
      fontWeight: "600",
      color: colors.primary,
      marginBottom: hp(0.5),
    },
    compartmentBadge: {
      backgroundColor: `${colors.primary}20`,
      paddingHorizontal: wp(2),
      paddingVertical: hp(0.3),
      borderRadius: wp(2),
    },
    compartmentText: {
      fontSize: wp(2.8),
      color: colors.primary,
      fontWeight: "600",
    },
  });

export default MedicineCalendar;
