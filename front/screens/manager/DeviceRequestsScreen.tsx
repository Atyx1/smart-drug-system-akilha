import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDevice } from "@/context/DeviceContext";
import { useTheme } from "@/context/ThemeContext";

import { useTranslation } from "@/localization/i18n";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { PendingApprovalDto } from "@/types/Types";

const DeviceRequestsScreen = () => {
  const {
    devices,
    pendingRequests,
    loading,

    fetchPendingRequests,
    approveRequest,
    rejectRequest,
    setSelectedDeviceId,
  } = useDevice();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Get current device info - use first device or find manager device
  const currentDevice = devices.length > 0 ? devices[0] : null;

  console.log("DeviceRequestsScreen - devices:", devices);
  console.log("DeviceRequestsScreen - currentDevice:", currentDevice);

  useEffect(() => {
    if (currentDevice) {
      setSelectedDeviceId(currentDevice.id);
      fetchPendingRequests(currentDevice.id);
    }
  }, [currentDevice]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentDevice) {
      await fetchPendingRequests(currentDevice.id);
    }
    setRefreshing(false);
  };

  const handleApprove = async (approvalId: number) => {
    await approveRequest(approvalId);
  };

  const handleReject = async (approvalId: number) => {
    await rejectRequest(approvalId);
  };

  const renderRequestItem = ({
    item,
    index,
  }: {
    item: PendingApprovalDto;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          {
            backgroundColor: colors.card.background,
            borderColor: colors.border.primary,
          },
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.mainRow}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: `${colors.warning}15` },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.warning }]}>
              {(item.userFullName || item.userEmail).charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.topRow}>
              <Text style={[styles.userName, { color: colors.text.primary }]}>
                {item.userFullName || "Kullanıcı"}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${colors.warning}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={wp("3%")}
                  color={colors.warning}
                />
                <Text style={[styles.statusText, { color: colors.warning }]}>
                  Bekliyor
                </Text>
              </View>
            </View>

            <Text style={[styles.userEmail, { color: colors.text.secondary }]}>
              {item.userEmail}
            </Text>

            <View style={styles.accessInfo}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={wp("3.5%")}
                color={colors.text.secondary}
              />
              <Text
                style={[styles.accessText, { color: colors.text.secondary }]}
              >
                Hastanızın ilaç takibi ve tedavi sürecini görmek istiyor
              </Text>
            </View>

            {item.requestDate && (
              <View style={styles.dateInfo}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={wp("3%")}
                  color={colors.text.secondary}
                />
                <Text
                  style={[styles.dateText, { color: colors.text.secondary }]}
                >
                  {format(new Date(item.requestDate), "dd MMMM yyyy", {
                    locale: tr,
                  })}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.rejectButton,
                { backgroundColor: colors.error },
              ]}
              onPress={() => handleReject(item.id)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="close"
                size={wp("4%")}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.approveButton,
                { backgroundColor: colors.success },
              ]}
              onPress={() => handleApprove(item.id)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="check"
                size={wp("4%")}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.card.background,
          borderColor: colors.border.primary,
        },
      ]}
    >
      {/* Device Info */}
      <View style={styles.deviceSection}>
        <View style={styles.deviceHeader}>
          <View
            style={[
              styles.deviceIcon,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            <MaterialCommunityIcons
              name="tablet"
              size={wp("5%")}
              color={colors.primary}
            />
          </View>
          <View style={styles.deviceInfo}>
            <Text
              style={[styles.deviceLabel, { color: colors.text.secondary }]}
            >
              {t("current_device")}
            </Text>
            <Text style={[styles.deviceName, { color: colors.text.primary }]}>
              {currentDevice?.name || "Cihaz"}
            </Text>
          </View>
          <View
            style={[
              styles.deviceStatus,
              { backgroundColor: `${colors.success}20` },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: colors.success }]}
            />
            <Text style={[styles.statusLabel, { color: colors.success }]}>
              Aktif
            </Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {pendingRequests.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Bekleyen İstek
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyState}>
        <View
          style={[styles.emptyIcon, { backgroundColor: `${colors.success}15` }]}
        >
          <MaterialCommunityIcons
            name="check-all"
            size={wp("10%")}
            color={colors.success}
          />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
          Tüm İstekler İşlendi
        </Text>
        <Text
          style={[styles.emptyDescription, { color: colors.text.secondary }]}
        >
          Şu anda bekleyen erişim isteği bulunmuyor. Yeni istekler geldiğinde
          burada görüntülenecek.
        </Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          İstekler yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <FlatList
        data={pendingRequests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("4%"),
  },
  userCard: {
    marginBottom: hp("1%"),
    padding: wp("4%"),
    borderRadius: wp("2%"),
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
  avatarText: {
    fontSize: wp("5%"),
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp("0.5%"),
  },
  userName: {
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.3%"),
    borderRadius: wp("3%"),
    gap: wp("1%"),
  },
  statusText: {
    fontSize: wp("3%"),
    fontWeight: "500",
  },
  userEmail: {
    fontSize: wp("3.5%"),
    marginBottom: hp("0.5%"),
  },
  accessInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("0.5%"),
    gap: wp("1%"),
  },
  accessText: {
    fontSize: wp("3%"),
    flex: 1,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("0.5%"),
    gap: wp("1%"),
  },
  dateText: {
    fontSize: wp("3%"),
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "center",
    gap: hp("1%"),
  },
  actionButton: {
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
  },
  approveButton: {
    // styles already defined in actionButton
  },
  rejectButton: {
    // styles already defined in actionButton
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginTop: hp("2%"),
  },
  header: {
    padding: wp("4%"),
    borderRadius: wp("2%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  deviceSection: {
    marginBottom: hp("2%"),
  },
  deviceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
  deviceInfo: {
    flex: 1,
  },
  deviceLabel: {
    fontSize: wp("3.2%"),
    fontWeight: "500",
    marginBottom: hp("0.2%"),
  },
  deviceName: {
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  deviceStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("3%"),
  },
  statusDot: {
    width: wp("2%"),
    height: wp("2%"),
    borderRadius: wp("1%"),
    marginRight: wp("1%"),
  },
  statusLabel: {
    fontSize: wp("3%"),
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginBottom: hp("0.2%"),
  },
  statLabel: {
    fontSize: wp("3.5%"),
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp("10%"),
  },
  emptyState: {
    alignItems: "center",
    maxWidth: wp("85%"),
  },
  emptyIcon: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  emptyTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: wp("3.8%"),
    textAlign: "center",
    lineHeight: wp("5.5%"),
    paddingHorizontal: wp("4%"),
  },
  listContent: {
    paddingBottom: hp("2%"),
  },
});

export default DeviceRequestsScreen;
