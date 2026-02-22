import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Calendar, DateData } from "react-native-calendars";
import TimePicker from "../TimePicker";
import { useTheme } from "@/context/ThemeContext";
import ErrorModal from "../alNoMessages/ErrorModal";

const { width, height } = Dimensions.get("window");

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  quantity?: number; // İlaç stoğu/miktarı
  onValidation?: (isValid: boolean, message?: string) => void; // Validasyon durumunu üst bileşene bildirme
}

const IrregularScheduleForm: React.FC<Props> = ({
  formData,
  setFormData,
  quantity = 0,
  onValidation,
}) => {
  const { colors } = useTheme();
  const today = new Date().toISOString().split("T")[0];

  // State tanımlamaları
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [timeSelections, setTimeSelections] = useState<
    Record<string, string[]>
  >({});
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [timePickerVisible, setTimePickerVisible] = useState<boolean>(false);
  const [calendarExpanded, setCalendarExpanded] = useState<boolean>(true);
  const [selectedTimeValue, setSelectedTimeValue] = useState<string>("08:00");

  // Hata modalı state'leri
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Validasyon state'leri
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");
  const [totalDoses, setTotalDoses] = useState(0);

  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  // Sabitleri tanımlama
  const maxTotalTimes = quantity || formData.quantity || 0;
  const styles = createStyles(colors);

  // Tarih seçme/kaldırma işlevi
  const toggleDate = (date: string) => {
    const isSelected = selectedDates.includes(date);

    if (isSelected) {
      // Seçili tarihi kaldır
      setSelectedDates(selectedDates.filter((d: string) => d !== date));
      const newTimes = { ...timeSelections };
      delete newTimes[date];
      setTimeSelections(newTimes);
      if (activeDate === date) setActiveDate(null);

      // Animasyonları kapatma
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Yeni tarih seç
      setSelectedDates([...selectedDates, date]);
      setTimeSelections({ ...timeSelections, [date]: [] });
      setActiveDate(date);
      setTimePickerVisible(false);

      // Animasyonları açma
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Tarihe tıklama işlevi
  const handleDatePress = (date: string) => {
    if (selectedDates.includes(date)) {
      // Zaten seçili bir tarihe tıkladığında
      setActiveDate(date);

      // Animasyonları açma
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Yeni tarih seçimi
      toggleDate(date);
    }
  };

  // Validasyon, form verilerini güncelleme ve scheduleConfig oluşturma
  useEffect(() => {
    const currentTotal = Object.values(timeSelections).flat().length;
    setTotalDoses(currentTotal);

    let newIsValid = true;
    let newValidationMessage = "";

    // Miktar 0 veya tanımsızsa validasyonu atla
    if (maxTotalTimes > 0) {
      if (currentTotal < maxTotalTimes) {
        newIsValid = false;
        newValidationMessage =
          `Toplam ${maxTotalTimes} doz planlanmalı, şu anda ${currentTotal} doz seçildi. ` +
          `${maxTotalTimes - currentTotal} doz daha ekleyiniz.`;
      } else if (currentTotal > maxTotalTimes) {
        newIsValid = false;
        newValidationMessage =
          `Toplam ${maxTotalTimes} doz planlanmalı, ancak ${currentTotal} doz seçildi. ` +
          `${currentTotal - maxTotalTimes} doz kaldırınız.`;
      } else {
        newIsValid = true;
        newValidationMessage = `Mükemmel! ${currentTotal} doz  tamamlandı.`;
      }
    } else {
      newIsValid = true;
      newValidationMessage = "";
    }

    setIsValid(newIsValid);
    setValidationMessage(newValidationMessage);

    if (onValidation) {
      onValidation(newIsValid, newValidationMessage);
    }

    const intakeTimes = Object.entries(timeSelections).flatMap(
      ([date, times]) => times.map((time) => `${date}T${time}`)
    );

    setFormData((prev: any) => ({
      ...prev,
      scheduleConfig: {
        type: "irregular",
        intakeTimes: intakeTimes,
      },
      scheduleSummary: intakeTimes,
      regulatedSchedule: {
        totalDoses: currentTotal,
      },
      irregular: {
        selectedDates,
        timeSelections,
        totalPlannedDoses: currentTotal,
        isValid: newIsValid,
      },
    }));
  }, [timeSelections, selectedDates, maxTotalTimes]);

  // Saat ekleme işlevi
  const handleAddTime = (time: string) => {
    if (!activeDate) return;

    const currentTotal = Object.values(timeSelections).flat().length;
    if (maxTotalTimes > 0 && currentTotal >= maxTotalTimes) {
      setErrorTitle("Limit Aşıldı");
      setErrorMessage(`Toplam en fazla ${maxTotalTimes} zaman seçebilirsiniz.`);
      setErrorModalVisible(true);
      return;
    }

    const currentTimes = timeSelections[activeDate] || [];
    if (currentTimes.includes(time)) {
      setErrorTitle("Zaten Mevcut");
      setErrorMessage(`${time} saati zaten eklenmiş.`);
      setErrorModalVisible(true);
      return;
    }

    // Saatleri sıralayıp ekleme
    const sortedTimes = [...currentTimes, time].sort();

    const updated = {
      ...timeSelections,
      [activeDate]: sortedTimes,
    };

    setTimeSelections(updated);
    setTimePickerVisible(false);
    setSelectedTimeValue("08:00"); // Reset the time picker
  };

  // Saat silme işlevi
  const handleRemoveTime = (date: string, time: string) => {
    const updated = {
      ...timeSelections,
      [date]: timeSelections[date].filter((t) => t !== time),
    };
    setTimeSelections(updated);

    // Eğer silinen gün ve saate ait tüm saatler silindiyse, animasyonu güncelle
    if (updated[date].length === 0 && date === activeDate) {
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // Zaman seçiciyi açma/kapatma işlevi
  const toggleTimePicker = () => {
    setTimePickerVisible(!timePickerVisible);
  };

  // Takvimi genişletme/daraltma işlevi
  const toggleCalendarExpanded = () => {
    setCalendarExpanded(!calendarExpanded);
  };

  // Takvimde işaretlenen günleri belirleme işlevi
  const getMarkedDates = () => {
    const marks: any = {};
    selectedDates.forEach((date: string) => {
      marks[date] = {
        selected: true,
        selectedColor: colors.primary,
        marked: !!timeSelections[date]?.length,
        dotColor: "white",
        selectedTextColor: "white",
        customStyles: {
          container: {
            borderRadius: wp("2%"),
          },
          text: {
            fontWeight: "700",
          },
        },
      };

      // Aktif tarih için farklı renk
      if (date === activeDate) {
        marks[date].selectedColor = `${colors.accent}`;
      }
    });
    return marks;
  };

  const usedCount = Object.values(timeSelections).flat().length;

  // Takvimde seçilen günlerin karşılığı
  const hasSelectedDates = selectedDates.length > 0;

  // Animasyonlu container için stil
  const animatedContainerStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ErrorModal
        visible={errorModalVisible}
        title={errorTitle}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
      {/* Validasyon Mesajı */}
      {maxTotalTimes > 0 && (
        <View
          style={[styles.validationBox, !isValid && styles.validationError]}
        >
          <MaterialCommunityIcons
            name={isValid ? "information" : "alert-circle"}
            size={wp("5%")}
            color={isValid ? colors.accent : colors.error}
          />
          <Text
            style={[
              styles.validationText,
              !isValid && styles.validationErrorText,
            ]}
          >
            {validationMessage}
          </Text>
        </View>
      )}

      {/* Takvim Bölümü */}
      <View style={styles.calendarSection}>
        <View style={styles.calendarHeader}>
          <View style={styles.calendarTitleContainer}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={wp("5.5%")}
              color={colors.primary}
              style={styles.calendarIcon}
            />
            <Text style={styles.calendarTitle}>İlaç Alım Günleri</Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleCalendarExpanded}
          >
            <MaterialCommunityIcons
              name={calendarExpanded ? "chevron-up" : "chevron-down"}
              size={wp("6%")}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {calendarExpanded && (
          <View style={styles.calendarContent}>
            <Calendar
              minDate={today}
              theme={{
                todayTextColor: colors.primary,
                textDayFontSize: wp("3.8%"),
                textMonthFontSize: wp("4%"),
                textDayHeaderFontSize: wp("3.5%"),
                arrowColor: colors.primary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: "white",
                monthTextColor: colors.text.primary,
                indicatorColor: colors.primary,
                dayTextColor: colors.text.primary,
                textSectionTitleColor: colors.text.secondary,
                "stylesheet.calendar.header": {
                  week: {
                    marginTop: 5,
                    flexDirection: "row",
                    justifyContent: "space-around",
                  },
                },
              }}
              markedDates={getMarkedDates()}
              onDayPress={(day: { dateString: string }) => {
                handleDatePress(day.dateString);
              }}
            />
          </View>
        )}
      </View>

      {/* Zaman Seçimi Bölümü */}
      {hasSelectedDates && (
        <View style={styles.timeSelectionSection}>
          <View style={styles.timeSelectionHeader}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={wp("5.5%")}
                color={colors.primary}
                style={styles.timeSelectionIcon}
              />
              <Text style={styles.timeSelectionTitle}>Zaman Seçimi</Text>
            </View>
          </View>

          <View style={styles.timeSelectionContent}>
            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information-outline"
                size={wp("4.5%")}
                color={colors.accent}
                style={{ marginRight: wp("2%") }}
              />
              <Text style={styles.infoText}>
                Kalan saat seçim hakkınız:{" "}
                <Text style={styles.infoHighlight}>
                  {maxTotalTimes - usedCount}
                </Text>
              </Text>
            </View>

            {activeDate ? (
              <Animated.View
                style={[styles.activeDateContainer, animatedContainerStyle]}
              >
                <View style={styles.activeDateHeader}>
                  <View style={styles.activeDateInfo}>
                    <MaterialCommunityIcons
                      name="calendar-check-outline"
                      size={wp("4.5%")}
                      color={colors.primary}
                    />
                    <Text style={styles.activeDateLabel}>{activeDate}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={toggleTimePicker}
                  >
                    <MaterialCommunityIcons
                      name={
                        timePickerVisible
                          ? "clock-remove-outline"
                          : "clock-plus-outline"
                      }
                      size={wp("5%")}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                {timePickerVisible ? (
                  <View style={styles.timePickerContainer}>
                    <TimePicker
                      value={selectedTimeValue}
                      onChange={(time: string) => {
                        setSelectedTimeValue(time);
                      }}
                    />
                    <TouchableOpacity
                      style={[styles.actionButton, { marginTop: hp("1.5%") }]}
                      onPress={() => handleAddTime(selectedTimeValue)}
                    >
                      <MaterialCommunityIcons
                        name="clock-check-outline"
                        size={wp("4.5%")}
                        color="#fff"
                      />
                      <Text style={styles.actionButtonText}>Saati Ekle</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={toggleTimePicker}
                  >
                    <MaterialCommunityIcons
                      name="clock-plus-outline"
                      size={wp("4.5%")}
                      color={colors.primary}
                    />
                    <Text style={styles.timePickerButtonText}>Saat Ekle</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.selectedTimesContainer}>
                  <Text style={styles.selectedTimesLabel}>
                    Seçilen saatler:
                  </Text>

                  {(timeSelections[activeDate || ""] || []).length > 0 ? (
                    <View style={styles.timesList}>
                      {timeSelections[activeDate || ""].map((time: string) => (
                        <TouchableOpacity
                          key={time}
                          style={styles.timeItemContainer}
                          onPress={() =>
                            handleRemoveTime(activeDate || "", time)
                          }
                        >
                          <Text style={styles.timeItemText}>{time}</Text>
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={wp("4%")}
                            color={colors.error || "red"}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.emptyMessage}>
                      Henüz saat eklenmedi
                    </Text>
                  )}
                </View>
              </Animated.View>
            ) : (
              <View style={styles.noDateSelectedContainer}>
                <MaterialCommunityIcons
                  name="gesture-tap"
                  size={wp("6%")}
                  color={colors.text.tertiary || "#999"}
                  style={{ marginBottom: hp("1%") }}
                />
                <Text style={styles.noDateSelectedText}>
                  Zaman eklemek için önce takvimden bir gün seçin
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Özet Bölümü - Seçilen gün ve saatlerin listesi */}
      {Object.keys(timeSelections).length > 0 && (
        <View style={styles.scheduleSummaryContainer}>
          <View style={styles.scheduleSummaryHeader}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons
                name="format-list-checks"
                size={wp("5.5%")}
                color={colors.primary}
                style={styles.scheduleSummaryIcon}
              />
              <Text style={styles.scheduleSummaryTitle}>
                Özetlenmiş Program
              </Text>
            </View>
          </View>

          <View style={styles.scheduleSummaryContent}>
            {Object.keys(timeSelections)
              .filter((day) => timeSelections[day]?.length > 0)
              .sort()
              .map((day: string) => (
                <View key={day} style={styles.dayItemContainer}>
                  <View style={styles.dayItemHeader}>
                    <MaterialCommunityIcons
                      name="calendar-check"
                      size={wp("5%")}
                      color={colors.primary}
                    />
                    <Text style={styles.dayItemLabel}>
                      {new Date(day).toLocaleDateString("tr-TR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>

                  {timeSelections[day]?.length > 0 && (
                    <View style={styles.dayItemTimesContainer}>
                      {timeSelections[day].map((time: string) => (
                        <TouchableOpacity
                          key={`${day}-${time}`}
                          style={styles.timeItemContainer}
                          onPress={() => handleRemoveTime(day, time)}
                        >
                          <Text style={styles.timeItemText}>{time}</Text>
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={wp("4%")}
                            color={colors.error || "red"}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default IrregularScheduleForm;

// Sabit stil değerleri
const SHADOWS = {
  light: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};

// Dinamik stil oluşturucu fonksiyon
const createStyles = (colors: any) =>
  StyleSheet.create({
    // Ana konteyner
    container: {
      padding: wp("3%"),
      paddingBottom: wp("6%"),
    },
    validationBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.accent}15`,
      padding: wp("3%"),
      margin: wp("2%"),
      borderRadius: wp("2%"),
    },
    validationError: {
      backgroundColor: `${colors.error}15`,
    },
    validationText: {
      flex: 1,
      fontSize: wp("3.5%"),
      color: colors.accent,
      marginLeft: wp("2%"),
      lineHeight: wp("5%"),
    },
    validationErrorText: {
      color: colors.error,
    },
    actionContainer: {
      alignItems: "center",
      marginVertical: hp("1%"),
    },
    fixButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.accent,
      paddingVertical: hp("1%"),
      paddingHorizontal: wp("4%"),
      borderRadius: wp("5%"),
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    fixButtonText: {
      color: "#fff",
      fontSize: wp("3.8%"),
      fontWeight: "600",
      marginLeft: wp("2%"),
    },

    // Takvim bölümü
    calendarSection: {
      marginBottom: hp("2%"),
      borderRadius: wp("3%"),
      backgroundColor: colors.background.primary,
      ...SHADOWS.light.medium,
      overflow: "hidden",
    },
    calendarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: wp("4%"),
      backgroundColor: `${colors.primary}10`,
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.primary}40`,
    },
    calendarTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: colors.text.primary,
      flex: 1,
    },
    calendarTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    calendarIcon: {
      marginRight: wp("2%"),
    },
    calendarContent: {
      padding: wp("3%"),
    },
    calendarToggle: {
      padding: wp("2%"),
    },

    // Tarih seçimi bölümü
    timeSelectionSection: {
      marginTop: hp("2%"),
      borderRadius: wp("3%"),
      backgroundColor: colors.background.primary,
      overflow: "hidden",
      ...SHADOWS.light.medium,
    },
    timeSelectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: wp("4%"),
      backgroundColor: `${colors.primary}10`,
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.primary}40`,
    },
    timeSelectionTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: colors.text.primary,
      flex: 1,
    },
    timeSelectionIcon: {
      marginRight: wp("2%"),
    },
    timeSelectionContent: {
      padding: wp("4%"),
    },

    // Bilgi kutusu
    infoBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.accent}10`,
      borderRadius: wp("2%"),
      padding: wp("3%"),
      marginBottom: hp("2%"),
    },
    infoText: {
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
      flex: 1,
    },
    infoHighlight: {
      fontWeight: "700",
      color: colors.accent,
    },

    // Aktif tarih bölümü
    activeDateContainer: {
      marginBottom: hp("2%"),
      borderRadius: wp("2%"),
      backgroundColor: `${colors.background.secondary}50`,
      overflow: "hidden",
    },
    activeDateHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: wp("3%"),
      backgroundColor: `${colors.primary}08`,
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.secondary}30`,
    },
    activeDateInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    activeDateLabel: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: colors.text.primary,
      marginLeft: wp("2%"),
    },

    // Zaman seçici
    timePickerContainer: {
      padding: wp("3%"),
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.secondary}30`,
    },
    timePickerButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${colors.primary}15`,
      padding: wp("3%"),
      borderRadius: wp("1.5%"),
      marginBottom: hp("1%"),
    },
    timePickerButtonText: {
      fontSize: wp("3.8%"),
      color: colors.primary,
      fontWeight: "500",
      marginLeft: wp("2%"),
    },

    // Seçilen zamanlar listesi
    selectedTimesContainer: {
      padding: wp("3%"),
    },
    selectedTimesLabel: {
      fontSize: wp("3.8%"),
      fontWeight: "500",
      color: colors.text.secondary,
      marginBottom: hp("1%"),
      marginLeft: wp("1%"),
    },
    timesList: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    timeItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.background.primary}90`,
      borderRadius: wp("6%"),
      paddingVertical: wp("1.5%"),
      paddingHorizontal: wp("3%"),
      margin: wp("1%"),
      ...SHADOWS.light.small,
    },
    timeItemText: {
      fontSize: wp("3.5%"),
      color: colors.text.primary,
      marginRight: wp("2%"),
    },

    // Gün ve zamanlar listesi
    scheduleSummaryContainer: {
      marginTop: hp("2%"),
      borderRadius: wp("3%"),
      backgroundColor: colors.background.primary,
      overflow: "hidden",
      ...SHADOWS.light.medium,
    },
    scheduleSummaryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: wp("4%"),
      backgroundColor: `${colors.primary}10`,
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.primary}40`,
    },
    scheduleSummaryTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: colors.text.primary,
      flex: 1,
    },
    scheduleSummaryIcon: {
      marginRight: wp("2%"),
    },
    scheduleSummaryContent: {
      padding: wp("2%"),
    },
    dayItemContainer: {
      marginBottom: hp("1.5%"),
      borderRadius: wp("2%"),
      backgroundColor: `${colors.background.secondary}50`,
      overflow: "hidden",
    },
    dayItemHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("3%"),
      backgroundColor: `${colors.primary}08`,
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.secondary}30`,
    },
    dayItemLabel: {
      fontSize: wp("3.8%"),
      fontWeight: "600",
      color: colors.text.primary,
      marginLeft: wp("2%"),
      flex: 1,
    },
    dayItemTimesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: wp("2%"),
    },

    // Mesajlar
    noDateSelectedContainer: {
      alignItems: "center",
      padding: wp("5%"),
      backgroundColor: `${colors.background.secondary}30`,
      borderRadius: wp("2%"),
    },
    noDateSelectedText: {
      fontSize: wp("3.5%"),
      color: colors.text.tertiary,
      textAlign: "center",
    },
    emptyMessage: {
      color: colors.text.tertiary,
      fontSize: wp("3.5%"),
      fontStyle: "italic",
      textAlign: "center",
      padding: wp("3%"),
    },

    // Butonlar
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: wp("2.5%"),
      borderRadius: wp("1.5%"),
      backgroundColor: colors.primary,
      ...SHADOWS.light.small,
    },
    actionButtonText: {
      color: "white",
      fontSize: wp("3.8%"),
      fontWeight: "600",
      marginLeft: wp("2%"),
    },
    secondaryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: wp("2.5%"),
      borderRadius: wp("1.5%"),
      backgroundColor: `${colors.primary}15`,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    secondaryButtonText: {
      color: colors.primary,
      fontSize: wp("3.8%"),
      fontWeight: "500",
      marginLeft: wp("2%"),
    },

    // Genel stil
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    divider: {
      height: 1,
      backgroundColor: `${colors.border.primary}30`,
      marginVertical: hp("2%"),
    },
    iconButton: {
      padding: wp("2%"),
    },
  });
