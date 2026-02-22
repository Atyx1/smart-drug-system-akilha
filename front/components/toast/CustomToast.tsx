import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

const { width } = Dimensions.get("window");
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) =>
  (Dimensions.get("window").height * percentage) / 100;

interface CustomToastProps {
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const CustomToast: React.FC<CustomToastProps> = ({
  type,
  title,
  message,
  visible,
  onHide,
  duration = 4000,
}) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const getToastConfig = () => {
    // Tüm tipler için sabit beyaz arka plan ve mavi renk
    return {
      icon: "information-outline",
      backgroundColor: colors.background.primary, // Beyaz arka plan
      borderColor: `${colors.primary}30`,
      iconColor: colors.primary, // Mavi ikon
      textColor: colors.primary, // Mavi yazı
    };
  };

  const config = getToastConfig();

  useEffect(() => {
    if (visible) {
      // Slide in from top
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.toastCard,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
        ]}
        onPress={hideToast}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={config.icon as any}
              size={wp(5.5)}
              color={config.iconColor}
              style={styles.icon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: config.textColor }]}>
              {title}
            </Text>
            <Text style={[styles.message, { color: config.textColor }]}>
              {message}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideToast}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="close"
              size={wp(4)}
              color={colors.text.tertiary}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: hp(6),
    left: wp(4),
    right: wp(4),
    zIndex: 9999,
  },
  toastCard: {
    borderRadius: wp(6),
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: wp(3.5),
  },
  iconContainer: {
    marginRight: wp(3),
    marginTop: wp(0.5),
  },
  icon: {
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
    marginRight: wp(2),
  },
  title: {
    fontSize: wp(4),
    fontWeight: "700",
    lineHeight: wp(5),
    marginBottom: hp(0.8),
  },
  message: {
    fontSize: wp(3.3),
    fontWeight: "500",
    lineHeight: wp(4.5),
  },
  closeButton: {
    padding: wp(1),
    marginTop: wp(-0.5),
  },
  closeIcon: {
    opacity: 0.6,
  },
});

export default CustomToast;
