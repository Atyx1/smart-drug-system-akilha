// src/config/toastConfig.tsx
import React from "react";
import { Text } from "react-native";
import {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfigParams,
} from "react-native-toast-message";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#4CAF50",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        marginTop: hp("3%"),
        width: "98%",
        minHeight: hp("18%"),
        maxHeight: hp("35%"),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: "rgba(76, 175, 80, 0.2)",
      }}
      contentContainerStyle={{
        paddingHorizontal: wp("6%"),
        paddingVertical: hp("2.5%"),
      }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "700",
        color: "#4CAF50",
        marginBottom: hp("0.5%"),
      }}
      text2Style={{
        fontSize: wp("4.2%"),
        color: "#1A1A1A",
        marginTop: hp("1%"),
        flexWrap: "wrap",
        flexShrink: 1,
        lineHeight: wp("6%"),
        fontWeight: "400",
      }}
      text2NumberOfLines={6}
      renderLeadingIcon={() => (
        <Text
          style={{ fontSize: wp("4.5%"), marginRight: wp("3%"), opacity: 0.7 }}
        >
          💊
        </Text>
      )}
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#FF3B30",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        marginTop: hp("3%"),
        width: "98%",
        minHeight: hp("18%"),
        maxHeight: hp("35%"),
        shadowColor: "#FF3B30",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: "rgba(255, 59, 48, 0.2)",
      }}
      contentContainerStyle={{
        paddingHorizontal: wp("6%"),
        paddingVertical: hp("2.5%"),
      }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "700",
        color: "#FF3B30",
        marginBottom: hp("0.5%"),
      }}
      text2Style={{
        fontSize: wp("4.2%"),
        color: "#1A1A1A",
        marginTop: hp("1%"),
        flexWrap: "wrap",
        flexShrink: 1,
        lineHeight: wp("6%"),
        fontWeight: "400",
      }}
      text2NumberOfLines={6}
      renderLeadingIcon={() => (
        <Text
          style={{ fontSize: wp("4.5%"), marginRight: wp("3%"), opacity: 0.7 }}
        >
          🚨
        </Text>
      )}
    />
  ),
  info: (props: ToastConfigParams<any>) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: "#6B7280",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        marginTop: hp("3%"),
        width: "92%",
        minHeight: hp("18%"),
        maxHeight: hp("40%"),
        shadowColor: "#6B7280",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: "rgba(107, 114, 128, 0.2)",
      }}
      contentContainerStyle={{
        paddingHorizontal: wp("6%"),
        paddingVertical: hp("2.5%"),
        flex: 1,
      }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "700",
        color: "#6B7280",
        marginBottom: hp("0.5%"),
      }}
      text2Style={{
        fontSize: wp("4.2%"),
        color: "#1A1A1A",
        marginTop: hp("1%"),
        flexWrap: "wrap",
        flexShrink: 1,
        lineHeight: wp("6%"),
        fontWeight: "400",
      }}
      text2NumberOfLines={0}
    />
  ),
  warning: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#FF9500",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        marginTop: hp("3%"),
        width: "98%",
        minHeight: hp("18%"),
        maxHeight: hp("35%"),
        shadowColor: "#FF9500",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: "rgba(255, 149, 0, 0.2)",
      }}
      contentContainerStyle={{
        paddingHorizontal: wp("6%"),
        paddingVertical: hp("2.5%"),
      }}
      text1Style={{
        fontSize: wp("5%"),
        fontWeight: "700",
        color: "#FF9500",
        marginBottom: hp("0.5%"),
      }}
      text2Style={{
        fontSize: wp("4.2%"),
        color: "#1A1A1A",
        marginTop: hp("1%"),
        flexWrap: "wrap",
        flexShrink: 1,
        lineHeight: wp("6%"),
        fontWeight: "400",
      }}
      text2NumberOfLines={6}
      renderLeadingIcon={() => (
        <Text
          style={{ fontSize: wp("4.5%"), marginRight: wp("3%"), opacity: 0.7 }}
        >
          ⚠️
        </Text>
      )}
    />
  ),
};
