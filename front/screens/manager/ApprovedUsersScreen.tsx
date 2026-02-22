import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDevice } from "@/context/DeviceContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/localization/i18n";
import Toast from "react-native-toast-message";

const ApprovedUsersScreen = () => {
  const {
    devices,
    approvedUsers,
    loading,
    error,
    selectedDeviceId,
    setSelectedDeviceId,
    fetchApprovedUsers,
    blockUser,
  } = useDevice();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Get current device info - use first device or find manager device
  const currentDevice = devices.length > 0 ? devices[0] : null;

  console.log("ApprovedUsersScreen - devices:", devices);
  console.log("ApprovedUsersScreen - currentDevice:", currentDevice);

  useEffect(() => {
    if (currentDevice) {
      setSelectedDeviceId(currentDevice.id);
      fetchApprovedUsers(currentDevice.id);
    }
  }, [currentDevice]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentDevice) {
      await fetchApprovedUsers(currentDevice.id);
    }
    setRefreshing(false);
  };

  const handleBlockUser = (userId: number, userName: string) => {
    Alert.alert(
      "Erişimi Kaldır",
      `${userName} kişisinin hastanıza erişimini kaldırmak istediğinizden emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Erişimi Kaldır",
          onPress: () => confirmBlockUser(userId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const confirmBlockUser = async (userId: number) => {
    await blockUser(userId);
    // Kullanıcı listesini yenile
    if (currentDevice) {
      await fetchApprovedUsers(currentDevice.id);
    }
    setSelectedUser(null);
  };

  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const renderUserItem = ({ item }: { item: any }) => {
    console.log("Rendering user item:", item);
    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          {
            backgroundColor: colors.card.background,
            borderColor: colors.border.primary,
          },
        ]}
        onPress={() => openUserModal(item)}
        activeOpacity={0.7}
      >
        <View style={styles.mainRow}>
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: `${colors.success}15`,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.success }]}>
              {(item.fullName || item.username).charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.topRow}>
              <Text style={[styles.userName, { color: colors.text.primary }]}>
                {item.fullName || item.username}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: `${colors.accent}20` },
                ]}
              >
                <Text style={[styles.roleBadgeText, { color: colors.accent }]}>
                  Yakın
                </Text>
              </View>
            </View>

            <Text style={[styles.userEmail, { color: colors.text.secondary }]}>
              {item.email}
            </Text>

            <View style={styles.accessInfo}>
              <MaterialCommunityIcons
                name="shield-check"
                size={wp("3.5%")}
                color={colors.success}
              />
              <Text style={[styles.accessText, { color: colors.success }]}>
                Hastanın ilaç takibini görüntüleyebilir
              </Text>
            </View>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={wp("5%")}
            color={colors.text.secondary}
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderModalContent = () => {
    if (!selectedUser) return null;

    return (
      <View
        style={[
          styles.modalContent,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <View
          style={[
            styles.modalHeader,
            { backgroundColor: colors.card.background },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeModal}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="close"
              size={wp("5%")}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
          <View style={styles.modalHeaderCenter}>
            <View
              style={[
                styles.modalAvatar,
                {
                  backgroundColor: `${colors.success}15`,
                },
              ]}
            >
              <Text style={[styles.modalAvatarText, { color: colors.success }]}>
                {(selectedUser.fullName || selectedUser.username)
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.modalUserInfo}>
              <Text
                style={[styles.modalUserName, { color: colors.text.primary }]}
              >
                {selectedUser.fullName || selectedUser.username}
              </Text>
              <Text
                style={[
                  styles.modalUserEmail,
                  { color: colors.text.secondary },
                ]}
              >
                {selectedUser.email}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.modalBody}>
          <View
            style={[
              styles.detailCard,
              { backgroundColor: colors.card.background },
            ]}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="account-details"
                size={wp("5%")}
                color={colors.primary}
              />
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                İletişim Bilgileri
              </Text>
            </View>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="email"
                  size={wp("4%")}
                  color={colors.accent}
                />
                <View style={styles.infoContent}>
                  <Text
                    style={[styles.infoLabel, { color: colors.text.secondary }]}
                  >
                    E-posta
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: colors.text.primary }]}
                  >
                    {selectedUser.email}
                  </Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <MaterialCommunityIcons
                  name="account"
                  size={wp("4%")}
                  color={colors.accent}
                />
                <View style={styles.infoContent}>
                  <Text
                    style={[styles.infoLabel, { color: colors.text.secondary }]}
                  >
                    Kullanıcı Adı
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: colors.text.primary }]}
                  >
                    {selectedUser.username}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.detailCard,
              { backgroundColor: colors.card.background },
            ]}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="shield-check"
                size={wp("5%")}
                color={colors.success}
              />
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                Erişim İzinleri
              </Text>
            </View>
            <View
              style={[
                styles.permissionsList,
                { backgroundColor: `${colors.success}08` },
              ]}
            >
              <View style={styles.permissionItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={wp("3.5%")}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.permissionText,
                    { color: colors.text.secondary },
                  ]}
                >
                  İlaç takip geçmişini görüntüleme
                </Text>
              </View>
              <View style={styles.permissionItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={wp("3.5%")}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.permissionText,
                    { color: colors.text.secondary },
                  ]}
                >
                  Günlük ilaç durumu takibi
                </Text>
              </View>
              <View style={styles.permissionItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={wp("3.5%")}
                  color={colors.success}
                />
                <Text
                  style={[
                    styles.permissionText,
                    { color: colors.text.secondary },
                  ]}
                >
                  Hatırlatma bildirimleri alma
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.modalRemoveButton,
              { backgroundColor: `${colors.error}15` },
            ]}
            onPress={() => {
              closeModal();
              console.log("Blocking user:", selectedUser);
              handleBlockUser(
                selectedUser.id,
                selectedUser.fullName || selectedUser.username
              );
            }}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="account-remove-outline"
              size={wp("5%")}
              color={colors.error}
            />
            <Text
              style={[styles.modalRemoveButtonText, { color: colors.error }]}
            >
              Erişimi Kaldır
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
      <View style={styles.deviceSection}>
        <View style={styles.deviceHeader}>
          <View
            style={[
              styles.deviceIcon,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            <MaterialCommunityIcons
              name="tablet-dashboard"
              size={wp("6%")}
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

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.accent }]}>
            {approvedUsers.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
            Toplam Yakın Kişi
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyState}>
        <View
          style={[styles.emptyIcon, { backgroundColor: `${colors.primary}15` }]}
        >
          <MaterialCommunityIcons
            name="account-group-outline"
            size={wp("12%")}
            color={colors.primary}
          />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
          Henüz Kimse Eklenmemiş
        </Text>
        <Text
          style={[styles.emptyDescription, { color: colors.text.secondary }]}
        >
          Yakınlarınız size erişim isteği gönderdiğinde ve siz onayladığınızda
          bu kişiler burada görüntülenecek.
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
          Yetkili kişiler yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <FlatList
        data={approvedUsers}
        renderItem={renderUserItem}
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
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={closeModal}
        presentationStyle="pageSheet"
        statusBarTranslucent={false}
      >
        {renderModalContent()}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Genel Kapsayıcılar
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: wp("4%"), // DÜZELTME: Kenar boşlukları eklendi
    paddingBottom: hp("5%"),
  },

  // Header Alanı
  header: {
    marginBottom: hp("2%"),
    borderRadius: wp("4%"), // DÜZELTME: Köşeler yuvarlatıldı
    padding: wp("5%"), // DÜZELTME: İç boşluk artırıldı
  },
  deviceSection: {
    marginBottom: hp("2.5%"), // DÜZELTME: Alt boşluk artırıldı
  },
  deviceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    width: wp("12%"), // DÜZELTME: İkon alanı büyütüldü
    height: wp("12%"),
    borderRadius: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("4%"),
  },
  deviceInfo: {
    flex: 1,
  },
  deviceLabel: {
    fontSize: wp("3.5%"),
    fontWeight: "500",
    opacity: 0.8,
  },
  deviceName: {
    fontSize: wp("4.5%"), // DÜZELTME: Font büyütüldü
    fontWeight: "700",
  },
  deviceStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.6%"),
    borderRadius: wp("3%"),
  },
  statusDot: {
    width: wp("2%"),
    height: wp("2%"),
    borderRadius: wp("1%"),
    marginRight: wp("1.5%"),
  },
  statusLabel: {
    fontSize: wp("3%"),
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around", // DÜZELTME: Kenarlara yapışması engellendi
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: hp("2%"), // DÜZELTME: Üst boşluk eklendi
    borderColor: "#e0e0e030", // DÜZELTME: Ayırıcı çizgi rengi yumuşatıldı
  },
  statItem: {
    alignItems: "center",
    gap: hp("0.5%"), // DÜZELTME: Sayı ve etiket arası boşluk eklendi
  },
  statNumber: {
    fontSize: wp("4.5%"), // DÜZELTME: Font büyütüldü
    fontWeight: "700",
  },
  statLabel: {
    fontSize: wp("3.2%"),
    fontWeight: "500",
  },

  // Kullanıcı Kartı
  userCard: {
    padding: wp("4%"),
    borderRadius: wp("4%"), // DÜZELTME: Köşeler yuvarlatıldı
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: hp("2%"), // DÜZELTME: Kartlar arası boşluk artırıldı
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: wp("12%"), // DÜZELTME: Avatar büyütüldü
    height: wp("12%"),
    borderRadius: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("4%"), // DÜZELTME: Sağ boşluk artırıldı
  },
  avatarText: {
    fontSize: wp("5%"),
    fontWeight: "600",
  },
  crownIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  mainContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: {
    fontSize: wp("4.2%"), // DÜZELTME: Font büyütüldü
    fontWeight: "700",
  },
  ownerBadge: {
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("1.5%"),
  },
  ownerBadgeText: {
    fontSize: wp("3%"),
    fontWeight: "700",
  },
  roleBadge: {
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("4%"),
  },
  roleBadgeText: {
    fontSize: wp("3%"),
    fontWeight: "600",
  },
  userEmail: {
    fontSize: wp("3.5%"),
    marginTop: hp("0.6%"), // DÜZELTME: Üst boşluk artırıldı
    opacity: 0.7,
  },
  accessInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1.2%"), // DÜZELTME: Üst boşluk artırıldı
  },
  accessText: {
    fontSize: wp("3.2%"),
    marginLeft: wp("1.5%"),
    fontWeight: "500",
  },
  arrowIcon: {
    marginLeft: wp("3%"),
  },

  // Modal Stilleri
  modalContent: {
    flex: 1,
    paddingTop: hp("5%"),
  },
  modalHeader: {
    padding: wp("4%"),
    paddingTop: hp("3%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalHeaderCenter: {
    alignItems: "center",
    flex: 1,
  },
  modalAvatar: {
    width: wp("22%"),
    height: wp("22%"),
    borderRadius: wp("11%"),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: hp("2%"),
  },
  modalCrownIcon: {
    position: "absolute",
    top: -2,
    right: -2,
    zIndex: 1,
  },
  modalAvatarText: {
    fontSize: wp("8%"),
    fontWeight: "700",
  },
  modalUserInfo: {
    alignItems: "center",
    marginTop: hp("1.5%"),
  },
  modalUserName: {
    fontSize: wp("5.5%"),
    fontWeight: "700",
  },
  modalUserEmail: {
    fontSize: wp("3.8%"),
    marginTop: hp("0.5%"),
    opacity: 0.7,
  },
  closeButton: {
    position: "absolute",
    top: hp("1%"),
    right: wp("4%"),
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: wp("6%"),
    padding: wp("2%"),
  },
  modalBody: {
    padding: wp("5%"), // DÜZELTME: İç boşluk artırıldı
  },
  detailCard: {
    marginBottom: hp("2.5%"), // DÜZELTME: Kartlar arası boşluk artırıldı
    padding: wp("5%"),
    borderRadius: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"), // DÜZELTME: Alt boşluk artırıldı
  },
  cardTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    marginLeft: wp("3%"),
  },
  infoGrid: {
    gap: hp("2%"), // DÜZELTME: İletişim bilgileri arası boşluk artırıldı
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContent: {
    marginLeft: wp("4%"),
    flex: 1,
  },
  infoLabel: {
    fontSize: wp("3.2%"),
    fontWeight: "500",
    opacity: 0.7,
    marginBottom: hp("0.5%"), // DÜZELTME: Alt boşluk artırıldı
  },
  infoValue: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
  },
  permissionsList: {
    padding: wp("4%"),
    borderRadius: wp("3%"),
    gap: hp("1.5%"), // DÜZELTME: İzinler arası boşluk artırıldı
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionText: {
    fontSize: wp("3.6%"),
    marginLeft: wp("3%"),
    flex: 1,
    lineHeight: hp("2.5%"), // DÜZELTME: Satır yüksekliği eklendi
  },
  modalRemoveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1.8%"), // DÜZELTME: Buton yüksekliği artırıldı
    borderRadius: wp("3%"),
    marginTop: hp("3%"), // DÜZELTME: Üst boşluk belirgin şekilde artırıldı
  },
  modalRemoveButtonText: {
    fontWeight: "700",
    fontSize: wp("4%"),
    marginLeft: wp("2%"),
  },

  // Yükleme ve Boş Durum
  loadingText: {
    marginTop: hp("2%"),
    fontSize: wp("4%"),
    fontWeight: "600",
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp("10%"),
    paddingHorizontal: wp("5%"),
  },
  emptyState: {
    alignItems: "center",
    maxWidth: wp("85%"),
  },
  emptyIcon: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("7.5%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  emptyTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    marginBottom: hp("1.5%"),
  },
  emptyDescription: {
    fontSize: wp("3.8%"),
    textAlign: "center",
    lineHeight: hp("2.8%"), // DÜZELTME: Satır yüksekliği eklendi
    opacity: 0.7,
  },
});

export default ApprovedUsersScreen;
