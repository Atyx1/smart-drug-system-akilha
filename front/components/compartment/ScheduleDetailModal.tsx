import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import type { CompartmentSummaryDto } from "@/types/Types";

interface ScheduleDetailModalProps {
  visible: boolean;
  onClose: () => void;
  schedules: CompartmentSummaryDto["scheduleSummary"];
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({
  visible,
  onClose,
  schedules,
}) => {
  const { colors, activeColorScheme } = useTheme();
  const isDark = activeColorScheme === "dark";

  const renderScheduleItem = ({
    item: schedule,
  }: {
    item: CompartmentSummaryDto["scheduleSummary"][0];
  }) => {
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

    const scheduleDate = new Date(schedule.scheduledAt);
    const now = new Date();
    const isToday = scheduleDate.toDateString() === now.toDateString();
    const isTomorrow =
      scheduleDate.toDateString() ===
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

    let dateLabel = scheduleDate.toLocaleDateString("tr-TR");
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
            style={[styles.scheduleTimeText, { color: colors.text.primary }]}
          >
            {scheduleDate.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text
            style={[styles.scheduleDateText, { color: colors.text.secondary }]}
          >
            {dateLabel}
          </Text>
        </View>
        <View style={styles.scheduleStatus}>
          <MaterialCommunityIcons
            name={statusIconMap[schedule.status] as any}
            size={wp(4.5)}
            color={statusColorMap[schedule.status]}
          />
          <Text
            style={[
              styles.scheduleStatusText,
              { color: statusColorMap[schedule.status] },
            ]}
          >
            {statusTextMap[schedule.status]}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.background.primary },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              Tüm Programlar
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={wp(6)}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={schedules}
            renderItem={renderScheduleItem}
            keyExtractor={(item, index) => `${item.scheduledAt}-${index}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    height: hp("60%"),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    padding: wp(4),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  listContent: {
    paddingTop: hp(2),
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(3.5),
    borderRadius: wp(3),
    borderWidth: 1,
    marginBottom: hp(1.5),
  },
  scheduleTime: {
    flexDirection: "column",
  },
  scheduleTimeText: {
    fontSize: wp(4.2),
    fontWeight: "bold",
  },
  scheduleDateText: {
    fontSize: wp(3.5),
    marginTop: 4,
  },
  scheduleStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleStatusText: {
    fontSize: wp(3.8),
    marginLeft: wp(2),
    fontWeight: "500",
  },
});

export default ScheduleDetailModal;
