import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  visible: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

const ErrorModal: React.FC<Props> = ({
  visible,
  onClose,
  message,
  title = "Hata Oluştu",
}) => {
  const { colors } = useTheme();
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.card.background,
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <View
            style={[styles.iconContainer, { backgroundColor: colors.error }]}
          >
            <Ionicons name="close-outline" size={wp("10%")} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: colors.text.secondary }]}>
            {message}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.error }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Anladım</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: wp("85%"),
    padding: wp("6%"),
    borderRadius: wp("4%"),
    alignItems: "center",
  },
  iconContainer: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  title: {
    fontSize: wp("5.5%"),
    fontWeight: "700",
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  message: {
    fontSize: wp("4%"),
    textAlign: "center",
    marginBottom: hp("3%"),
    lineHeight: hp("3%"),
  },
  button: {
    width: "100%",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("2.5%"),
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});

export default ErrorModal;
