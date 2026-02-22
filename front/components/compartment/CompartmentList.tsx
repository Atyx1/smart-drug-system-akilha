import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Platform, TextStyle, ViewStyle } from "react-native";
import { ProgressBar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { CompartmentDto } from "@/types/Types";
import { SHADOWS } from "@/constant/theme";

// Responsive design utilities
const { width, height } = Dimensions.get("window");
const wp = (percentage: number): number => (width * percentage) / 100;
const hp = (percentage: number): number => (height * percentage) / 100;




// Extended CompartmentDto type to ensure consistency
type ExtendedCompartmentDto = CompartmentDto & {
  name?: string;
};

// Varsayılan 4 bölme tanımı
const DEFAULT_COMPARTMENTS: ExtendedCompartmentDto[] = Array.from({ length: 4 }, (_, idx) => ({
  compartmentId: idx + 1, // Using number for compartmentId as required by CompartmentDto
  idx: idx + 1,
  name: `Bölme ${idx + 1}`,
  stock: 0,
  medicineName: "", // Empty string instead of null to match CompartmentDto type
  dosage: "", // Empty string instead of null
  remaining: 0,
  dates: [],
  medicine: null,
}));

// Compartment status indicator and color
interface CompartmentStatus {
  color: 'primary' | 'secondary' | 'error' | 'warning';
  icon: string;
}

const getCompartmentStatus = (remaining: number): CompartmentStatus => {
  if (remaining <= 0) return { color: "warning", icon: "alert-circle-outline" };
  if (remaining < 4) return { color: "error", icon: "alert-outline" };
  return { color: "primary", icon: "check-circle-outline" };
};

interface CompartmentListProps {
  compartments: CompartmentDto[];
  onSelect: (compartment: ExtendedCompartmentDto) => void;
}

const CompartmentList = ({ compartments, onSelect }: CompartmentListProps) => {
  const { colors, theme, activeColorScheme } = useTheme();
  const isDark = activeColorScheme === "dark";
  const shadowStyle = isDark ? SHADOWS.dark.medium : SHADOWS.light.medium;

  // Backend verileriyle defaultları birleştir
  const mergedCompartments = DEFAULT_COMPARTMENTS.map((defaultCompartment) => {
    const found = compartments.find((c: CompartmentDto) => c.idx === defaultCompartment.idx);
    return found || defaultCompartment;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons 
          name="pill" 
          size={wp(5)} 
          color={colors.primary} 
          style={styles.headerIcon}
        />
        <Text style={[styles.header, { color: colors.text.primary }]}>
          İlaç Bölmeleri
        </Text>
      </View>
      <FlatList
        data={mergedCompartments}
        horizontal
        keyExtractor={(item) => item.idx.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const status = getCompartmentStatus(item.remaining);
          const bgColor = status.color === 'primary' ? colors.primary : 
                        status.color === 'secondary' ? colors.secondary :
                        status.color === 'error' ? colors.error :
                        colors.warning;
          const fillPercentage = isNaN(item.remaining) ? 0 : Math.round((item.remaining / 14) * 100);
          
          return (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: colors.card.background } as ViewStyle,
                shadowStyle
              ]}
              onPress={() => onSelect(item as ExtendedCompartmentDto)}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons 
                  name="pill" 
                  size={wp(4.5)} 
                  color={bgColor} 
                  style={{ opacity: 0.9 }}
                />
                <Text style={[styles.cardTitle, { color: colors.text.primary } as TextStyle]}>
                  {(item as ExtendedCompartmentDto).name || `Bölme ${item.idx}`}
                </Text>
              </View>
              
              <View style={styles.statusContainer}>
                <MaterialCommunityIcons 
                  name={status.icon as any} 
                  size={wp(10)} 
                  color={bgColor} 
                  style={{ opacity: 0.8 }}
                />
                <Text style={[styles.percentText, { color: bgColor } as TextStyle]}>
                  {fillPercentage}% Dolu
                </Text>
                <ProgressBar 
                  progress={fillPercentage / 100} 
                  color={bgColor} 
                  style={styles.progressBar}
                />
              </View>
              
              <View style={styles.medicineContainer}>
                {item.medicineName && item.medicineName.trim() !== "" ? (
                  <>
                    <MaterialCommunityIcons 
                      name="medical-bag" 
                      size={wp(4)} 
                      color={colors.secondary} 
                      style={{ opacity: 0.8, marginRight: wp(1.5) }}
                    />
                    <Text style={[styles.medicineText, { color: colors.text.secondary } as TextStyle]}>
                      {item.medicineName}
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.medicineText, { color: colors.text.secondary, fontStyle: "italic" } as TextStyle]}>
                    İlaç Eklenmemiş
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default CompartmentList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(1.5),
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
  },
  headerIcon: {
    marginRight: wp(2),
  },
  header: {
    fontSize: wp(4.5),
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(1),
  },
  card: {
    width: wp(42),
    height: hp(26),
    borderRadius: wp(4),
    padding: wp(3.5),
    marginRight: wp(3),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  cardTitle: {
    fontSize: wp(3.8),
    fontWeight: "600",
    marginLeft: wp(1.5),
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  percentText: {
    fontWeight: "600",
    fontSize: wp(4),
    marginVertical: hp(1),
  },
  progressBar: {
    width: "90%",
    height: hp(0.8),
    borderRadius: wp(1),
    marginTop: hp(0.5),
  },
  medicineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1.5),
  },
  medicineText: {
    fontSize: wp(3.5),
    flexShrink: 1,
  },
});
