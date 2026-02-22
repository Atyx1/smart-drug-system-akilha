// src/screens/receipt/steps/DateNavigationBar.tsx

import React, { useMemo, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { format, isEqual } from "date-fns";
import { tr } from "date-fns/locale";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { DateNavigationBarProps } from "@/types/Types";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/localization/i18n";

const NoDataMessage: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);
  return (
    <View style={styles.noDataContainer}>
      <MaterialIcons
        name="event-busy"
        size={wp("6%")}
        color={colors.text.tertiary}
      />
      <Text style={styles.noDataText}>{t("no_receipts_on_this_date")}</Text>
    </View>
  );
};

const DateNavigationBar: React.FC<DateNavigationBarProps> = ({
  startDate,
  endDate,
  currentDate,
  onDateChange,
  totalCount,
  groupedData,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const animatedHeight = useRef(new Animated.Value(1)).current;

  const dates = useMemo(() => {
    const dateArray = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      dateArray.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dateArray;
  }, [startDate, endDate]);

  const getDayName = (date: Date) => {
    return format(date, "EEEEEE", { locale: tr }).toUpperCase();
  };

  const isToday = (date: Date) => {
    return isEqual(
      new Date(date.setHours(0, 0, 0, 0)),
      new Date(new Date().setHours(0, 0, 0, 0))
    );
  };

  const isEndDate = (date: Date) => {
    return isEqual(
      new Date(date.setHours(0, 0, 0, 0)),
      new Date(endDate.setHours(0, 0, 0, 0))
    );
  };

  const getCurrentDateTotal = (date: Date = currentDate) => {
    const dateKey = format(date, "yyyy-MM-dd");
    let total = 0;
    if (groupedData[dateKey]) {
      Object.values(groupedData[dateKey]).forEach((storeData: any) => {
        Object.values(storeData).forEach((receipts: any[]) => {
          total += receipts.length;
        });
      });
    }
    return total;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.spring(animatedHeight, {
      toValue: isExpanded ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const currentDateHasData = getCurrentDateTotal(currentDate) > 0;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [hp("8%"), hp("25%")],
          }),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View style={styles.dateRangeContainer}>
            <Text style={styles.dateRangeText}>
              {!isEqual(startDate, endDate)
                ? `${format(startDate, "d MMM", { locale: tr })} - ${format(
                    endDate,
                    "d MMM yyyy",
                    { locale: tr }
                  )}`
                : format(currentDate, "d MMM yyyy", { locale: tr })}
            </Text>
            <TouchableOpacity
              onPress={toggleExpand}
              style={styles.expandButton}
            >
              <MaterialIcons
                name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={28}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <Animated.View
        style={{
          opacity: animatedHeight,
          transform: [
            {
              scale: animatedHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        }}
      >
        <View style={styles.calendarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesScrollContainer}
            decelerationRate="fast"
            snapToInterval={wp("18%")}
            snapToAlignment="center"
          >
            {dates.map((date) => {
              const isSelected = isEqual(
                new Date(date.setHours(0, 0, 0, 0)),
                new Date(currentDate.setHours(0, 0, 0, 0))
              );
              const dateTotal = getCurrentDateTotal(date);
              const hasData = dateTotal > 0;
              const isEnd = isEndDate(date);

              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.dateButton,
                    hasData && styles.hasDataButton,
                    isEnd && styles.endDateButton,
                    isSelected && !isEnd && styles.selectedDateButton,
                    isToday(date) && styles.todayButton,
                  ]}
                  onPress={() => onDateChange(date)}
                >
                  <Text
                    style={[
                      styles.dayName,
                      hasData && styles.hasDataText,
                      isSelected && !isEnd && styles.selectedText,
                      isEnd && styles.endDateText,
                      isToday(date) && styles.todayText,
                    ]}
                  >
                    {getDayName(date)}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      hasData && styles.hasDataText,
                      isSelected && !isEnd && styles.selectedText,
                      isEnd && styles.endDateText,
                      isToday(date) && styles.todayText,
                    ]}
                  >
                    {format(date, "d")}
                  </Text>
                  {hasData && (
                    <View
                      style={[
                        styles.dataBadge,
                        isSelected && !isEnd && styles.selectedDateBadge,
                        isEnd && styles.endDateBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dataBadgeText,
                          isSelected && !isEnd && styles.selectedDateBadgeText,
                          isEnd && styles.endDateBadgeText,
                        ]}
                      >
                        {dateTotal}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {isExpanded && !currentDateHasData && <NoDataMessage />}
      </Animated.View>
    </Animated.View>
  );
};

const createStyles = (colors: typeof import("@/constant/theme").lightColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.border.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    headerContainer: {
      paddingVertical: hp("1%"),
      backgroundColor: colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: wp("4%"),
    },
    dateRangeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp("2%"),
    },
    dateRangeText: {
      fontSize: wp("4.2%"),
      color: colors.text.primary,
      fontWeight: "600",
    },
    expandButton: {
      padding: wp("1%"),
    },
    calendarContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp("2%"),
      paddingTop: hp("1%"),
      backgroundColor: colors.background.secondary,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border.secondary,
    },
    datesScrollContainer: {
      paddingHorizontal: wp("3%"),
      gap: wp("3%"),
      alignItems: "center",
    },
    dateButton: {
      width: wp("14%"),
      height: wp("14%"),
      borderRadius: wp("8%"),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background.primary,
      borderWidth: 1,
      borderColor: colors.border.secondary,
      marginVertical: hp("2%"),
      marginHorizontal: wp("1%"),
      ...Platform.select({
        ios: {
          shadowColor: colors.border.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    hasDataButton: {
      backgroundColor: colors.primary + "50",
      borderColor: colors.primary,
    },
    selectedDateButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      borderStyle: "solid",
      transform: [{ scale: 1.08 }],
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 5,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    endDateButton: {
      backgroundColor: colors.background.primary,
      borderColor: colors.primary,
      borderWidth: 2,
      borderStyle: "dashed",
    },
    endDateText: {
      color: colors.primary,
      fontWeight: "600",
    },
    todayButton: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    dayName: {
      fontSize: wp("2.5%"),
      color: colors.text.secondary,
      marginBottom: hp("0.2%"),
      fontWeight: "500",
    },
    dateNumber: {
      fontSize: wp("4%"),
      fontWeight: "700",
      color: colors.text.primary,
    },
    hasDataText: {
      color: colors.primary,
      fontWeight: "600",
    },
    selectedText: {
      color: colors.background.primary,
    },
    todayText: {
      color: colors.primary,
    },
    dataBadge: {
      position: "absolute",
      top: -8,
      right: -8,
      minWidth: wp("5%"),
      height: wp("5%"),
      backgroundColor: colors.primary,
      borderRadius: wp("2.5%"),
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 6,
      borderWidth: 2,
      borderColor: colors.background.primary,
    },
    dataBadgeText: {
      color: colors.text.inverse,
      fontSize: wp("2.6%"),
      fontWeight: "800",
    },
    selectedDateBadge: {
      backgroundColor: colors.background.primary,
    },
    selectedDateBadgeText: {
      color: colors.primary,
    },
    noDataContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background.secondary,
      paddingVertical: hp("2%"),
      gap: wp("2%"),
      borderBottomWidth: 1,
      borderBottomColor: colors.border.secondary,
    },
    noDataText: {
      fontSize: wp("3.5%"),
      color: colors.text.tertiary,
      fontWeight: "500",
    },
  });

export default DateNavigationBar;
