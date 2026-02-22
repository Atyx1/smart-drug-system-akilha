import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { FONTS, SHADOWS, SPACING } from "@/constant/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface Props {
  formData: {
    usageType: "regular" | "irregular";
    dayInterval?: number;
  };
  setFormData: (data: any) => void;
  errors?: {
    usageType?: string;
    dayInterval?: string;
    [key: string]: string | undefined;
  };
  setErrors?: (errors: any) => void;
}

const STORAGE_KEY = "medicineUsageTypeData";

type TooltipContent = {
  title: string;
  description: string;
  icon: string;
  examples: Array<{
    icon: string;
    text: string;
  }>;
};

const tooltipContent = {
  regular: {
    title: "Düzenli Kullanım",
    description:
      "İlacı belirli bir program dahilinde düzenli olarak almanız gerekir.",
    icon: "calendar-clock",
    examples: [
      { icon: "pill", text: "Her sabah 1 tablet" },
      { icon: "clock-time-two", text: "Günde 2 kez" },
      { icon: "calendar-week", text: "Her pazartesi 1 kapsül" },
    ],
  },
  irregular: {
    title: "Düzensiz Kullanım",
    description:
      "Belirli bir tekrar düzeni olmayan, ihtiyaç halinde kullanılan veya ileri bir tarihte tek seferlik alınacak ilaçlar için bu seçeneği kullanabilirsiniz.",
    icon: "calendar-alert",
    examples: [],
  },
};

// Sample usage examples for display only
const usageExamples = [
  { icon: "numeric-1-circle", label: "Günde 1 kez", example: "Her sabah" },
  { icon: "numeric-2-circle", label: "Günde 2 kez", example: "Sabah-Akşam" },
  {
    icon: "numeric-3-circle",
    label: "Günde 3 kez",
    example: "Sabah-Öğle-Akşam",
  },
];

