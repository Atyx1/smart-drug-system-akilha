import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MenuOptions from "../MenuOptions";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";
import { useTheme } from "@/context/ThemeContext";

const { width } = Dimensions.get("window");

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  quantity?: number; // İlaç stoğu/miktarı
  onValidation?: (isValid: boolean, message?: string) => void; // Validasyon durumunu üst bileşene bildirme
}

const intervalOptions = [
  { label: "Her gün", value: 1 },
  { label: "2 günde bir", value: 2 },
  { label: "3 günde bir", value: 3 },
  { label: "4 günde bir", value: 4 },
];

const timesPerDayOptions = [
  { label: "1 kez", value: 1 },
  { label: "2 kez", value: 2 },
  { label: "3 kez", value: 3 },
  { label: "4 kez", value: 4 },
];

const hourGapOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${i} saat`,
  value: i,
}));

const minuteGapOptions = Array.from({ length: 60 }, (_, i) => ({
  label: `${i} dk`,
  value: i,
}));

const RegularScheduleForm: React.FC<Props> = ({
  formData,
  setFormData,
  quantity = 0,
  onValidation,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Temel state'ler - formData'dan initialize et
  const [intervalDays, setIntervalDays] = useState(
    formData.scheduleConfig?.intervalDays || 1
  );
  const [timesPerDay, setTimesPerDay] = useState(
    formData.scheduleConfig?.timesPerDay || 1
  );
  const [hourGap, setHourGap] = useState(formData.scheduleConfig?.hourGap || 8);
  const [minuteGap, setMinuteGap] = useState(
    formData.scheduleConfig?.minuteGap || 0
  );
  const [startDate, setStartDate] = useState(() => {
    if (formData.scheduleConfig?.startDate) {
      return new Date(formData.scheduleConfig.startDate);
    }
    // Default olarak yarını döndür
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [startTime, setStartTime] = useState(
    formData.scheduleConfig?.firstTime || "08:00"
  );

  // Validasyon state'leri
  const [validationMessage, setValidationMessage] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [totalDoses, setTotalDoses] = useState(0); // Toplam doz sayısı

  // UI state'leri
  const [sectionsExpanded, setSectionsExpanded] = useState({
    intervalSection: true,
    timeSection: true,
    dateSection: true,
  });
  type SectionKey = "intervalSection" | "timeSection" | "dateSection";
  const [activeSection, setActiveSection] = useState<null | SectionKey>(null);

  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Bölüm açılıp/kapanma durumunu değiştirme
  const toggleSection = (section: SectionKey) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

    // Açılıp/kapanma animasyonu
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Aktif bölüm seçme
  const setActive = (section: SectionKey | null) => {
    if (activeSection === section) {
      setActiveSection(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setActiveSection(section);
      Animated.timing(fadeAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // İşlev özetini oluşturma
  const getScheduleSummary = () => {
    // Gün aralığı metni
    let intervalText = "";
    if (intervalDays === 1) {
      intervalText = "Her gün";
    } else {
      intervalText = `${intervalDays} günde bir`;
    }

    // Günlük alım sayısı metni
    let timesText = `günde ${timesPerDay} kez`;

    // Saat aralığı metni
    let gapText = "";
    if (timesPerDay > 1) {
      const hours = hourGap > 0 ? `${hourGap} saat` : "";
      const minutes = minuteGap > 0 ? `${minuteGap} dakika` : "";
      const connector = hours && minutes ? " " : "";
      gapText = `, ${hours}${connector}${minutes} arayla`;
    }

    // Başlangıç tarihi
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateText = "";
    if (startDate.toDateString() === today.toDateString()) {
      dateText = "bugün";
    } else if (startDate.toDateString() === tomorrow.toDateString()) {
      dateText = "yarın";
    } else {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      dateText = startDate.toLocaleDateString("tr-TR", options);
    }

    // İlk alım saati
    const timeText = `ilk doz: ${startTime}`;

    return {
      intervalText,
      timesText,
      gapText,
      dateText,
      timeText,
      fullText: `${intervalText} ${timesText}${gapText}, başlangıç: ${dateText}, ${timeText}`,
    };
  };

  // Hesaplanan verileri tutmak için state
  const [calculatedSchedule, setCalculatedSchedule] = useState<any>(null);

  // 1. Hesaplamaları yapan ve sonucu state'e yazan useEffect
  useEffect(() => {
    const [hourStr] = startTime.split(":");
    const startHour = parseInt(hourStr, 10);

    const today = new Date(startDate);
    const days = [];
    let dosesCount = 0;
    const maxDays = 30;

    for (let i = 0; i < maxDays; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      if (i % intervalDays === 0) {
        days.push(currentDate);
        dosesCount += timesPerDay;
      }
      if (quantity > 0 && dosesCount >= quantity) {
        break;
      }
    }

    let newIsValid = true;
    let newValidationMessage = "";
    if (quantity > 0) {
      if (dosesCount < quantity) {
        newIsValid = false;
        newValidationMessage = `Seçilen ayarlarla ${dosesCount} doz planlanabilir. Tüm ${quantity} dozu planlamak için lütfen günlük doz sayısını artırın veya gün aralığını azaltın.`;
      } else if (dosesCount > quantity) {
        newIsValid = true;
        newValidationMessage = `Dikkat: Seçilen ayarlarla ${dosesCount} doz planlanacak, fakat ilaç miktarınız ${quantity}. İlk ${quantity} doz planlanacak.`;
      } else {
        newIsValid = true;
        newValidationMessage = `Mükemmel! Tam olarak ${quantity} dozun tamamı planlanacak.`;
      }
    }

    setTotalDoses(dosesCount);
    setIsValid(newIsValid);
    setValidationMessage(newValidationMessage);

    setCalculatedSchedule({
      scheduleConfig: {
        type: "regular",
        intervalDays,
        timesPerDay,
        hourGap,
        minuteGap,
        startDate: startDate.toISOString(),
        firstTime: startTime,
        startHour,
      },
      regulatedSchedule: {
        startDate,
        startTime,
        intervalDays,
        timesPerDay,
        hourGap,
        minuteGap,
        totalDoses: quantity > 0 ? Math.min(dosesCount, quantity) : dosesCount,
        daysNeeded: days.length,
      },
      isValid: newIsValid,
      validationMessage: newValidationMessage,
    });
  }, [
    intervalDays,
    timesPerDay,
    hourGap,
    minuteGap,
    startDate,
    startTime,
    quantity,
  ]);

  // 2. Hesaplanan verileri üst bileşene ileten useEffect
  // Bu, hesaplama ve iletme mantığını ayırarak sonsuz döngüyü engeller.
  useEffect(() => {
    if (calculatedSchedule) {
      if (onValidation) {
        onValidation(
          calculatedSchedule.isValid,
          calculatedSchedule.validationMessage
        );
      }
      setFormData((prev: any) => ({
        ...prev,
        scheduleConfig: calculatedSchedule.scheduleConfig,
        regulatedSchedule: calculatedSchedule.regulatedSchedule,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatedSchedule]);

  // Zaman çizelgesi veri tipi tanımlama
  interface TimelineDay {
    date: Date;
    isToday: boolean;
    times: string[];
    remaining: number | null;
  }

  // Gün bazlı zaman çizelgesi oluşturma
  const generateTimelineData = (): TimelineDay[] => {
    let timelineDays: TimelineDay[] = [];
    let plannedDoses = 0;
    const maxPreviewDoses = quantity > 0 ? quantity : 30; // Önizleme için doz limiti

    const totalIntervalInMinutes = (hourGap || 0) * 60 + (minuteGap || 0);

    const firstDoseDate = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    firstDoseDate.setHours(startHours, startMinutes, 0, 0);

    let lastDoseTime = new Date(firstDoseDate);
    let dayOffset = 0;

    // Dozları hesapla
    while (plannedDoses < maxPreviewDoses) {
      const currentDayBase = new Date(startDate);
      currentDayBase.setDate(currentDayBase.getDate() + dayOffset);
      const [h, m] = startTime.split(":").map(Number);
      currentDayBase.setHours(h, m, 0, 0);

      for (
        let doseInDay = 0;
        doseInDay < timesPerDay && plannedDoses < maxPreviewDoses;
        doseInDay++
      ) {
        let nextDoseTime;
        if (doseInDay === 0) {
          nextDoseTime = currentDayBase;
        } else {
          nextDoseTime = new Date(
            lastDoseTime.getTime() + totalIntervalInMinutes * 60000
          );
        }

        // Takvim verisine ekle
        const dayKey = nextDoseTime.toISOString().split("T")[0];
        let dayData = timelineDays.find(
          (d) => d.date.toISOString().split("T")[0] === dayKey
        );

        if (!dayData) {
          const dayDate = new Date(nextDoseTime);
          dayDate.setHours(0, 0, 0, 0);
          dayData = {
            date: dayDate,
            isToday: dayDate.toDateString() === new Date().toDateString(),
            times: [],
            remaining: null,
          };
          timelineDays.push(dayData);
        }

        const timeString = `${nextDoseTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${nextDoseTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        if (!dayData.times.includes(timeString)) {
          dayData.times.push(timeString);
        }

        lastDoseTime = nextDoseTime;
        plannedDoses++;
      }

      dayOffset += intervalDays;

      if (timelineDays.length > 7) break;
    }

    timelineDays.sort((a, b) => a.date.getTime() - b.date.getTime());
    timelineDays.forEach((day) => day.times.sort());

    return timelineDays;
  };

  // Özet bilgiler
  const summary = getScheduleSummary();

  // Timeline veri
  const timelineData = generateTimelineData();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Özet Bilgiler */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <MaterialCommunityIcons
            name="information-outline"
            size={wp("5.5%")}
            color={colors.primary}
          />
          <Text style={styles.summaryTitle}>İlaç Programınız</Text>
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryText}>{summary.fullText}</Text>
        </View>
      </View>

      {/* Sıklık Ayarları Bölümü */}
      <Animated.View
        style={[styles.sectionCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection("intervalSection")}
          activeOpacity={0.8}
        >
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons
              name="calendar-sync"
              size={wp("5.5%")}
              color={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Kullanım Sıklığı</Text>
          </View>

          <MaterialCommunityIcons
            name={
              sectionsExpanded.intervalSection ? "chevron-up" : "chevron-down"
            }
            size={wp("6%")}
            color={colors.primary}
          />
        </TouchableOpacity>

        {sectionsExpanded.intervalSection && (
          <View style={styles.sectionContent}>
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons
                  name="calendar-range"
                  size={wp("4.5%")}
                  color={colors.text.secondary}
                />
                <Text style={styles.inputLabel}>Kaç Günde Bir?</Text>
              </View>
              <View style={styles.pickerWrapper}>
                <MenuOptions
                  data={intervalOptions}
                  placeholder="Seçiniz"
                  defaultValue={intervalDays}
                  iconName="calendar-alt"
                  onChange={(value) => setIntervalDays(Number(value))}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons
                  name="pill"
                  size={wp("4.5%")}
                  color={colors.text.secondary}
                />
                <Text style={styles.inputLabel}>Günde Kaç Kez?</Text>
              </View>
              <View style={styles.pickerWrapper}>
                <MenuOptions
                  data={timesPerDayOptions}
                  placeholder="Seçiniz"
                  defaultValue={timesPerDay}
                  iconName="clock"
                  onChange={(value) => setTimesPerDay(Number(value))}
                />
              </View>
            </View>

            {timesPerDay > 1 && (
              <View style={styles.formGroup}>
                <View style={styles.labelContainer}>
                  <MaterialCommunityIcons
                    name="clock-time-eight-outline"
                    size={wp("4.5%")}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.inputLabel}>Tekrarlama Aralığı</Text>
                </View>
                <View style={styles.intervalPickerContainer}>
                  <View style={styles.pickerBox}>
                    <MenuOptions
                      key={`hour-${hourGap}`}
                      data={hourGapOptions}
                      placeholder="Saat"
                      defaultValue={hourGap}
                      onChange={(value) =>
                        timesPerDay > 1 && setHourGap(Number(value))
                      }
                    />
                  </View>
                  <Text style={styles.intervalSeparator}>:</Text>
                  <View style={styles.pickerBox}>
                    <MenuOptions
                      key={`minute-${minuteGap}`}
                      data={minuteGapOptions}
                      placeholder="Dakika"
                      defaultValue={minuteGap}
                      onChange={(value) =>
                        timesPerDay > 1 && setMinuteGap(Number(value))
                      }
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={wp("4%")}
                color={colors.accent}
              />
              <Text style={styles.infoText}>
                {intervalDays === 1 ? "Her gün" : `${intervalDays} günde bir`}
                {timesPerDay} doz ilaç alacaksınız
                {timesPerDay > 1
                  ? `, aralarında ${hourGap} saat ${minuteGap} dakika`
                  : ""}
              </Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Başlangıç Zamanı Bölümü */}
      <Animated.View
        style={[styles.sectionCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection("dateSection")}
          activeOpacity={0.8}
        >
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={wp("5.5%")}
              color={colors.primary}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Başlangıç Zamanı</Text>
          </View>

          <MaterialCommunityIcons
            name={sectionsExpanded.dateSection ? "chevron-up" : "chevron-down"}
            size={wp("6%")}
            color={colors.primary}
          />
        </TouchableOpacity>

        {sectionsExpanded.dateSection && (
          <View style={styles.sectionContent}>
            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons
                  name="calendar-today"
                  size={wp("4.5%")}
                  color={colors.text.secondary}
                />
                <Text style={styles.inputLabel}>İlk Gün</Text>
              </View>
              <View style={styles.dateTimePickerContainer}>
                <DatePicker
                  mode="single"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelContainer}>
                <MaterialCommunityIcons
                  name="clock-start"
                  size={wp("4.5%")}
                  color={colors.text.secondary}
                />
                <Text style={styles.inputLabel}>İlk İlaç Saati</Text>
              </View>
              <View style={styles.dateTimePickerContainer}>
                <TimePicker value={startTime} onChange={setStartTime} />
              </View>
            </View>

            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information-outline"
                size={wp("4%")}
                color={colors.accent}
              />
              <Text style={styles.infoText}>
                İlk ilaç dozunuz{" "}
                <Text style={styles.highlightText}>{summary.dateText}</Text>{" "}
                saat <Text style={styles.highlightText}>{startTime}</Text> için
                planlandı
              </Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Kullanım Takvimi Önizleme */}
      <View style={styles.previewCard}>
        <View style={styles.previewHeader}>
          <MaterialCommunityIcons
            name="calendar-check-outline"
            size={wp("5.5%")}
            color={colors.primary}
          />
          <Text style={styles.previewTitle}>Kullanım Takvimi</Text>
        </View>
        <View style={styles.previewContent}>
          <View style={styles.timelineContainer}>
            {generateTimelineData().map((day, index: number) => {
              const isToday =
                new Date().toDateString() === day.date.toDateString();

              return (
                <View key={index} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDate,
                      isToday && styles.timelineToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timelineDateText,
                        isToday && styles.timelineTodayText,
                      ]}
                    >
                      {day.date.getDate()}
                    </Text>
                    <Text
                      style={[
                        styles.timelineDayText,
                        isToday && styles.timelineTodayText,
                      ]}
                    >
                      {
                        ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cts"][
                          day.date.getDay()
                        ]
                      }
                    </Text>
                  </View>
                  <View style={styles.timelineDoses}>
                    {day.times.map((time: string, doseIndex: number) => {
                      return (
                        <View key={doseIndex} style={styles.timelineDose}>
                          <MaterialCommunityIcons
                            name="pill"
                            size={wp("4%")}
                            color={colors.primary}
                          />
                          <Text style={styles.timelineDoseText}>{time}</Text>
                        </View>
                      );
                    })}

                    {/* Kalan doz bilgisi */}
                    {day.remaining !== null && day.remaining >= 0 && (
                      <Text style={styles.remainingText}>
                        {day.remaining === 0
                          ? "Tüm dozlar tamamlandı."
                          : `Bu günden sonra ${day.remaining} doz kaldı.`}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.previewFooterText}>
            7 günlük kullanım planı gösteriliyor
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegularScheduleForm;

// SHADOWS sabitini oluştur
const SHADOWS = {
  light: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
  },
  dark: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
    },
  },
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    scrollContainer: {
      paddingBottom: hp("5%"),
      paddingHorizontal: wp("2%"),
    },
    // Eski stil tanımlamaları (geriye dönük uyumluluk için bırakıldı)
    formGroup: {
      marginBottom: hp("2.5%"),
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("1%"),
    },
    label: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: colors.text.primary,
      marginLeft: wp("2%"),
    },
    pickerContainer: {
      backgroundColor: `${colors.background.primary}95`,
      borderRadius: wp("2%"),
      borderWidth: 1,
      borderColor: colors.border.secondary,
      padding: wp("2%"),
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 1 }),
    },

    // Özet kart stili
    summaryCard: {
      backgroundColor: `${colors.background.primary}95`,
      borderRadius: wp("3%"),
      marginBottom: hp("2%"),
      borderWidth: 1,
      borderColor: `${colors.border.secondary}40`,
      overflow: "hidden",
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 2 }),
    },
    summaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("3%"),
      paddingBottom: wp("2%"),
      backgroundColor: `${colors.primary}10`,
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.secondary}30`,
    },
    summaryTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: colors.text.primary,
      marginLeft: wp("2%"),
    },
    summaryContent: {
      padding: wp("3%"),
    },
    summaryText: {
      fontSize: wp("3.8%"),
      color: colors.text.secondary,
      lineHeight: wp("5.5%"),
    },

    // Bölüm kartı stilleri
    sectionCard: {
      backgroundColor: `${colors.background.primary}95`,
      borderRadius: wp("3%"),
      marginBottom: hp("2%"),
      borderWidth: 1,
      borderColor: `${colors.border.secondary}40`,
      overflow: "hidden",
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 2 }),
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: wp("3%"),
      backgroundColor: `${colors.primary}10`,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    sectionIcon: {
      marginRight: wp("2%"),
      opacity: 0.9,
    },
    sectionTitle: {
      fontSize: wp("4.3%"),
      fontWeight: "600",
      color: colors.text.primary,
    },
    sectionContent: {
      padding: wp("3%"),
      backgroundColor: `${colors.background.primary}98`,
    },

    // Form alanları
    pickerWrapper: {
      backgroundColor: `${colors.background.primary}95`,
      borderRadius: wp("2%"),
      borderWidth: 1,
      borderColor: `${colors.border.secondary}70`,
      padding: wp("1.5%"),
      marginTop: wp("1%"),
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 1 }),
    },
    dateTimePickerContainer: {
      backgroundColor: `${colors.background.primary}95`,
      borderRadius: wp("2%"),
      borderWidth: 1,
      borderColor: `${colors.border.secondary}70`,
      padding: wp("1.5%"),
      marginTop: wp("1%"),
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 1 }),
    },
    inputLabel: {
      fontSize: wp("3.8%"),
      color: colors.text.secondary,
      marginLeft: wp("2%"),
      fontWeight: "500",
    },

    // Bilgi kutusu
    infoBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.accent}10`,
      padding: wp("3%"),
      borderRadius: wp("2%"),
      marginTop: wp("3%"),
    },
    infoText: {
      flex: 1,
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
      marginLeft: wp("2%"),
      lineHeight: wp("5%"),
    },
    highlightText: {
      fontWeight: "600",
      color: colors.text.primary,
    },

    // Takvim önizleme bölümü
    previewCard: {
      backgroundColor: `${colors.background.primary}95`,
      borderRadius: wp("3%"),
      marginVertical: hp("1%"),
      borderWidth: 1,
      borderColor: `${colors.border.secondary}40`,
      overflow: "hidden",
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 2 }),
    },
    previewHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("3%"),
      paddingBottom: wp("2%"),
      backgroundColor: `${colors.primary}10`,
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.secondary}30`,
    },
    previewTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: colors.text.primary,
      marginLeft: wp("2%"),
    },
    previewContent: {
      padding: wp("3%"),
    },
    timelineContainer: {
      marginBottom: hp("1%"),
    },
    timelineItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: hp("1.5%"),
      borderBottomWidth: 1,
      borderBottomColor: `${colors.border.secondary}20`,
      paddingBottom: hp("1.5%"),
    },
    timelineDate: {
      width: wp("12%"),
      height: wp("12%"),
      borderRadius: wp("6%"),
      backgroundColor: `${colors.background.secondary}50`,
      alignItems: "center",
      justifyContent: "center",
      marginRight: wp("3%"),
      borderWidth: 1,
      borderColor: `${colors.border.secondary}30`,
    },
    timelineToday: {
      backgroundColor: `${colors.primary}30`,
      borderColor: colors.primary,
    },
    timelineDateText: {
      fontSize: wp("5%"),
      fontWeight: "600",
      color: colors.text.secondary,
    },
    timelineDayText: {
      fontSize: wp("3%"),
      color: colors.text.tertiary,
      marginTop: -wp("1%"),
    },
    timelineTodayText: {
      color: colors.primary,
    },
    timelineDoses: {
      flex: 1,
    },
    timelineDose: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.primary}10`,
      padding: wp("2%"),
      borderRadius: wp("2%"),
      marginBottom: hp("0.5%"),
    },
    timelineDoseText: {
      fontSize: wp("3.5%"),
      color: colors.text.secondary,
      marginLeft: wp("2%"),
      fontWeight: "500",
    },
    previewFooterText: {
      fontSize: wp("3.2%"),
      color: colors.text.tertiary,
      textAlign: "center",
      marginTop: hp("1%"),
      fontStyle: "italic",
    },
    remainingText: {
      fontSize: wp("3.2%"),
      color: colors.accent,
      fontStyle: "italic",
      marginTop: hp("0.5%"),
      marginLeft: wp("1%"),
    },
    validationBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.accent}15`,
      padding: wp("3%"),
      margin: wp("3%"),
      marginTop: 0,
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
      marginTop: hp("2%"),
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
    formRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: hp("1%"),
    },
    intervalPickerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input.background,
      borderRadius: wp("3%"),
      borderWidth: 1,
      borderColor: colors.input.border,
      paddingHorizontal: wp("1%"),
      paddingVertical: Platform.OS === "ios" ? hp("0.8%") : hp("0.5%"),
    },
    pickerBox: {
      flex: 1,
      alignItems: "stretch",
    },
    intervalSeparator: {
      fontSize: wp("5%"),
      color: colors.text.secondary,
      fontWeight: "bold",
      marginHorizontal: wp("2%"),
    },
  });