const Step2UsageType = ({
  formData,
  setFormData,
  errors = {},
  setErrors = () => {},
}: Props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [tooltipVisible, setTooltipVisible] = useState<
    null | "regular" | "irregular"
  >(null);
  const [showExamples, setShowExamples] = useState(false);

  // Load saved form data when component mounts
  useFocusEffect(
    useCallback(() => {
      const loadSavedFormData = async () => {
        try {
          const savedData = await AsyncStorage.getItem(STORAGE_KEY);
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData((prev: any) => ({ ...prev, ...parsedData }));
          }
        } catch (error) {
          console.error("Failed to load saved usage type data", error);
        }
      };

      loadSavedFormData();
    }, [])
  );

  // Save form data when it changes
  useEffect(() => {
    const saveFormData = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            usageType: formData.usageType,
            dayInterval: formData.dayInterval,
          })
        );
      } catch (error) {
        console.error("Failed to save usage type data", error);
      }
    };

    if (formData.usageType) {
      saveFormData();
      // Clear any error related to usageType
      if (errors.usageType) {
        setErrors({ ...errors, usageType: undefined });
      }
    }
  }, [formData.usageType, formData.dayInterval]);

  const handleSelect = (type: "regular" | "irregular") => {
    setFormData((prev: any) => ({
      ...prev,
      usageType: type,
    }));
  };

  const showTooltip = (type: "regular" | "irregular") => {
    setTooltipVisible(type);
  };

  const hideTooltip = () => {
    setTooltipVisible(null);
  };

  // Kullanım örneklerini göster/gizle durumunu değiştir
  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="clock-time-five-outline"
            size={wp("5.5%")}
            color={colors.primary}
            style={styles.titleIcon}
          />
          <Text style={styles.title}>İlaç Kullanım Tipi</Text>
        </View>

        <View style={styles.optionsContainer}>
          {/* Regular Usage Option with Collapsible Examples */}
          <View
            style={[
              styles.optionWrapper,
              formData.usageType === "regular" && styles.selectedWrapper,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.option,
                formData.usageType === "regular" && styles.selected,
                {
                  borderBottomLeftRadius:
                    formData.usageType === "regular" && showExamples
                      ? 0
                      : wp("3%"),
                  borderBottomRightRadius:
                    formData.usageType === "regular" && showExamples
                      ? 0
                      : wp("3%"),
                },
              ]}
              onPress={() => {
                handleSelect("regular");
                if (formData.usageType === "regular") {
                  toggleExamples();
                } else {
                  setShowExamples(true);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIconWrapper}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={wp("6%")}
                    color={
                      formData.usageType === "regular"
                        ? colors.primary
                        : colors.text.tertiary
                    }
                  />
                </View>
                <View style={styles.optionTextWrapper}>
                  <Text
                    style={[
                      styles.optionText,
                      formData.usageType === "regular" && styles.selectedText,
                    ]}
                  >
                    Düzenli
                  </Text>
                  <Text style={styles.optionDescription}>
                    Belirli aralıklarla alınan ilaçlar
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {formData.usageType === "regular" && (
                  <MaterialCommunityIcons
                    name={showExamples ? "chevron-up" : "chevron-down"}
                    size={wp("5%")}
                    color={colors.text.tertiary}
                    style={{ marginRight: wp("2%") }}
                  />
                )}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    showTooltip("regular");
                  }}
                  style={styles.infoButton}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={wp("5%")}
                    color={colors.text.tertiary}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Examples Content - Part of the Regular Option */}
            {formData.usageType === "regular" && showExamples && (
              <View style={styles.examplesContent}>
                <Text style={styles.examplesDescription}>
                  Yaygın kullanım örnekleri:
                </Text>

                <View style={styles.examplesGrid}>
                  {usageExamples.map((item, index) => (
                    <View key={index} style={styles.exampleItem}>
                      <View style={styles.exampleIconContainer}>
                        <MaterialCommunityIcons
                          name={item.icon as any}
                          size={wp("6%")}
                          color={colors.primary}
                          style={{ opacity: 0.9 }}
                        />
                      </View>
                      <View style={styles.exampleTextContainer}>
                        <Text style={styles.exampleTitle}>{item.label}</Text>
                        <Text style={styles.exampleSubtitle}>
                          {item.example}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Irregular Usage Option */}
          <TouchableOpacity
            style={[
              styles.option,
              formData.usageType === "irregular" && styles.selected,
            ]}
            onPress={() => handleSelect("irregular")}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIconWrapper}>
                <MaterialCommunityIcons
                  name="calendar-alert"
                  size={wp("6%")}
                  color={
                    formData.usageType === "irregular"
                      ? colors.primary
                      : colors.text.tertiary
                  }
                />
              </View>
              <View style={styles.optionTextWrapper}>
                <Text
                  style={[
                    styles.optionText,
                    formData.usageType === "irregular" && styles.selectedText,
                  ]}
                >
                  Düzensiz
                </Text>
                <Text style={styles.optionDescription}>
                  İhtiyaç halinde alınan ilaçlar
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => showTooltip("irregular")}
              style={styles.infoButton}
            >
              <MaterialCommunityIcons
                name="information-outline"
                size={wp("5%")}
                color={colors.accent}
                style={{ opacity: 0.9 }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {errors.usageType && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={wp("4%")}
              color={colors.error}
            />
            <Text style={styles.error}>{errors.usageType}</Text>
          </View>
        )}

        {/* Tooltip Modal */}
        <Modal
          visible={tooltipVisible !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={hideTooltip}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={hideTooltip}
          >
            <View style={styles.tooltipContainer}>
              <View style={styles.tooltipHeader}>
                {tooltipVisible && (
                  <View style={styles.tooltipTitleContainer}>
                    <View style={styles.tooltipIconContainer}>
                      <MaterialCommunityIcons
                        name={
                          tooltipVisible === "regular"
                            ? (tooltipContent.regular.icon as any)
                            : (tooltipContent.irregular.icon as any)
                        }
                        size={wp("7%")}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.tooltipTitle}>
                      {tooltipVisible === "regular"
                        ? tooltipContent.regular.title
                        : tooltipContent.irregular.title}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={hideTooltip}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={wp("6%")}
                    color={colors.text.primary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.tooltipDescription}>
                {tooltipVisible === "regular"
                  ? tooltipContent.regular.description
                  : tooltipContent.irregular.description}
              </Text>

              {tooltipVisible === "regular" && (
                <View style={styles.tooltipExamplesContainer}>
                  <Text style={styles.tooltipExamplesTitle}>Örnekler:</Text>

                  <View style={styles.tooltipExamplesList}>
                    {tooltipContent.regular.examples.map((item, index) => (
                      <View key={index} style={styles.tooltipExampleItem}>
                        <View style={styles.tooltipExampleIconContainer}>
                          <MaterialCommunityIcons
                            name={item.icon as any}
                            size={wp("5%")}
                            color={colors.primary}
                            style={{ opacity: 0.8 }}
                          />
                        </View>
                        <Text style={styles.tooltipExampleText}>
                          {item.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    containerWrapper: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: wp("2%"),
    },
    container: {
      marginTop: hp("2%"),
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("3%"),
      width: "100%",
      maxWidth: wp("90%"),
      borderRadius: wp("3%"),
      backgroundColor: colors.background.primary,
      ...(Platform.OS === "ios" ? SHADOWS.light.medium : { elevation: 3 }),
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("3%"),
    },
    titleIcon: {
      marginRight: wp("2%"),
      opacity: 0.9,
    },
    title: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: colors.text.primary,
    },
    optionsContainer: {
      marginBottom: hp("2%"),
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: wp("4%"),
      marginVertical: hp("1%"),
      borderWidth: 1.5,
      borderColor: colors.border.primary,
      borderRadius: wp("3%"),
      backgroundColor: colors.background.secondary,
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 2 }),
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    optionIconWrapper: {
      width: wp("10%"),
      height: wp("10%"),
      borderRadius: wp("5%"),
      backgroundColor: `${colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("3%"),
    },
    optionTextWrapper: {
      flex: 1,
    },
    optionDescription: {
      fontSize: wp("3.2%"),
      color: colors.text.tertiary,
      marginTop: hp("0.5%"),
    },
    selected: {
      backgroundColor: `${colors.primary}15`, // 15% opacity
      borderColor: colors.primary,
    },
    optionText: {
      fontSize: wp("4%"),
      color: colors.text.primary,
      fontWeight: "500",
    },
    selectedText: {
      fontWeight: "600",
      color: colors.primary,
    },
    infoButton: {
      padding: wp("1%"),
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp("1%"),
      marginBottom: hp("1%"),
    },
    error: {
      color: colors.error,
      marginLeft: wp("1.2%"),
      fontSize: wp("3.5%"),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: wp("5%"),
    },
    tooltipContainer: {
      width: wp("85%"),
      backgroundColor: colors.background.primary,
      borderRadius: wp("4%"),
      padding: wp("5%"),
      ...(Platform.OS === "ios" ? SHADOWS.light.medium : { elevation: 5 }),
    },
    tooltipHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: hp("2%"),
    },
    tooltipTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: colors.primary,
    },
    tooltipContent: {
      fontSize: wp("4%"),
      lineHeight: wp("6%"),
      color: colors.text.primary,
    },
    closeButton: {
      padding: wp("1%"),
      borderRadius: wp("5%"),
    },
    optionWrapper: {
      marginBottom: hp("2%"),
      borderRadius: wp("3%"),
      overflow: "hidden",
    },
    selectedWrapper: {
      ...(Platform.OS === "ios" ? SHADOWS.light.small : { elevation: 1 }),
    },
    examplesContent: {
      padding: wp("3%"),
      backgroundColor: colors.background.secondary,
      borderBottomLeftRadius: wp("3%"),
      borderBottomRightRadius: wp("3%"),
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.border.secondary,
    },
    examplesLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    examplesLabel: {
      fontSize: wp("4%"),
      fontWeight: "500",
      color: colors.text.primary,
      marginLeft: wp("2%"),
    },
    examplesDescription: {
      fontSize: wp("3.2%"),
      color: colors.text.tertiary,
      marginBottom: hp("1.5%"),
      fontStyle: "italic",
    },
    examplesGrid: {
      flexDirection: "column",
    },
    exampleItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("2%"),
      marginBottom: hp("1%"),
      borderRadius: wp("2%"),
      backgroundColor: `${colors.background.primary}95`,
    },
    exampleIconContainer: {
      width: wp("9%"),
      height: wp("9%"),
      borderRadius: wp("4.5%"),
      backgroundColor: `${colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("3%"),
    },
    exampleTextContainer: {
      flex: 1,
    },
    exampleTitle: {
      fontSize: wp("3.5%"),
      fontWeight: "500",
      color: colors.text.primary,
    },
    exampleSubtitle: {
      fontSize: wp("3%"),
      color: colors.text.tertiary,
      marginTop: hp("0.3%"),
    },
    tooltipTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    tooltipIconContainer: {
      width: wp("9%"),
      height: wp("9%"),
      borderRadius: wp("4.5%"),
      backgroundColor: `${colors.primary}15`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("2%"),
    },
    tooltipDescription: {
      fontSize: wp("4%"),
      color: colors.text.primary,
      marginBottom: hp("2%"),
    },
    tooltipExamplesContainer: {
      backgroundColor: `${colors.background.secondary}80`,
      borderRadius: wp("2%"),
      padding: wp("3%"),
    },
    tooltipExamplesTitle: {
      fontSize: wp("3.5%"),
      fontWeight: "500",
      color: colors.text.primary,
      marginBottom: hp("1%"),
    },
    tooltipExamplesList: {
      flexDirection: "column",
    },
    tooltipExampleItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: hp("0.7%"),
    },
    tooltipExampleIconContainer: {
      width: wp("7%"),
      height: wp("7%"),
      borderRadius: wp("3.5%"),
      backgroundColor: `${colors.primary}10`,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("2%"),
    },
    tooltipExampleText: {
      fontSize: wp("3.5%"),
      color: colors.text.primary,
    },
  });

export default Step2UsageType;
